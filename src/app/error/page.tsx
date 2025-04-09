"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import Link from "next/link";

function ErrorPageContent() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

	useEffect(() => {
		console.error("Authentication error:", error);
	}, [error]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-red-600">
						Authentication Error
					</h1>
					<p className="mt-2 text-gray-600">
						There was an error processing your authentication
						request. Please try again or contact support if the
						problem persists.
					</p>
					{error && (
						<p className="mt-4 p-2 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
							Error details: {error}
						</p>
					)}
				</div>

				<div className="mt-6">
					<Link
						href="/login"
						className="block text-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
					>
						Return to Login
					</Link>
				</div>
			</div>
		</div>
	);
}

export default function ErrorPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center bg-gray-50">
					<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
						<div className="text-center">
							<h1 className="text-2xl font-bold text-red-600">
								Error
							</h1>
							<p className="mt-2 text-gray-600">
								Loading error details...
							</p>
						</div>
					</div>
				</div>
			}
		>
			<ErrorPageContent />
		</Suspense>
	);
}
