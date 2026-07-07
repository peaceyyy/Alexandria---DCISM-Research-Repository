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
      <DialogTrigger className="inline-flex h-9 items-center justify-center rounded-md bg-[#368bfe] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#2f78ff]">
        Contribute
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#14181c] text-white border-[#d9d9d9]/15">
        <DialogHeader>
          <DialogTitle className="text-xl">Authentication Required</DialogTitle>
          <DialogDescription className="text-[#969696]">
            You need to log in to submit a paper to the repository.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={() => router.push("/login")}
            className="w-full bg-[#368bfe] hover:bg-[#2f78ff] text-white"
          >
            Log In
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/sign-up")}
            className="w-full border-[#368bfe] text-white hover:bg-white/5 bg-transparent"
          >
            Sign Up
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
