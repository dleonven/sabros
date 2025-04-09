"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ConfirmPageContent() {
	const searchParams = useSearchParams();
	const message =
		searchParams.get("message") ||
		"Please check your email for a confirmation link.";

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900">
						Email Confirmation
					</h1>
					<p className="mt-4 text-gray-600">{message}</p>
					<p className="mt-2 text-gray-500 text-sm">
						If you don&apos;t see it, please check your spam folder.
					</p>
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
