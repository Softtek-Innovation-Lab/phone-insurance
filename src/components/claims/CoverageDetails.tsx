import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";

export const CoverageDetails = ({ coverages }) => {
    if (!coverages || coverages.length === 0) return null;

    return (
        <div>
            <h3 className="text-lg font-bold mb-4 text-gray-700">Coverage Info</h3>
            <Table aria-label="Coverage Details">
                <TableHeader>
                    <TableColumn>INSURED PRODUCT</TableColumn>
                    <TableColumn>COVERAGE NAME</TableColumn>
                    <TableColumn>SUM INSURED</TableColumn>
                    <TableColumn>DEDUCTIBLE AMOUNT</TableColumn>
                    <TableColumn>DEDUCTIBLE RATE</TableColumn>
                    <TableColumn>COVERAGE CODE</TableColumn>
                </TableHeader>
                <TableBody>
                    {coverages.map((insuredItem, index) => (
                        insuredItem.ClaimPolicyCoverageList.map((coverage, subIndex) => (
                            <TableRow key={`${index}-${subIndex}`}>
                                <TableCell>
                                    <div>
                                        <div className="font-semibold">{insuredItem.InsuredName}</div>
                                        <div className="text-sm text-gray-500">ID: {insuredItem.InsuredNo}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <div className="font-medium">{coverage.CoverageName}</div>
                                        <div className="text-sm text-gray-500">{coverage.PolicySysCode}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="font-semibold text-green-600">
                                        ${coverage.SumInsured?.toLocaleString() || '0'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-orange-600">
                                        ${coverage.DeductibleAmount?.toLocaleString() || '0'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-blue-600">
                                        {coverage.DeductibleRate ? `${(coverage.DeductibleRate * 100).toFixed(2)}%` : '0%'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                        {coverage.CoverageCode}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
