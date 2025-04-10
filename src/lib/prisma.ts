import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

// Add options to handle prepared statement conflicts
const prismaClientSingleton = () => {
	console.log("[Prisma] Creating new PrismaClient instance");
	return new PrismaClient({
		log: [
			{ level: "query", emit: "event" },
			{ level: "error", emit: "stdout" },
			{ level: "info", emit: "stdout" },
			{ level: "warn", emit: "stdout" },
		],
		// Adding connection management options to help with the "prepared statement already exists" error
		datasources: {
			db: {
				url: process.env.DATABASE_URL,
			},
		},
	});
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

// Add query logging
type QueryEvent = {
	timestamp: Date;
	query: string;
	params: string;
	duration: number;
	target: string;
};

prismaInstance.$on("query", (e: QueryEvent) => {
	console.log("[Prisma Query]", {
		query: e.query,
		params: e.params,
		duration: e.duration,
		timestamp: e.timestamp,
	});
});

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
