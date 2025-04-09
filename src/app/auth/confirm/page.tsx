"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { EmailOtpType } from "@supabase/supabase-js";

function ConfirmPageContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [status, setStatus] = useState<
		"loading" | "success" | "error" | "waiting"
	>("waiting");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	// Message to display when no token is provided (just showing the confirmation message)
	const message =
		searchParams.get("message") ||
		"Please check your email for a confirmation link.";

	// Check for token and type parameters which indicate this is a verification link
	const token_hash = searchParams.get("token_hash");
	const type = searchParams.get("type") as EmailOtpType | null;

	useEffect(() => {
		// Only run verification if we have token parameters
		if (token_hash && type) {
			setStatus("loading");
			const verifyToken = async () => {
				try {
					const supabase = createClient();
					const { error } = await supabase.auth.verifyOtp({
						type,
						token_hash,
					});

					if (error) {
						console.error("Verification error:", error);
						setStatus("error");
						setErrorMessage(error.message);
					} else {
						setStatus("success");
						// Redirect to private area after successful verification
						setTimeout(() => {
							router.push("/private");
						}, 2000);
					}
				} catch (err) {
					console.error("Error during verification:", err);
					setStatus("error");
					setErrorMessage("An unexpected error occurred");
				}
			};

			verifyToken();
		}
	}, [token_hash, type, router]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
				<div className="text-center">
					{status === "waiting" && (
						<>
							<h1 className="text-2xl font-bold text-gray-900">
								Email Confirmation
							</h1>
							<p className="mt-4 text-gray-600">{message}</p>
							<p className="mt-2 text-gray-500 text-sm">
								If you don&apos;t see it, please check your spam
								folder.
							</p>
						</>
					)}

					{status === "loading" && (
						<>
							<h1 className="text-2xl font-bold text-gray-900">
								Verifying Your Email
							</h1>
							<p className="mt-4 text-gray-600">
								Please wait while we verify your email
								address...
							</p>
							<div className="mt-6 flex justify-center">
								<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
							</div>
						</>
					)}

					{status === "success" && (
						<>
							<h1 className="text-2xl font-bold text-green-600">
								Email Verified!
							</h1>
							<p className="mt-4 text-gray-600">
								Your email has been successfully verified.
								You&apos;ll be redirected to your account.
							</p>
						</>
					)}

					{status === "error" && (
						<>
							<h1 className="text-2xl font-bold text-red-600">
								Verification Failed
							</h1>
							<p className="mt-4 text-gray-600">
								We couldn&apos;t verify your email address.
							</p>
							{errorMessage && (
								<p className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
									{errorMessage}
								</p>
							)}
						</>
					)}
				</div>

				<div className="mt-6">
					{status !== "loading" && status !== "success" && (
						<Link
							href="/login"
							className="block text-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
						>
							Return to Login
						</Link>
					)}
				</div>
			</div>
		</div>
	);
}

export default function ConfirmPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center bg-gray-50">
					<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
						<div className="text-center">
							<h1 className="text-2xl font-bold text-gray-900">
								Email Confirmation
							</h1>
							<p className="mt-4 text-gray-600">Loading...</p>
						</div>
					</div>
				</div>
			}
		>
			<ConfirmPageContent />
		</Suspense>
	);
}
