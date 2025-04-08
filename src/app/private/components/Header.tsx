"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, User, Settings, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

interface HeaderProps {
	userEmail: string;
}

export function Header({ userEmail }: HeaderProps) {
	const router = useRouter();
	const supabase = createClient();

	const handleLogout = async () => {
		try {
			await supabase.auth.signOut();
			router.push("/login");
		} catch (error) {
			console.error("Error logging out:", error);
		}
	};

	// Get initials from email for avatar
	const getInitials = (email: string) => {
		return email
			.split("@")[0]
			.split(".")
			.map((n) => n[0])
			.join("")
			.toUpperCase();
	};

	return (
		<header className="bg-white shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex items-center">
						<h1 className="text-xl font-semibold text-gray-900">
							Instrument Manager
						</h1>
					</div>

					<div className="flex items-center gap-4">
						<Link href="/payment">
							<Button
								variant="outline"
								className="flex items-center gap-2"
							>
								<CreditCard className="h-4 w-4" />
								Payment
							</Button>
						</Link>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative h-8 w-8 rounded-full"
								>
									<Avatar className="h-8 w-8">
										<AvatarFallback>
											{getInitials(userEmail)}
										</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-56"
								align="end"
								forceMount
							>
								<DropdownMenuItem className="text-sm text-gray-600">
									{userEmail}
								</DropdownMenuItem>
								<DropdownMenuItem>
									<User className="mr-2 h-4 w-4" />
									<span>Profile</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Settings className="mr-2 h-4 w-4" />
									<span>Settings</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={handleLogout}
									className="text-red-600 focus:text-red-600"
								>
									<LogOut className="mr-2 h-4 w-4" />
									<span>Logout</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</header>
	);
}
