// Reusable skeleton components

// Single pulsing block
export function SkeletonBlock({ className = "" }) {
    return (
        <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
    );
}

// Event card skeleton
export function EventCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 flex flex-col gap-2">
                    <SkeletonBlock className="h-5 w-16 rounded-full" />
                    <SkeletonBlock className="h-4 w-3/4" />
                    <SkeletonBlock className="h-3 w-full" />
                    <SkeletonBlock className="h-3 w-2/3" />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <SkeletonBlock className="h-3 w-40" />
                <SkeletonBlock className="h-3 w-32" />
            </div>
            <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                    <SkeletonBlock className="h-3 w-24" />
                    <SkeletonBlock className="h-3 w-12" />
                </div>
                <SkeletonBlock className="h-1.5 w-full rounded-full" />
            </div>
            <div className="flex gap-2">
                <SkeletonBlock className="h-9 flex-1 rounded-xl" />
                <SkeletonBlock className="h-9 flex-1 rounded-xl" />
            </div>
        </div>
    );
}

// Category row skeleton
export function CategoryRowSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
                <SkeletonBlock className="w-10 h-10 rounded-xl shrink-0" />
                <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <SkeletonBlock className="h-4 w-16" />
                        <SkeletonBlock className="h-4 w-12 rounded-full" />
                    </div>
                    <SkeletonBlock className="h-3 w-48" />
                </div>
            </div>
            <div className="flex gap-2">
                <SkeletonBlock className="h-8 w-12 rounded-xl" />
                <SkeletonBlock className="h-8 w-16 rounded-xl" />
            </div>
        </div>
    );
}

// Booking row skeleton
export function BookingRowSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <SkeletonBlock className="w-9 h-9 rounded-full shrink-0" />
                <div className="flex flex-col gap-1.5 flex-1">
                    <SkeletonBlock className="h-3.5 w-28" />
                    <SkeletonBlock className="h-3 w-36" />
                </div>
            </div>
            <SkeletonBlock className="h-3.5 w-24 hidden sm:block" />
            <div className="flex items-center gap-2 shrink-0">
                <SkeletonBlock className="h-6 w-16 rounded-full" />
                <SkeletonBlock className="h-8 w-10 rounded-xl" />
                <SkeletonBlock className="h-8 w-14 rounded-xl" />
            </div>
        </div>
    );
}