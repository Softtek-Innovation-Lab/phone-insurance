import DefaultLayout from "@/layouts/default";
import { useNotification } from "@/providers/NotificationProvider";
import { claimsApi, NewClaimData } from "@/services/claimsApi";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { useState } from "react";

export default function NewClaimPage() {
    const [formData, setFormData] = useState({
        description: "",
        date: "",
        damageObject: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useNotification();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const now = new Date().toISOString();

        const payload: NewClaimData = {
            ReportChannel: "2",
            OperationType: "1",
            ClaimCase: {
                AccidentTime: new Date(formData.date).toISOString(),
                ClaimObjectList: [
                    {
                        DamageType: "02",
                        Property: {},
                        RiskName: "01",
                        SequenceNo: 1,
                        StatusCode: "01",
                        SubClaimType: "02",
                        DamageObject: formData.damageObject,
                    },
                ],
                EcsHasOtherPolicies: "0",
                EcsIsFromApp: "N",
                EcsProductLineCode: "06",
                EcsProductVersion: "20241001_V01",
                FnolRemark: formData.description,
                FnolStatus: "01",
                LossCause: "23",
                NoticeTime: now,
                ProductCode: "X_EX_US_FURNWTY1",
                RecordType: "1",
                VersionSeq: 1,
                WithPolicy: "0",
                SettlementTimes: 0,
            },
        };

        try {
            const response = await claimsApi.openClaim(payload);
            addNotification(`Claim opened successfully! Claim number: ${response.Model.ClaimCase.ClaimNo}`, "success");
            // Limpiar formulario
            setFormData({ description: "", date: "", damageObject: "" });
        } catch (error) {
            addNotification("Failed to open claim. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DefaultLayout>
            <section className="py-12">
                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardBody className="p-8">
                            <h1 className="text-2xl font-bold mb-6">File a New Claim</h1>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* <Textarea
                  label="Description of Incident"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                /> */}
                                <Input
                                    label="Date of Incident"
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Damaged Object"
                                    name="damageObject"
                                    placeholder="e.g., Table, Chair"
                                    value={formData.damageObject}
                                    onChange={handleChange}
                                    required
                                />
                                <Button color="primary" type="submit" className="w-full" isLoading={isLoading}>
                                    Submit Claim
                                </Button>
                            </form>
                        </CardBody>
                    </Card>
                </div>
            </section>
        </DefaultLayout>
    );
}
