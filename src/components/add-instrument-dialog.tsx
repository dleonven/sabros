"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function AddInstrumentDialog() {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		try {
			const response = await fetch("/api/instruments", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to add instrument");
			}

			setOpen(false);
			setName("");
			// Trigger a page refresh to show the new instrument
			window.location.reload();
		} catch (error) {
			console.error("Error adding instrument:", error);
			setError(
				error instanceof Error
					? error.message
					: "Failed to add instrument"
			);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Add Instrument</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add New Instrument</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Input
							placeholder="Instrument name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							disabled={isLoading}
						/>
						{error && (
							<p className="text-sm text-red-500 mt-2">{error}</p>
						)}
					</div>
					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Adding..." : "Add"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
