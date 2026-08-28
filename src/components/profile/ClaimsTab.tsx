import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "@/store";
import { fetchAllClaims } from "@/store/slices/claimsSlice";
import { useTranslation } from "react-i18next";

export default function ClaimsTab() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { claims, loading, error } = useSelector((state: RootState) => state.claims);
    const t = useTranslation().t;

    useEffect(() => {
        dispatch(fetchAllClaims());
    }, [dispatch]);

    return (
        <Card>
            <CardBody>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{t('claimList.claimListTitle')}</h3>
                </div>
                {loading && <p>{t('claimList.claimLoading')}</p>}
                {error && <p className="text-danger">{t('claimList.claimError')}: {error}</p>}
                {!loading && !error && claims.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">{t('claimList.noClaims')}</p>
                    </div>
                )}
                {claims.length > 0 && (
                    <Table aria-label="Claims History">
                        <TableHeader>
                            <TableColumn>{t('claimList.claimID')}</TableColumn>
                            <TableColumn>{t('claimList.claimDate')}</TableColumn>
                            <TableColumn>{t('claimList.claimProduct')}</TableColumn>
                            <TableColumn>{t('claimList.claimStatus')}</TableColumn>
                            <TableColumn>{t('claimList.claimAmount')}</TableColumn>
                            <TableColumn>{t('claimList.claimActions')}</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {claims.map((claim: any, index: number) => (
                                <TableRow key={claim.ClaimNo || index}>
                                    <TableCell className="font-semibold">{claim.ClaimNo || 'N/A'}</TableCell>
                                    <TableCell>
                                        {claim.AccidentTime 
                                            ? new Date(claim.AccidentTime).toLocaleDateString() 
                                            : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {claim.ProductName || claim.ProductCode || claim.ClaimObjectList?.[0]?.DamageObject || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                                            {claim.CaseStatus || 'Active'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {claim.SettlementAmount ? `$${claim.SettlementAmount}` : '$0.00'}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            color="default"
                                            variant="flat"
                                            onPress={() => navigate(`/claim/${claim.ClaimNo || index}`)}
                                        >
                                            {t('claimList.claimViewButton')}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardBody>
        </Card>
    );
}
