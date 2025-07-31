import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

// Este es un formulario de ejemplo. Debería ser adaptado
// para que coincida con la estructura de datos real de la API.
export const RegistrationForm = ({ initialData, onSubmit, isLoading }) => {
    return (
        <Card className="mt-4">
            <CardBody>
                <h3 className="text-lg font-bold mb-4">Registration Details</h3>
                <form onSubmit={onSubmit} className="space-y-4">
                    <Input
                        label="Claimant Name"
                        defaultValue={initialData?.ClaimCase?.ClaimPartyList?.[0]?.PartyName || ''}
                        name="partyName"
                    />
                    <Input
                        label="ID Number"
                        defaultValue={initialData?.ClaimCase?.ClaimPartyList?.[0]?.IdNo || ''}
                        name="idNo"
                    />
                    <Button type="submit" color="primary" isLoading={isLoading}>
                        Submit Registration
                    </Button>
                </form>
            </CardBody>
        </Card>
    );
};
