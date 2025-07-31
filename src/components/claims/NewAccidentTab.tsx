import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { AppDispatch, RootState } from "@/store";
import { reportAccident } from "@/store/slices/claimsSlice";

export default function NewAccidentTab() {
    const [policyNo, setPolicyNo] = useState("");
    const [dateOfLoss, setDateOfLoss] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, currentClaimData } = useSelector((state: RootState) => state.claims);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(reportAccident({ policyNo, dateOfLoss }));
    };

    return (
        <Card>
            <CardBody className="p-6">
                <h2 className="text-xl font-bold mb-4">Report a New Accident</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Policy Number"
                        value={policyNo}
                        onValueChange={setPolicyNo}
                        placeholder="Enter your policy number"
                        required
                    />
                    <Input
                        label="Date of Loss"
                        type="date"
                        value={dateOfLoss}
                        onValueChange={setDateOfLoss}
                        required
                    />
                    <Button type="submit" color="primary" isLoading={loading}>
                        Report Accident
                    </Button>
                </form>
                {error && <p className="text-danger mt-4">{error}</p>}
                {currentClaimData && (
                    <div className="mt-6 p-4 bg-gray-100 rounded">
                        <h3 className="font-bold">Coverages:</h3>
                        {/* Aquí se mostrarían las coberturas devueltas por la API */}
                        <pre>{JSON.stringify(currentClaimData, null, 2)}</pre>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
