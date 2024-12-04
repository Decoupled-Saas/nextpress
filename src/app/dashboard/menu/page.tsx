import { Suspense } from 'react'
import MenuContent from './menu-content'

export default function MenuPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Menu</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <MenuContent />
            </Suspense>
        </div>
    )
}

