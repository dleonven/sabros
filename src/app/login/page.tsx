"use client";

import { login, signup } from "./actions";
import { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

// Different modes for the auth UI
type AuthMode = "selection" | "signin" | "signup";

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [authMode, setAuthMode] = useState<AuthMode>("selection");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const searchParams = useSearchParams();

	useEffect(() => {
		const error = searchParams.get("error");
		if (error) {
			setErrorMessage(decodeURIComponent(error));
		}
	}, [searchParams]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		if (authMode === "signin") {
			login(formData);
		} else if (authMode === "signup") {
			signup(formData);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
				{errorMessage && (
					<div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg flex items-center">
						<AlertCircle className="h-5 w-5 mr-2" />
						<span>{errorMessage}</span>
						<button
							onClick={() => setErrorMessage(null)}
							className="ml-auto text-red-500 hover:text-red-700"
						>
							×
						</button>
					</div>
				)}

				<div className="text-center">
					{authMode === "selection" ? (
						<>
							<h2 className="mt-6 text-3xl font-bold text-gray-900">
								Welcome
							</h2>
							<p className="mt-2 text-sm text-gray-600">
								Sign in to your account or create a new one
							</p>
						</>
					) : authMode === "signin" ? (
						<>
							<div className="flex items-center justify-center mb-4">
								<button
									onClick={() => setAuthMode("selection")}
									className="absolute left-8 top-8 p-2 text-gray-500 hover:text-gray-700"
								>
									<ArrowLeft size={20} />
								</button>
								<h2 className="text-3xl font-bold text-gray-900">
									Sign In
								</h2>
							</div>
							<p className="mt-2 text-sm text-gray-600">
								Enter your credentials to access your account
							</p>
						</>
					) : (
						<>
							<div className="flex items-center justify-center mb-4">
								<button
									onClick={() => setAuthMode("selection")}
									className="absolute left-8 top-8 p-2 text-gray-500 hover:text-gray-700"
								>
									<ArrowLeft size={20} />
								</button>
								<h2 className="text-3xl font-bold text-gray-900">
									Sign Up
								</h2>
							</div>
							<p className="mt-2 text-sm text-gray-600">
								Create a new account to get started
							</p>
						</>
					)}
				</div>

				{authMode === "selection" ? (
					<div className="mt-8 space-y-4">
						<button
							onClick={() => setAuthMode("signin")}
							className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
						>
							Sign In
						</button>
						<button
							onClick={() => setAuthMode("signup")}
							className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
						>
							Sign Up
						</button>
					</div>
				) : (
					<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
						<div className="space-y-4">
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700"
								>
									Email
								</label>
								<input
									id="email"
									name="email"
									type="email"
									required
									className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>

							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-gray-700"
								>
									Password
								</label>
								<div className="relative">
									<input
										id="password"
										name="password"
										type={
											showPassword ? "text" : "password"
										}
										required
										minLength={6}
										className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
									/>
									<button
										type="button"
										onClick={() =>
											setShowPassword(!showPassword)
										}
										className="absolute inset-y-0 right-0 pr-3 flex items-center"
									>
										{showPassword ? (
											<EyeOff className="h-5 w-5 text-gray-400" />
										) : (
											<Eye className="h-5 w-5 text-gray-400" />
										)}
									</button>
								</div>
							</div>
						</div>

						<div>
							<button
								type="submit"
								className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
							>
								{authMode === "signin" ? "Sign In" : "Sign Up"}
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
