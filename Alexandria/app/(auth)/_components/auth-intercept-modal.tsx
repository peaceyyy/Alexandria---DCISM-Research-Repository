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
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";

export function AuthInterceptModal({
  iconOnly = false,
  triggerClassName,
}: {
  iconOnly?: boolean;
  triggerClassName?: string;
}) {
  const router = useRouter();

  return (
    <Dialog>
      {iconOnly ? (
        <DialogTrigger
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--color-separator-mid)] bg-[var(--color-text)]/5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-text)]/10 hover:text-[var(--color-text)]"
          aria-label="Sign in to contribute"
          title="Contribute"
        >
          <Upload size={14} aria-hidden />
        </DialogTrigger>
      ) : (
        <DialogTrigger
          className={
            triggerClassName ??
            "inline-flex h-8 items-center justify-center rounded-md bg-[var(--color-brand)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand)]/90"
          }
        >
          Contribute
        </DialogTrigger>
      )}
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
