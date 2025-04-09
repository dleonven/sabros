import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
	request: Request,
	context: { params: { id: string } }
) {
	try {
		// Await params before using properties
		const { id: paramId } = await context.params;
		const id = BigInt(paramId);
		const { name } = await request.json();

		if (!name || typeof name !== "string") {
			return NextResponse.json(
				{ error: "Name is required and must be a string" },
				{ status: 400 }
			);
		}

		const instrument = await prisma.instruments.update({
			where: { id },
			data: { name },
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

export async function DELETE(
	request: Request,
	context: { params: { id: string } }
) {
	try {
		// Await params before using properties
		const { id: paramId } = await context.params;
		const id = BigInt(paramId);

		await prisma.instruments.delete({
			where: { id },
		});

		return new NextResponse(null, { status: 204 });
	} catch (error) {
		console.error("Error deleting instrument:", error);
		return NextResponse.json(
			{ error: "Failed to delete instrument" },
			{ status: 500 }
		);
	}
}
