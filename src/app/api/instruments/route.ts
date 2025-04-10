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
	let requestData;
	try {
		requestData = await request.json();
	} catch (parseError) {
		console.error("Error parsing request data:", parseError);
		return NextResponse.json(
			{ error: "Invalid request data" },
			{ status: 400 }
		);
	}

	try {
		const instrument = await prisma.instruments.create({
			data: {
				name: requestData.name,
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
	let requestData;
	try {
		requestData = await request.json();
	} catch (parseError) {
		console.error("Error parsing request data:", parseError);
		return NextResponse.json(
			{ error: "Invalid request data" },
			{ status: 400 }
		);
	}

	try {
		const instrument = await prisma.instruments.update({
			where: { id: BigInt(requestData.id) },
			data: {
				name: requestData.name,
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
	let requestData;
	try {
		requestData = await request.json();
	} catch (parseError) {
		console.error("Error parsing request data:", parseError);
		return NextResponse.json(
			{ error: "Invalid request data" },
			{ status: 400 }
		);
	}

	try {
		await prisma.instruments.delete({
			where: { id: BigInt(requestData.id) },
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
