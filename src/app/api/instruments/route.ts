import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type ErrorWithDetails = Error & {
	code?: string;
	meta?: unknown;
};

// Helper to log detailed error information
function logError(context: string, error: ErrorWithDetails) {
	console.error(`[${context}] Error details:`, {
		message: error.message,
		code: error.code,
		name: error.name,
		stack: error.stack,
		meta: error?.meta,
	});
}

// GET all instruments
export async function GET() {
	console.log("[GET /api/instruments] Starting request");
	try {
		const instruments = await prisma.instruments.findMany({
			orderBy: { id: "asc" },
		});
		console.log(
			`[GET /api/instruments] Successfully fetched ${instruments.length} instruments`
		);

		// Convert BigInt IDs to strings
		const serializedInstruments = instruments.map((instrument) => ({
			...instrument,
			id: instrument.id.toString(),
		}));
		return NextResponse.json(serializedInstruments);
	} catch (error) {
		logError("GET /api/instruments", error as ErrorWithDetails);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return NextResponse.json(
				{
					error: "Database error",
					code: error.code,
					meta: error.meta,
				},
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ error: "Failed to fetch instruments" },
			{ status: 500 }
		);
	}
}

// POST new instrument
export async function POST(request: Request) {
	console.log("[POST /api/instruments] Starting request");
	let requestData;
	try {
		requestData = await request.json();
		console.log("[POST /api/instruments] Request data:", requestData);
	} catch (parseError) {
		logError(
			"POST /api/instruments - Parse",
			parseError as ErrorWithDetails
		);
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
		console.log("[POST /api/instruments] Created instrument:", instrument);

		// Convert BigInt ID to string
		const serializedInstrument = {
			...instrument,
			id: instrument.id.toString(),
		};
		return NextResponse.json(serializedInstrument);
	} catch (error) {
		logError("POST /api/instruments - Create", error as ErrorWithDetails);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return NextResponse.json(
				{
					error: "Database error",
					code: error.code,
					meta: error.meta,
				},
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ error: "Failed to create instrument" },
			{ status: 500 }
		);
	}
}

// PUT update instrument
export async function PUT(request: Request) {
	console.log("[PUT /api/instruments] Starting request");
	let requestData;
	try {
		requestData = await request.json();
		console.log("[PUT /api/instruments] Request data:", requestData);
	} catch (parseError) {
		logError(
			"PUT /api/instruments - Parse",
			parseError as ErrorWithDetails
		);
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
		console.log("[PUT /api/instruments] Updated instrument:", instrument);

		// Convert BigInt ID to string
		const serializedInstrument = {
			...instrument,
			id: instrument.id.toString(),
		};
		return NextResponse.json(serializedInstrument);
	} catch (error) {
		logError("PUT /api/instruments - Update", error as ErrorWithDetails);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return NextResponse.json(
				{
					error: "Database error",
					code: error.code,
					meta: error.meta,
				},
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ error: "Failed to update instrument" },
			{ status: 500 }
		);
	}
}

// DELETE instrument
export async function DELETE(request: Request) {
	console.log("[DELETE /api/instruments] Starting request");
	let requestData;
	try {
		requestData = await request.json();
		console.log("[DELETE /api/instruments] Request data:", requestData);
	} catch (parseError) {
		logError(
			"DELETE /api/instruments - Parse",
			parseError as ErrorWithDetails
		);
		return NextResponse.json(
			{ error: "Invalid request data" },
			{ status: 400 }
		);
	}

	try {
		await prisma.instruments.delete({
			where: { id: BigInt(requestData.id) },
		});
		console.log(
			"[DELETE /api/instruments] Successfully deleted instrument:",
			requestData.id
		);
		return NextResponse.json({ message: "Instrument deleted" });
	} catch (error) {
		logError("DELETE /api/instruments - Delete", error as ErrorWithDetails);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return NextResponse.json(
				{
					error: "Database error",
					code: error.code,
					meta: error.meta,
				},
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ error: "Failed to delete instrument" },
			{ status: 500 }
		);
	}
}
