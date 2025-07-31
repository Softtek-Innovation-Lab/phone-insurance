import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";

export const CoverageDetails = ({ coverages }) => {
    if (!coverages || coverages.length === 0) return null;

    return (
        <div>
            <h3 className="text-lg font-bold mb-4 text-gray-700">Coverage Info</h3>
            <Table aria-label="Coverage Details">
                <TableHeader>
                    <TableColumn>COVERAGE NAME</TableColumn>
                    <TableColumn>SUM INSURED</TableColumn>
                    <TableColumn>DEDUCTIBLE</TableColumn>
                </TableHeader>
                <TableBody>
                    {coverages.map((insuredItem, index) => (
                        insuredItem.ClaimPolicyCoverageList.map((coverage, subIndex) => (
                            <TableRow key={`${index}-${subIndex}`}>
                                <TableCell>{coverage.CoverageName}</TableCell>
                                <TableCell>${coverage.SumInsured.toLocaleString()}</TableCell>
                                <TableCell>${coverage.DeductibleAmount.toLocaleString()}</TableCell>
                            </TableRow>
                        ))
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
