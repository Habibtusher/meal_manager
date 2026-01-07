import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"

export function MembersSkeleton() {
    return (
        <Card>
            <CardHeader className="pb-0">
                <Skeleton className="h-10 w-full" />
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 italic text-gray-400 text-sm">
                                <th className="pb-4 font-medium px-4">Name & Email</th>
                                <th className="pb-4 font-medium px-4">Role</th>
                                <th className="pb-4 font-medium px-4 text-center">Status</th>
                                <th className="pb-4 font-medium text-right px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="py-4 px-4 space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-48" />
                                    </td>
                                    <td className="py-4 px-4">
                                        <Skeleton className="h-5 w-16 rounded" />
                                    </td>
                                    <td className="py-4 px-4">
                                        <Skeleton className="h-6 w-20 rounded-full mx-auto" />
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Skeleton className="h-8 w-8 rounded" />
                                            <Skeleton className="h-8 w-8 rounded" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center pt-4">
                    <Skeleton className="h-10 w-64" />
                </div>
            </CardContent>
        </Card>
    )
}
