"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function AuthInterceptModal() {
  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger className="inline-flex h-9 items-center justify-center rounded-md bg-[var(--color-brand)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand)]/90">
        Contribute
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-separator)]">
        <DialogHeader>
          <DialogTitle className="text-xl">Authentication Required</DialogTitle>
          <DialogDescription className="text-[var(--color-text-muted)] opacity-70">
            You need to log in to submit a paper to the repository.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={() => router.push("/login")}
            className="w-full bg-[var(--color-brand)] hover:bg-[var(--color-brand)]/90 text-white"
          >
            Log In
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/sign-up")}
            className="w-full border-[var(--color-brand)] text-[var(--color-text)] hover:bg-[var(--color-text)]/5 bg-transparent"
          >
            Sign Up
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
