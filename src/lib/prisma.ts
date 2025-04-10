import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

// Add options to handle prepared statement conflicts
const prismaClientSingleton = () => {
	console.log("[Prisma] Creating new PrismaClient instance");

	// Check if we're using the connection pooler (production) or direct connection (local)
	const isPooledConnection = process.env.DATABASE_URL?.includes(
		"pooler.supabase.com"
	);

	const prisma = new PrismaClient({
		log: [
			{ level: "error", emit: "stdout" },
			{ level: "info", emit: "stdout" },
			{ level: "warn", emit: "stdout" },
		],
		datasourceUrl: isPooledConnection
			? `${process.env.DATABASE_URL}?pgbouncer=true&connection_limit=1&prepare=false`
			: process.env.DATABASE_URL,
	});

	// Add query logging middleware
	prisma.$extends({
		query: {
			$allOperations({ operation, model, args, query }) {
				const before = Date.now();
				return query(args).then((result) => {
					const after = Date.now();
					console.log("[Prisma Query]", {
						model,
						operation,
						args,
						duration: after - before,
						timestamp: new Date(),
					});
					return result;
				});
			},
		},
	});

	return prisma;
};

// Initialize client with debug logging
let prismaInstance: PrismaClient;

if (process.env.NODE_ENV !== "production") {
	if (!globalForPrisma.prisma) {
		console.log("[Prisma] Initializing development instance");
		globalForPrisma.prisma = prismaClientSingleton();
		prismaInstance = globalForPrisma.prisma;
	} else {
		console.log("[Prisma] Reusing existing development instance");
		prismaInstance = globalForPrisma.prisma;
	}
} else {
	console.log("[Prisma] Initializing production instance");
	prismaInstance = prismaClientSingleton();
}

export const prisma = prismaInstance;

// Clean up the connection when the app is shutting down
process.on("beforeExit", async () => {
	console.log("[Prisma] Disconnecting on beforeExit");
	await prisma.$disconnect();
});

// Handle unexpected shutdowns
process.on("SIGINT", async () => {
	console.log("[Prisma] Disconnecting on SIGINT");
	await prisma.$disconnect();
	process.exit(0);
});

process.on("SIGTERM", async () => {
	console.log("[Prisma] Disconnecting on SIGTERM");
	await prisma.$disconnect();
	process.exit(0);
});
