import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all instruments
export async function GET() {
	try {
		const instruments = await prisma.instruments.findMany({
			orderBy: { id: "asc" },
		});
		// Convert BigInt IDs to strings
		const serializedInstruments = instruments.map((instrument) => ({
			...instrument,
			id: instrument.id.toString(),
		}));
		return NextResponse.json(serializedInstruments);
	} catch (error) {
		console.error("Error fetching instruments:", error);
		return NextResponse.json(
			{ error: "Failed to fetch instruments" },
			{ status: 500 }
		);
	}
}

// POST new instrument
export async function POST(request: Request) {
	try {
		const json = await request.json();
		const instrument = await prisma.instruments.create({
			data: {
				name: json.name,
			},
		});
		// Convert BigInt ID to string
		const serializedInstrument = {
			...instrument,
			id: instrument.id.toString(),
		};
		return NextResponse.json(serializedInstrument);
	} catch (error) {
		console.error("Error creating instrument:", error);
		return NextResponse.json(
			{ error: "Failed to create instrument" },
			{ status: 500 }
		);
	}
}

// PUT update instrument
export async function PUT(request: Request) {
	try {
		const json = await request.json();
		const instrument = await prisma.instruments.update({
			where: { id: BigInt(json.id) },
			data: {
				name: json.name,
			},
		});
		// Convert BigInt ID to string
		const serializedInstrument = {
			...instrument,
			id: instrument.id.toString(),
		};
		return NextResponse.json(serializedInstrument);
	} catch (error) {
		console.error("Error updating instrument:", error);
		return NextResponse.json(
			{ error: "Failed to update instrument" },
			{ status: 500 }
		);
	}
}

// DELETE instrument
export async function DELETE(request: Request) {
	try {
		const json = await request.json();
		await prisma.instruments.delete({
			where: { id: BigInt(json.id) },
		});
		return NextResponse.json({ message: "Instrument deleted" });
	} catch (error) {
		console.error("Error deleting instrument:", error);
		return NextResponse.json(
			{ error: "Failed to delete instrument" },
			{ status: 500 }
		);
	}
}
