import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"

export function ReportsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="bg-white border-blue-50">
                        <CardHeader className="pb-2 space-y-2">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-8 w-32" />
                        </CardHeader>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64 mt-1" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
