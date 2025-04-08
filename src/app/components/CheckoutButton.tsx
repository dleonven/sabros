"use client";

import { loadStripe } from "@stripe/stripe-js";

// Make sure to add your publishable key in your .env.local file
const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface CheckoutButtonProps {
	amount: number;
	currency?: string;
}

export default function CheckoutButton({
	amount,
	currency = "usd",
}: CheckoutButtonProps) {
	const handleCheckout = async () => {
		try {
			const response = await fetch("/api/checkout/route", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					amount,
					currency,
				}),
			});

			const { sessionId } = await response.json();
			const stripe = await stripePromise;

			if (!stripe) {
				throw new Error("Stripe failed to initialize");
			}

			const { error } = await stripe.redirectToCheckout({
				sessionId,
			});

			if (error) {
				console.error("Error:", error);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<button
			onClick={handleCheckout}
			className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
		>
			Pay Now
		</button>
	);
}
