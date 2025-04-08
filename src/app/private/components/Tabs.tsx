"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface TabsProps {
	instrumentsContent: React.ReactNode;
}

export function Tabs({ instrumentsContent }: TabsProps) {
	const [activeTab, setActiveTab] = useState("instruments");

	return (
		<Card>
			<div className="border-b border-gray-200">
				<nav className="-mb-px flex space-x-8" aria-label="Tabs">
					<button
						onClick={() => setActiveTab("instruments")}
						className={`${
							activeTab === "instruments"
								? "border-blue-500 text-blue-600"
								: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
						} whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
					>
						Instruments
					</button>
					<button
						onClick={() => setActiveTab("analytics")}
						className={`${
							activeTab === "analytics"
								? "border-blue-500 text-blue-600"
								: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
						} whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
					>
						Analytics
					</button>
					<button
						onClick={() => setActiveTab("reports")}
						className={`${
							activeTab === "reports"
								? "border-blue-500 text-blue-600"
								: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
						} whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
					>
						Reports
					</button>
				</nav>
			</div>
			<CardContent className="pt-6">
				{activeTab === "instruments" && instrumentsContent}
				{activeTab === "analytics" && (
					<div className="text-center text-gray-500">
						Analytics dashboard coming soon
					</div>
				)}
				{activeTab === "reports" && (
					<div className="text-center text-gray-500">
						Reports dashboard coming soon
					</div>
				)}
			</CardContent>
		</Card>
	);
}
