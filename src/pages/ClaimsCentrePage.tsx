import { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { Card, CardBody } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { Shield, PlusCircle } from "lucide-react";
import NewAccidentTab from "@/components/claims/NewAccidentTab";

export default function ClaimsCentrePage() {
    const [selectedTab, setSelectedTab] = useState("new-accident");

    return (
        <DefaultLayout>
            <section className="py-12">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Claims Centre</h1>
                    <Tabs
                        aria-label="Claims Centre Tabs"
                        selectedKey={selectedTab}
                        onSelectionChange={(key) => setSelectedTab(key as string)}
                    >
                        <Tab key="new-accident" title={
                            <div className="flex items-center space-x-2">
                                <PlusCircle />
                                <span>New Accident</span>
                            </div>
                        }>
                            <NewAccidentTab />
                        </Tab>
                        <Tab key="my-claims" title={
                            <div className="flex items-center space-x-2">
                                <Shield />
                                <span>My Claims</span>
                            </div>
                        }>
                            {/* Aquí se podría reutilizar el componente ClaimsTab o uno similar */}
                            <Card><CardBody><p>My Claims section (to be implemented).</p></CardBody></Card>
                        </Tab>
                    </Tabs>
                </div>
            </section>
        </DefaultLayout>
    );
}
