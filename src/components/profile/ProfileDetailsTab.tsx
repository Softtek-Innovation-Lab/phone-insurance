import { useAuth } from "@/auth/AuthProvider";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";

export default function ProfileDetailsTab() {
    const { user } = useAuth();

    return (
        <Card>
            <CardBody>
                <h3 className="text-xl font-bold mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Full Name" value={user?.name} isReadOnly />
                    <Input label="Email Address" value={user?.email} isReadOnly />
                </div>
            </CardBody>
        </Card>
    );
}
