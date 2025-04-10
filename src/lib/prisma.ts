import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

const prismaClientSingleton = () => {
	console.log("[Prisma] Creating new PrismaClient instance");

	return new PrismaClient({
		datasourceUrl: `${process.env.DATABASE_URL}?pgbouncer=true&connection_limit=1&pool_timeout=20&statement_cache_size=0&prepared_statement_cache_size=0`,
	});
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
	console.log("[Prisma] Initializing development instance");
	globalForPrisma.prisma = prisma;
} else {
	console.log("[Prisma] Initializing production instance");
}

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
