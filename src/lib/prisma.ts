import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

// Add options to handle prepared statement conflicts
const prismaClientSingleton = () => {
	return new PrismaClient({
		log:
			process.env.NODE_ENV === "development"
				? ["error", "warn"]
				: ["error"],
		// Adding connection management options to help with the "prepared statement already exists" error
		datasources: {
			db: {
				url: process.env.DATABASE_URL
					? `${process.env.DATABASE_URL}?pgbouncer=true&pool_timeout=20&connection_limit=5&statement_cache_size=0`
					: undefined,
			},
		},
	});
};

if (process.env.NODE_ENV !== "production") {
	if (!globalForPrisma.prisma) {
		globalForPrisma.prisma = prismaClientSingleton();
	}
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// Attach to global in development for hot-reload resilience
if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

// Clean up the connection when the app is shutting down
process.on("beforeExit", async () => {
	await prisma.$disconnect();
});
