import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const id = BigInt(params.id);
		const { name } = await req.json();

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

		return NextResponse.json({
			...instrument,
			id: instrument.id.toString(),
		});
	} catch (error) {
		console.error("Error updating instrument:", error);
		return NextResponse.json(
			{ error: "Failed to update instrument" },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const id = BigInt(params.id);

		await prisma.instruments.delete({
			where: { id },
		});

		return new Response(null, { status: 204 });
	} catch (error) {
		console.error("Error deleting instrument:", error);
		return NextResponse.json(
			{ error: "Failed to delete instrument" },
			{ status: 500 }
		);
	}
}
