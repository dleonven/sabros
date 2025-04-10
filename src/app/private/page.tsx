import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import InstrumentList from "./components/InstrumentList";
import { Tabs } from "./components/Tabs";
import { Header } from "./components/Header";
import type { instruments } from "@prisma/client";

export default async function PrivatePage() {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.getUser();
	if (error || !data?.user?.email) {
		redirect("/login");
	}

	// Fetch all instruments with error handling
	let instruments: instruments[] = [];
	try {
		instruments = await prisma.instruments.findMany({
			orderBy: {
				name: "asc",
			},
		});
		console.log(`Successfully fetched ${instruments.length} instruments`);
	} catch (err) {
		console.error("Error fetching instruments:", err);
		// Continue with empty instruments rather than crashing
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Header userEmail={data.user.email} />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="max-w-4xl mx-auto">
					<div className="mb-8">
						<h1 className="text-2xl font-bold mb-2">
							Welcome {data.user.email}
						</h1>
						<p className="text-gray-600">
							Manage your account and instruments
						</p>
					</div>

					<Tabs
						instrumentsContent={
							<InstrumentList initialInstruments={instruments} />
						}
					/>
				</div>
			</div>
		</div>
	);
}
