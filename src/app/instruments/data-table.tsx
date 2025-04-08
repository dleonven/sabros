"use client";

import { useState, useEffect } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pencil, Trash, Plus, Save, X } from "lucide-react";

type Instrument = {
	id: number;
	name: string;
};

export function InstrumentsDataTable() {
	const [instruments, setInstruments] = useState<Instrument[]>([]);
	const [loading, setLoading] = useState(true);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editName, setEditName] = useState("");
	const [newInstrumentName, setNewInstrumentName] = useState("");
	const [isAdding, setIsAdding] = useState(false);

	useEffect(() => {
		fetchInstruments();
	}, []);

	async function fetchInstruments() {
		try {
			const response = await fetch("/api/instruments");
			const data = await response.json();
			setInstruments(data);
		} catch {
			toast.error("Failed to fetch instruments");
		} finally {
			setLoading(false);
		}
	}

	async function addInstrument(name: string) {
		const optimisticId = Date.now();
		// Optimistic update
		setInstruments((prev) => [...prev, { id: optimisticId, name }]);

		try {
			const response = await fetch("/api/instruments", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name }),
			});

			if (!response.ok) throw new Error();

			const newInstrument = await response.json();
			setInstruments((prev) =>
				prev.map((i) => (i.id === optimisticId ? newInstrument : i))
			);

			toast.success("Instrument added successfully");
		} catch {
			// Rollback optimistic update
			setInstruments((prev) => prev.filter((i) => i.id !== optimisticId));
			toast.error("Failed to add instrument");
		}
	}

	async function updateInstrument(id: number, name: string) {
		// Store current state for rollback
		const previousInstruments = [...instruments];

		// Optimistic update
		setInstruments((prev) =>
			prev.map((i) => (i.id === id ? { ...i, name } : i))
		);

		try {
			const response = await fetch("/api/instruments", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id, name }),
			});

			if (!response.ok) throw new Error();

			toast.success("Instrument updated successfully");
		} catch {
			// Rollback optimistic update
			setInstruments(previousInstruments);
			toast.error("Failed to update instrument");
		}
	}

	async function deleteInstrument(id: number) {
		// Store current state for rollback
		const previousInstruments = [...instruments];

		// Optimistic update
		setInstruments((prev) => prev.filter((i) => i.id !== id));

		try {
			const response = await fetch("/api/instruments", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});

			if (!response.ok) throw new Error();

			toast.success("Instrument deleted successfully");
		} catch {
			// Rollback optimistic update
			setInstruments(previousInstruments);
			toast.error("Failed to delete instrument");
		}
	}

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<div className="mb-4 flex items-center gap-2">
				{isAdding ? (
					<>
						<Input
							value={newInstrumentName}
							onChange={(e) =>
								setNewInstrumentName(e.target.value)
							}
							placeholder="Enter instrument name"
							className="max-w-xs"
						/>
						<Button
							onClick={() => {
								addInstrument(newInstrumentName);
								setNewInstrumentName("");
								setIsAdding(false);
							}}
							disabled={!newInstrumentName}
						>
							<Save className="h-4 w-4 mr-2" />
							Save
						</Button>
						<Button
							variant="ghost"
							onClick={() => {
								setNewInstrumentName("");
								setIsAdding(false);
							}}
						>
							<X className="h-4 w-4 mr-2" />
							Cancel
						</Button>
					</>
				) : (
					<Button onClick={() => setIsAdding(true)}>
						<Plus className="h-4 w-4 mr-2" />
						Add Instrument
					</Button>
				)}
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Name</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{instruments.map((instrument) => (
						<TableRow key={instrument.id}>
							<TableCell>{instrument.id}</TableCell>
							<TableCell>
								{editingId === instrument.id ? (
									<Input
										value={editName}
										onChange={(e) =>
											setEditName(e.target.value)
										}
										className="max-w-xs"
									/>
								) : (
									instrument.name
								)}
							</TableCell>
							<TableCell className="text-right">
								{editingId === instrument.id ? (
									<>
										<Button
											variant="outline"
											size="sm"
											className="mr-2"
											onClick={() => {
												updateInstrument(
													instrument.id,
													editName
												);
												setEditingId(null);
											}}
											disabled={!editName}
										>
											<Save className="h-4 w-4 mr-2" />
											Save
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setEditingId(null)}
										>
											<X className="h-4 w-4 mr-2" />
											Cancel
										</Button>
									</>
								) : (
									<>
										<Button
											variant="outline"
											size="sm"
											className="mr-2"
											onClick={() => {
												setEditingId(instrument.id);
												setEditName(instrument.name);
											}}
										>
											<Pencil className="h-4 w-4 mr-2" />
											Edit
										</Button>
										<Button
											variant="destructive"
											size="sm"
											onClick={() =>
												deleteInstrument(instrument.id)
											}
										>
											<Trash className="h-4 w-4 mr-2" />
											Delete
										</Button>
									</>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
