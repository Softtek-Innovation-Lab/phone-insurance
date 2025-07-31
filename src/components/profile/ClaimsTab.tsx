import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchAllClaims } from "@/store/slices/claimsSlice";

export default function ClaimsTab() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { claims, loading, error } = useSelector((state: RootState) => state.claims);

    useEffect(() => {
        dispatch(fetchAllClaims());
    }, [dispatch]);

    return (
        <Card>
            <CardBody>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">My Claims History</h3>
                    <Button color="primary" onPress={() => navigate('/new-claim')}>
                        File a New Claim
                    </Button>
                </div>
                {loading && <p>Loading claims...</p>}
                {error && <p className="text-danger">Error: {error}</p>}
                {!loading && !error && claims.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No tiene siniestros por el momento.</p>
                    </div>
                )}
                {claims.length > 0 && (
                    <Table aria-label="Claims History">
                        <TableHeader>
                            <TableColumn>Claim ID</TableColumn>
                            <TableColumn>Date</TableColumn>
                            <TableColumn>Product</TableColumn>
                            <TableColumn>Status</TableColumn>
                            <TableColumn>Amount</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {claims.map((claim: any) => (
                                <TableRow key={claim.ClaimNo} onClick={() => navigate(`/claim/${claim.ClaimNo}`)} className="cursor-pointer hover:bg-gray-100">
                                    <TableCell>{claim.ClaimNo}</TableCell>
                                    <TableCell>{new Date(claim.AccidentTime).toLocaleDateString()}</TableCell>
                                    <TableCell>{claim.ClaimObjectList[0]?.DamageObject}</TableCell>
                                    <TableCell>{claim.CaseStatus}</TableCell>
                                    <TableCell>{"$0.00"/* Lógica para obtener el monto */}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardBody>
        </Card>
    );
}
