export default function ProductSkeleton() {
    return (
        <div className="py-4 md:py-8 bg-white min-h-screen">
            <div className="container mx-auto px-4 animate-pulse">

                {/* Breadcrumbs */}
                <div className="h-4 w-32 md:w-40 bg-gray-200 rounded mb-4 md:mb-6"></div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-8">
                    <div className="grid lg:grid-cols-2 gap-6 md:gap-10">

                        {/* Left image skeleton */}
                        <div>
                            <div className="aspect-square bg-gray-200 rounded-2xl"></div>

                            <div className="grid grid-cols-4 gap-3 mt-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="aspect-square bg-gray-200 rounded-xl"></div>
                                ))}
                            </div>
                        </div>

                        {/* Right side skeleton */}
                        <div className="space-y-4 md:space-y-6">
                            <div className="h-5 md:h-6 w-20 md:w-24 bg-gray-200 rounded"></div>
                            <div className="h-8 md:h-10 w-full md:w-3/4 bg-gray-200 rounded"></div>

                            <div className="h-4 md:h-5 w-28 md:w-32 bg-gray-200 rounded"></div>

                            <div className="h-10 md:h-12 w-32 md:w-40 bg-gray-300 rounded"></div>

                            {/* Quantity + Buttons */}
                            <div className="flex flex-wrap gap-3 md:gap-4">
                                <div className="h-12 w-28 md:w-32 bg-gray-200 rounded"></div>
                                <div className="h-12 flex-1 min-w-[120px] bg-gray-200 rounded"></div>
                                <div className="h-12 flex-1 min-w-[120px] bg-gray-200 rounded"></div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2 md:space-y-3">
                                <div className="h-4 md:h-5 w-32 md:w-40 bg-gray-200 rounded"></div>
                                <div className="h-3 md:h-4 w-full bg-gray-200 rounded"></div>
                                <div className="h-3 md:h-4 w-5/6 bg-gray-200 rounded"></div>
                                <div className="h-3 md:h-4 w-3/4 bg-gray-200 rounded"></div>
                            </div>

                            {/* Icons */}
                            <div className="flex gap-3 md:gap-4 mt-4 md:mt-6">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="w-8 h-8 md:w-12 md:h-12 bg-gray-200 rounded-full"></div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Review skeleton */}
                <div className="mt-8 md:mt-12 p-4 md:p-8 bg-gray-50 rounded-2xl border border-gray-200">
                    <div className="h-6 md:h-8 w-36 md:w-48 bg-gray-200 rounded mb-4 md:mb-6"></div>

                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="flex gap-3 md:gap-4 mb-4 md:mb-6">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full shrink-0"></div>
                            <div className="flex-1 space-y-2 md:space-y-3">
                                <div className="h-3 md:h-4 w-1/2 md:w-1/3 bg-gray-200 rounded"></div>
                                <div className="h-3 md:h-4 w-full bg-gray-200 rounded"></div>
                                <div className="h-3 md:h-4 w-4/5 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
