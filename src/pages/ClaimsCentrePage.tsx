import { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { Tabs, Tab } from "@heroui/tabs";
import { Shield, PlusCircle } from "lucide-react";
import NewAccidentTab from "@/components/claims/NewAccidentTab";
import ClaimsTab from "@/components/profile/ClaimsTab";
import { useTranslation } from 'react-i18next';

export default function ClaimsCentrePage() {
    const { t } = useTranslation();
    const [selectedTab, setSelectedTab] = useState("new-accident");

    return (
        <DefaultLayout>
            <section className="py-12">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">{t('claimsCentre')}</h1>
                    <Tabs
                        aria-label={t('claimsCentreTabsAria')}
                        selectedKey={selectedTab}
                        onSelectionChange={(key) => setSelectedTab(key as string)}
                    >
                        <Tab key="new-accident" title={
                            <div className="flex items-center space-x-2">
                                <PlusCircle />
                                <span>{t('newAccidentTab')}</span>
                            </div>
                        }>
                            <NewAccidentTab />
                        </Tab>
                        <Tab key="my-claims" title={
                            <div className="flex items-center space-x-2">
                                <Shield />
                                <span>{t('myClaimsTab')}</span>
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
