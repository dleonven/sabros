"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

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

	// Proceed with signup
	console.log("Attempting signup with email:", email);
	const { error, data: signupData } = await supabase.auth.signUp({
		email,
		password,
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
