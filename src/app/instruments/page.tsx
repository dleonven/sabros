import { Suspense } from "react";
import { InstrumentsDataTable } from "./data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function InstrumentsPage() {
	return (
		<div className="container mx-auto py-10">
			<Card>
				<CardHeader>
					<CardTitle>Instruments Management</CardTitle>
				</CardHeader>
				<CardContent>
					<Suspense
						fallback={<Skeleton className="h-[400px] w-full" />}
					>
						<InstrumentsDataTable />
					</Suspense>
				</CardContent>
			</Card>
		</div>
	);
}
