import {Suspense} from "react";
import PlansContent from "@/app/dashboard/plans/plans-content";

export default function PlansPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Subscription Plans</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <PlansContent />
            </Suspense>
        </div>
    )
}