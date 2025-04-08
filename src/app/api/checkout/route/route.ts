import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
	apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { amount, currency = "usd" } = body;

		// Create a Stripe Checkout Session
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: [
				{
					price_data: {
						currency,
						product_data: {
							name: "Your Product Name",
							description: "Product description here",
						},
						unit_amount: amount, // Amount in cents
					},
					quantity: 1,
				},
			],
			mode: "payment",
			success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
		});

		return NextResponse.json({ sessionId: session.id });
	} catch (error) {
		console.error("Error creating checkout session:", error);
		return NextResponse.json(
			{ error: "Error creating checkout session" },
			{ status: 500 }
		);
	}
}
