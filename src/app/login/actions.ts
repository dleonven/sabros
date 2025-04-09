"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// Helper function to get the base URL with Vercel deployment support
function getBaseUrl() {
	// Debug logging
	console.log("Environment variables for base URL determination:");
	console.log("- NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);
	console.log("- VERCEL_URL:", process.env.VERCEL_URL);
	console.log("- VERCEL_ENV:", process.env.VERCEL_ENV);
	console.log(
		"- NEXT_PUBLIC_VERCEL_URL:",
		process.env.NEXT_PUBLIC_VERCEL_URL
	);

	// Priority order for base URL:

	// 1. Explicitly configured base URL (from env vars)
	if (process.env.NEXT_PUBLIC_BASE_URL) {
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL.trim();
		console.log("Using NEXT_PUBLIC_BASE_URL:", baseUrl);
		return baseUrl;
	}

	// 2. Vercel preview deployment URL
	if (process.env.VERCEL_URL) {
		const baseUrl = `https://${process.env.VERCEL_URL}`;
		console.log("Using VERCEL_URL:", baseUrl);
		return baseUrl;
	}

	// 3. Vercel production deployment URL
	if (
		process.env.VERCEL_ENV === "production" &&
		process.env.NEXT_PUBLIC_VERCEL_URL
	) {
		const baseUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
		console.log("Using NEXT_PUBLIC_VERCEL_URL:", baseUrl);
		return baseUrl;
	}

	// 4. Fallback to localhost for development
	console.log("Falling back to localhost");
	return "http://localhost:3000";
}

export async function login(formData: FormData) {
	console.log("Login function called");
	const supabase = await createClient();

	// Basic validation
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	if (!email || !password) {
		redirect(
			`/login?error=${encodeURIComponent(
				"Email and password are required"
			)}`
		);
	}

	if (!email.includes("@") || !email.includes(".")) {
		redirect(`/login?error=${encodeURIComponent("Invalid email format")}`);
	}

	if (password.length < 6) {
		redirect(
			`/login?error=${encodeURIComponent(
				"Password must be at least 6 characters"
			)}`
		);
	}

	// Proceed with login
	console.log("Attempting login with email:", email);
	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		console.error("Login error:", error);
		redirect(`/login?error=${encodeURIComponent(error.message)}`);
	}

	revalidatePath("/", "layout");
	redirect("/private");
}

export async function signup(formData: FormData) {
	console.log("Signup function called");
	const supabase = await createClient();

	// Basic validation
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	if (!email || !password) {
		redirect(
			`/login?error=${encodeURIComponent(
				"Email and password are required"
			)}`
		);
	}

	if (!email.includes("@") || !email.includes(".")) {
		redirect(`/login?error=${encodeURIComponent("Invalid email format")}`);
	}

	if (password.length < 6) {
		redirect(
			`/login?error=${encodeURIComponent(
				"Password must be at least 6 characters"
			)}`
		);
	}

	// Determine the correct redirect URL based on environment
	const baseUrl = getBaseUrl();
	// Use /auth/confirm instead of /auth/callback to match Supabase's behavior
	const redirectTo = `${baseUrl}/auth/confirm`;

	console.log("Using redirect URL for signup:", redirectTo);

	// Log the full signup options to verify what's being sent to Supabase
	console.log("Signup options:", {
		email,
		emailRedirectTo: redirectTo,
	});

	// Proceed with signup
	console.log("Attempting signup with email:", email);
	const { error, data: signupData } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: redirectTo,
		},
	});

	if (error) {
		console.error("Signup error:", error);
		redirect(`/login?error=${encodeURIComponent(error.message)}`);
	}

	console.log("Signup successful:", signupData);

	// If identities array is empty, it means the user already exists
	if (signupData?.user?.identities?.length === 0) {
		console.log("Email already registered");
		redirect(
			`/login?error=${encodeURIComponent(
				"This email is already registered"
			)}`
		);
	}

	// If confirmation email was sent
	if (signupData?.user?.confirmation_sent_at) {
		redirect("/auth/confirm?message=Check your email for confirmation");
	}

	revalidatePath("/", "layout");
	redirect("/private");
}
