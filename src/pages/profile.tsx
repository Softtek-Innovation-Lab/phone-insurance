import { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { useAuth } from "@/auth/AuthProvider";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Tabs, Tab } from "@heroui/tabs";
import ProfileDetailsTab from "@/components/profile/ProfileDetailsTab";
import ClaimsTab from "@/components/profile/ClaimsTab";
import { User, FileText } from "lucide-react";

export default function ProfilePage() {
    const { user } = useAuth();
    const [selectedTab, setSelectedTab] = useState("details");

    if (!user) {
        return null; // O un spinner de carga
    }

    return (
        <DefaultLayout>
            <section className="py-12">
                <div className="max-w-4xl mx-auto">
                    <Card className="mb-8">
                        <CardBody className="flex items-center gap-6 p-6">
                            <Avatar src='https://i.pravatar.cc/150?u=,am' className="w-24 h-24 text-large" />
                            <div>
                                <h1 className="text-3xl font-bold">{user.name}</h1>
                                <p className="text-gray-500">{user.email}</p>
                            </div>
                        </CardBody>
                    </Card>

                    <Tabs
                        aria-label="User Profile Tabs"
                        selectedKey={selectedTab}
                        onSelectionChange={(key) => setSelectedTab(key as string)}
                    >
                        <Tab key="details" title={
                            <div className="flex items-center space-x-2">
                                <User />
                                <span>Profile Details</span>
                            </div>
                        }>
                            <ProfileDetailsTab />
                        </Tab>
                        <Tab key="claims" title={
                            <div className="flex items-center space-x-2">
                                <FileText />
                                <span>My Claims</span>
                            </div>
                        }>
                            <ClaimsTab />
                        </Tab>
                    </Tabs>
                </div>
            </section>
        </DefaultLayout>
    );
}
