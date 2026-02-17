import { getUserProfile } from "@/lib/services/user";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Mail, Shield } from "lucide-react";
import ProfileForm from "@/components/member/ProfileForm";
import PasswordForm from "@/components/member/PasswordForm";

interface ProfileContentProps {
    userId: string;
}

export async function ProfileContent({ userId }: ProfileContentProps) {
    const user = await getUserProfile(userId);
    if (!user) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <Card className="text-center p-8">
                    <div className="w-24 h-24 bg-primary/10 text-primary rounded-full mx-auto flex items-center justify-center text-3xl font-bold border-4 border-background shadow-lg">
                        {user.name[0].toUpperCase()}
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-foreground">{user.name}</h3>
                    <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold mt-1">{user.role}</p>
                    <div className="mt-6 pt-6 border-t border-border text-left space-y-3">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Mail className="w-4 h-4" /> {user.email}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Shield className="w-4 h-4" /> {user.organization?.name || "N/A"}
                        </div>
                    </div>
                </Card>
            </div>

            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your name and contact details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProfileForm user={user} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Security</CardTitle>
                        <CardDescription>Change your password and secure your account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PasswordForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
