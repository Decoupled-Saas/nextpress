import { Suspense } from "react";
import PagesContent from "@/app/dashboard/pages/pages-content";

export default function PagesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Pages</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <PagesContent />
      </Suspense>
    </div>
  );
}
