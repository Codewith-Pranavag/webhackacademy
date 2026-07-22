import type { Metadata } from "next";
import { AccountLocked } from "@/components/app/SessionScreens";

export const metadata: Metadata = {
  title: "Account Locked",
};

export default function AccountLockedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-soft px-5">
      <AccountLocked />
    </div>
  );
}
