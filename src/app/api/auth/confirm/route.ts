import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const token_hash = searchParams.get("token_hash");
	const type = searchParams.get("type") as EmailOtpType | null;

	console.log("API auth confirmation route handler called");
	console.log("token_hash:", token_hash);
	console.log("type:", type);
	console.log("URL:", request.url);

	if (token_hash && type) {
		const supabase = await createClient();
		const { error } = await supabase.auth.verifyOtp({
			type,
			token_hash,
		});

		if (!error) {
			console.log("Email verification successful");
			// Redirect to the confirmation page with success message
			return NextResponse.redirect(
				new URL("/auth/confirm?status=success", request.url)
			);
		} else {
			console.error("Email verification error:", error);
			// Redirect to confirmation page with error
			return NextResponse.redirect(
				new URL(
					`/auth/confirm?status=error&message=${encodeURIComponent(
						error.message
					)}`,
					request.url
				)
			);
		}
	}

	// If we get here, something went wrong
	return NextResponse.redirect(
		new URL(
			"/auth/confirm?status=error&message=" +
				encodeURIComponent("Missing verification parameters"),
			request.url
		)
	);
}
