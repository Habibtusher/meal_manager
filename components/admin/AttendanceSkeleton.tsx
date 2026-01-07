import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"

export function AttendanceSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-48" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-3 w-1/3" />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Skeleton className="h-10 w-24 rounded-lg" />
                                <Skeleton className="h-10 w-24 rounded-lg" />
                                <Skeleton className="h-10 w-24 rounded-lg" />
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-end pt-6">
                        <Skeleton className="h-11 w-40 rounded-xl" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
