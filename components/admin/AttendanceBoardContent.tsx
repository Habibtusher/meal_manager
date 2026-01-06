import { getAttendanceData } from "@/lib/services/meals";
import AttendanceBoard from "@/components/admin/AttendanceBoard";

interface AttendanceBoardContentProps {
    organizationId: string;
    date: Date;
}

export async function AttendanceBoardContent({ organizationId, date }: AttendanceBoardContentProps) {
    const { members, initialCounts } = await getAttendanceData(organizationId, date);

    return (
        <AttendanceBoard
            members={members}
            initialCounts={initialCounts}
            date={date}
        />
    );
}
