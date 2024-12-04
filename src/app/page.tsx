import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gradient-to-b from-primary/20 to-background text-center">
      <h1 className="text-5xl font-bold mb-6">Welcome to NextPress</h1>
      <p className="text-xl mb-8 max-w-2xl">
        A powerful and flexible content management system built with Next.js and
        shadcn/ui. Perfect for blogs, portfolios, and small business websites.
      </p>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/blog">Read Our Blog</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/about">Learn More</Link>
        </Button>
      </div>
    </div>
  );
}
