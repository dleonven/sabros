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
	console.log("Full URL:", request.url);
	console.log("Headers:", Object.fromEntries([...request.headers.entries()]));

	if (token_hash && type) {
		try {
			const supabase = await createClient();
			console.log("Verifying OTP with Supabase");
			const { error } = await supabase.auth.verifyOtp({
				type,
				token_hash,
			});

			if (!error) {
				console.log("Email verification successful");
				const redirectUrl = new URL(
					"/auth/confirm?status=success",
					request.url
				);
				console.log("Redirecting to:", redirectUrl.toString());
				// Redirect to the confirmation page with success message
				return NextResponse.redirect(redirectUrl);
			} else {
				console.error("Email verification error:", error);
				// Redirect to confirmation page with error
				const errorUrl = new URL(
					`/auth/confirm?status=error&message=${encodeURIComponent(
						error.message
					)}`,
					request.url
				);
				console.log("Redirecting to error URL:", errorUrl.toString());
				return NextResponse.redirect(errorUrl);
			}
		} catch (e) {
			console.error("Exception in auth confirmation:", e);
			const errorUrl = new URL(
				`/auth/confirm?status=error&message=${encodeURIComponent(
					"Server error occurred"
				)}`,
				request.url
			);
			return NextResponse.redirect(errorUrl);
		}
	}

	// If we get here, something went wrong
	console.log("Missing verification parameters");
	const missingParamsUrl = new URL(
		"/auth/confirm?status=error&message=" +
			encodeURIComponent("Missing verification parameters"),
		request.url
	);
	console.log("Redirecting to:", missingParamsUrl.toString());
	return NextResponse.redirect(missingParamsUrl);
}
