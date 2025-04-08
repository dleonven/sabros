"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import CheckoutButton from "@/app/components/CheckoutButton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
	const router = useRouter();

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="max-w-4xl mx-auto">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<div className="flex items-center gap-4">
								<Button
									variant="ghost"
									size="icon"
									onClick={() => router.back()}
									className="hover:bg-gray-100"
								>
									<ArrowLeft className="h-5 w-5" />
								</Button>
								<div>
									<CardTitle>Payment</CardTitle>
									<CardDescription>
										Choose your payment plan and complete
										the checkout process
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-6">
								{/* Basic Plan */}
								<div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
									<h3 className="text-xl font-semibold mb-2">
										Basic Plan
									</h3>
									<p className="text-gray-600 mb-4">
										Perfect for getting started with
										instrument management
									</p>
									<div className="flex items-baseline mb-4">
										<span className="text-3xl font-bold">
											$1
										</span>
										<span className="text-gray-500 ml-1">
											/month
										</span>
									</div>
									<ul className="space-y-2 mb-6">
										<li className="flex items-center">
											<svg
												className="h-5 w-5 text-green-500 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
											Up to 5 instruments
										</li>
										<li className="flex items-center">
											<svg
												className="h-5 w-5 text-green-500 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
											Basic analytics
										</li>
										<li className="flex items-center">
											<svg
												className="h-5 w-5 text-green-500 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
											Email support
										</li>
									</ul>
									<CheckoutButton amount={100} />
								</div>

								{/* Pro Plan */}
								<div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
									<h3 className="text-xl font-semibold mb-2">
										Pro Plan
									</h3>
									<p className="text-gray-600 mb-4">
										Advanced features for professional
										instrument management
									</p>
									<div className="flex items-baseline mb-4">
										<span className="text-3xl font-bold">
											$5
										</span>
										<span className="text-gray-500 ml-1">
											/month
										</span>
									</div>
									<ul className="space-y-2 mb-6">
										<li className="flex items-center">
											<svg
												className="h-5 w-5 text-green-500 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
											Unlimited instruments
										</li>
										<li className="flex items-center">
											<svg
												className="h-5 w-5 text-green-500 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
											Advanced analytics
										</li>
										<li className="flex items-center">
											<svg
												className="h-5 w-5 text-green-500 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
											Priority support
										</li>
										<li className="flex items-center">
											<svg
												className="h-5 w-5 text-green-500 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
											API access
										</li>
									</ul>
									<CheckoutButton amount={500} />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
