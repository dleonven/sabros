import Link from "next/link";

export default function SuccessPage() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="text-center">
				<h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
				<p className="text-lg text-gray-600">
					Thank you for your purchase. You will receive a confirmation
					email shortly.
				</p>
				<Link
					href="/"
					className="mt-8 inline-block rounded-full border border-solid border-transparent transition-colors bg-foreground text-background px-6 py-3 hover:bg-[#383838] dark:hover:bg-[#ccc]"
				>
					Return Home
				</Link>
			</div>
		</div>
	);
}
