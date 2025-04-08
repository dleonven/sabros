"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface Instrument {
	id: bigint;
	name: string;
}

interface InstrumentListProps {
	initialInstruments: Instrument[];
}

export default function InstrumentList({
	initialInstruments,
}: InstrumentListProps) {
	const [instruments, setInstruments] =
		useState<Instrument[]>(initialInstruments);
	const [newInstrumentName, setNewInstrumentName] = useState("");
	const [editingId, setEditingId] = useState<bigint | null>(null);
	const [editingName, setEditingName] = useState("");
	const [isAdding, setIsAdding] = useState(false);

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newInstrumentName.trim()) return;

		try {
			const response = await fetch("/api/instruments", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name: newInstrumentName }),
			});

			if (!response.ok) throw new Error("Failed to create instrument");

			const newInstrument = await response.json();
			setInstruments([...instruments, newInstrument]);
			setNewInstrumentName("");
			setIsAdding(false);
		} catch (error) {
			console.error("Error creating instrument:", error);
		}
	};

	const handleUpdate = async (id: bigint) => {
		if (!editingName.trim()) return;

		try {
			const response = await fetch(`/api/instruments/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name: editingName }),
			});

			if (!response.ok) throw new Error("Failed to update instrument");

			const updatedInstrument = await response.json();
			setInstruments(
				instruments.map((inst) =>
					inst.id === id ? updatedInstrument : inst
				)
			);
			setEditingId(null);
		} catch (error) {
			console.error("Error updating instrument:", error);
		}
	};

	const handleDelete = async (id: bigint) => {
		if (!confirm("Are you sure you want to delete this instrument?"))
			return;

		try {
			const response = await fetch(`/api/instruments/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) throw new Error("Failed to delete instrument");

			setInstruments(instruments.filter((inst) => inst.id !== id));
		} catch (error) {
			console.error("Error deleting instrument:", error);
		}
	};

	const startEditing = (instrument: Instrument) => {
		setEditingId(instrument.id);
		setEditingName(instrument.name);
	};

	return (
		<div className="space-y-6 p-6">
			{/* Create Form */}
			<div className="mb-6">
				{isAdding ? (
					<form onSubmit={handleCreate} className="space-y-4">
						<div className="flex gap-4">
							<input
								type="text"
								value={newInstrumentName}
								onChange={(e) =>
									setNewInstrumentName(e.target.value)
								}
								placeholder="Enter instrument name"
								className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>
							<button
								type="submit"
								className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								Add
							</button>
							<button
								type="button"
								onClick={() => {
									setIsAdding(false);
									setNewInstrumentName("");
								}}
								className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
							>
								Cancel
							</button>
						</div>
					</form>
				) : (
					<button
						onClick={() => setIsAdding(true)}
						className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						<Plus className="h-4 w-4" />
						Add New Instrument
					</button>
				)}
			</div>

			{/* Instruments List */}
			<div className="bg-white rounded-xl shadow-lg overflow-hidden">
				<ul className="divide-y divide-gray-200">
					{instruments.map((instrument) => (
						<li
							key={instrument.id.toString()}
							className="p-4 hover:bg-gray-50"
						>
							{editingId === instrument.id ? (
								<div className="flex items-center gap-4">
									<input
										type="text"
										value={editingName}
										onChange={(e) =>
											setEditingName(e.target.value)
										}
										className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									/>
									<button
										onClick={() =>
											handleUpdate(instrument.id)
										}
										className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
									>
										Save
									</button>
									<button
										onClick={() => setEditingId(null)}
										className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700"
									>
										Cancel
									</button>
								</div>
							) : (
								<div className="flex items-center justify-between">
									<span className="text-lg">
										{instrument.name}
									</span>
									<div className="flex gap-2">
										<button
											onClick={() =>
												startEditing(instrument)
											}
											className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md"
										>
											Edit
										</button>
										<button
											onClick={() =>
												handleDelete(instrument.id)
											}
											className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md"
										>
											Delete
										</button>
									</div>
								</div>
							)}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
