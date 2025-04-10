import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
	try {
		const url = new URL(req.url);
		const idParam = url.pathname.split("/").pop();
		if (!idParam) {
			return NextResponse.json(
				{ error: "Missing ID in URL" },
				{ status: 400 }
			);
		}
		const id = BigInt(idParam);
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

export async function DELETE(req: NextRequest) {
	try {
		const url = new URL(req.url);
		const idParam = url.pathname.split("/").pop();
		if (!idParam) {
			return NextResponse.json(
				{ error: "Missing ID in URL" },
				{ status: 400 }
			);
		}
		const id = BigInt(idParam);

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
