import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DefaultLayout from "@/layouts/default";
import { AppDispatch, RootState } from "@/store";
import { fetchClaimDetails, fetchTasks, assignTask, loadStepData, submitStepData } from "@/store/slices/claimsSlice";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { RegistrationForm } from "@/components/claims/RegistrationForm"; // Importar el nuevo formulario

export default function ClaimDetailsPage() {
    const { claimNo } = useParams<{ claimNo: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { claims, tasks, loading, error, currentClaimData } = useSelector((state: RootState) => state.claims);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [currentStep, setCurrentStep] = useState<string | null>(null);

    useEffect(() => {
        if (claimNo) {
            dispatch(fetchClaimDetails(claimNo));
            dispatch(fetchTasks(claimNo));
        }
    }, [dispatch, claimNo]);

    const handleAssignTask = (taskId: string) => {
        if (claimNo) {
            dispatch(assignTask({ claimNo, taskId }));
            const task = tasks.find(t => t.TaskId === taskId);
            setSelectedTask(task);
        }
    };

    const handleLoadStep = (step: 'registration' | 'calculation' | 'settlement') => {
        if (claimNo && selectedTask) {
            dispatch(loadStepData({ step, claimNo, taskId: selectedTask.TaskId }));
            setCurrentStep(step);
        }
    };

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStep && currentClaimData) {
            // Aquí se debería construir el payload final con los datos del formulario
            const finalPayload = {
                ...currentClaimData,
                OperationType: "2", // 2 para submit
                // ... fusionar con los datos del formulario
            };
            dispatch(submitStepData({ step: currentStep as 'registration' | 'calculation' | 'settlement', payload: finalPayload }));
        }
    };

    const claim = claims.length > 0 ? claims[0] : null;

    return (
        <DefaultLayout>
            <section className="py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6">Claim Details</h1>
                    {loading && <p>Loading claim details...</p>}
                    {error && <p className="text-danger">Error: {error}</p>}
                    {claim && (
                        <Card className="mb-8">
                            <CardBody className="p-6 space-y-4">
                                <div>
                                    <h2 className="text-xl font-bold">Claim: {claim.ClaimNo}</h2>
                                    <p className="text-gray-500">Status: {claim.CaseStatus}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Incident Date</h3>
                                    <p>{new Date(claim.AccidentTime).toLocaleString()}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Damaged Object</h3>
                                    <p>{claim.ClaimObjectList[0]?.DamageObject}</p>
                                </div>
                                {/* Aquí se pueden añadir más detalles y las tareas asociadas */}
                            </CardBody>
                        </Card>
                    )}

                    <h2 className="text-2xl font-bold mb-4">Tasks</h2>
                    <Card>
                        <CardBody>
                            <Table aria-label="Claim Tasks">
                                <TableHeader>
                                    <TableColumn>Task ID</TableColumn>
                                    <TableColumn>Type</TableColumn>
                                    <TableColumn>Status</TableColumn>
                                    <TableColumn>Actions</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {tasks.map((task: any) => (
                                        <TableRow key={task.TaskId}>
                                            <TableCell>{task.TaskId}</TableCell>
                                            <TableCell>{task.TaskType}</TableCell>
                                            <TableCell>{task.TaskStatus}</TableCell>
                                            <TableCell>
                                                <Button size="sm" onPress={() => handleAssignTask(task.TaskId)} disabled={task.TaskStatus !== 'Pending'}>
                                                    Assign to Me
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardBody>
                    </Card>

                    {selectedTask && (
                        <Card className="mt-8">
                            <CardBody>
                                <h2 className="text-xl font-bold">Perform Action for Task: {selectedTask.TaskId}</h2>
                                <p>Task Type: {selectedTask.TaskType}</p>
                                <div className="flex gap-4 mt-4">
                                    <Button onPress={() => handleLoadStep('registration')}>Load Registration Data</Button>
                                    <Button onPress={() => handleLoadStep('calculation')} disabled>Load Calculation Data</Button>
                                    <Button onPress={() => handleLoadStep('settlement')} disabled>Load Settlement Data</Button>
                                </div>

                                {currentStep === 'registration' && currentClaimData && (
                                    <RegistrationForm
                                        initialData={currentClaimData}
                                        onSubmit={handleSubmitForm}
                                        isLoading={loading}
                                    />
                                )}
                                {/* Aquí irían los otros formularios */}
                            </CardBody>
                        </Card>
                    )}
                </div>
            </section>
        </DefaultLayout>
    );
}
