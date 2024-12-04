import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EmailVerified() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-md w-full space-y-8 text-center">
        <h2 className="mt-6 text-3xl font-bold">Email Verified</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your email has been successfully verified. You can now sign in to your
          account.
        </p>
        <Button asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
