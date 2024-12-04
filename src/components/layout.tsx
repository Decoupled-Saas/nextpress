import { ReactNode } from "react";
import { db } from "@/lib/db";
import { menuItems } from "@/lib/db/schema";
import Header from "./header";
import { desc } from "drizzle-orm";

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const items = await db
    .select()
    .from(menuItems)
    .orderBy(desc(menuItems.order));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header menuItems={items} />
      <main className="container mx-auto px-4 py-8">{children}</main>
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} NextPress. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
