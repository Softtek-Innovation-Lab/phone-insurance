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
                    <Input label="Date of Birth" value={user?.dateOfBirth} isReadOnly />
                    <Input label="Gender" value={user?.gender} isReadOnly />
                    <Input label="ID Type" value={user?.idType} isReadOnly />
                    <Input label="ID Number" value={user?.idNumber} isReadOnly />
                </div>
            </CardBody>
        </Card>
    );
}
