import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"

export function HistorySkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="pt-6">
                        <Skeleton className="h-3 w-24 mb-2" />
                        <Skeleton className="h-9 w-16" />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <Skeleton className="h-3 w-32 mb-2" />
                        <Skeleton className="h-9 w-32" />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-64 mt-1" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-8 w-8 rounded-lg" />
                                    <Skeleton className="h-4 w-12" />
                                </div>
                                <div className="flex gap-4">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                </div>
                                <div className="text-right">
                                    <Skeleton className="h-5 w-20 ml-auto" />
                                    <Skeleton className="h-3 w-12 mt-1 ml-auto" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
