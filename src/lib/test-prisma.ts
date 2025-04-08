import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	// Create a new instrument
	const newInstrument = await prisma.instruments.create({
		data: {
			name: "Prisma Test Guitar",
		},
	});
	console.log("Created new instrument:", newInstrument);

	// List all instruments
	const allInstruments = await prisma.instruments.findMany();
	console.log("All instruments:", allInstruments);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
