import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DefaultLayout from "@/layouts/default";
import { AppDispatch, RootState } from "@/store";
import { fetchClaimDetails, fetchTasks, assignTask, loadStepData } from "@/store/slices/claimsSlice";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { ArrowLeft, FileText, Shield, DollarSign, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ClaimDetailsPage() {
    const { claimNo } = useParams<{ claimNo: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { claims, tasks, loading, error } = useSelector((state: RootState) => state.claims);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const t = useTranslation().t;

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
        }
    };

    const claim = claims.find((c: any) => c.ClaimNo === claimNo) || 
                  (claimNo && !isNaN(Number(claimNo)) && claims[Number(claimNo)]) ||
                  (claims.length > 0 ? claims[0] : null);

    return (
        <DefaultLayout>
            <section className="py-8">
                <div className="max-w-5xl mx-auto space-y-6">
                    <div>
                        <Button 
                            variant="light" 
                            startContent={<ArrowLeft size={18} />}
                            onPress={() => navigate('/claims-centre')}
                        >
                            {t('claimList.details.backButton')}
                        </Button>
                    </div>

                    {loading && (
                        <div className="flex justify-center py-16">
                            <Spinner size="lg" label={t('claimList.details.loading')} />
                        </div>
                    )}

                    {error && (
                        <Card className="border-danger/30 bg-danger/10">
                            <CardBody className="flex flex-row items-center gap-3">
                                <AlertCircle className="text-danger flex-shrink-0" size={24} />
                                <p className="text-sm text-danger">{error}</p>
                            </CardBody>
                        </Card>
                    )}
                    {!loading && !claim && !error && (
                        <Card>
                            <CardBody className="text-center py-12">
                                <p className="text-gray-500">{t('claimList.details.noDetails')}</p>
                            </CardBody>
                        </Card>
                    )}

                    {!loading && claim && (
                        <div className="space-y-6">
                            <Card className="shadow-sm">
                                <CardBody className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                    <div>
                                        <h1 className="text-2xl font-bold">{t('claimList.details.title')} #{claim.ClaimNo || claimNo}</h1>
                                        <p className="text-sm text-gray-500">{claim.ProductName || claim.ProductCode} • Registrado el {claim.NoticeTime ? new Date(claim.NoticeTime).toLocaleString() : 'N/A'}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">{claim.CaseStatus || 'Activo'}</span>
                                </CardBody>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="shadow-sm">
                                    <CardHeader className="flex gap-2 pb-2">
                                        <FileText className="text-primary" size={20} />
                                        <p className="font-bold">{t('claimList.details.claimInfoTitle')}</p>
                                    </CardHeader>
                                    <CardBody className="space-y-2 text-sm">
                                        <div className="flex justify-between border-b pb-1"><span className="text-gray-500">{t('claimList.details.claimNo')}:</span><span className="font-semibold">{claim.ClaimNo || 'N/A'}</span></div>
                                        <div className="flex justify-between border-b pb-1"><span className="text-gray-500">{t('claimList.details.claimAccidentDate')}:</span><span className="font-semibold">{claim.AccidentTime ? new Date(claim.AccidentTime).toLocaleString() : 'N/A'}</span></div>
                                        <div className="flex justify-between border-b pb-1"><span className="text-gray-500">{t('claimList.details.claimNoticeDate')}:</span><span className="font-semibold">{claim.NoticeTime ? new Date(claim.NoticeTime).toLocaleString() : 'N/A'}</span></div>
                                        <div className="flex justify-between border-b pb-1"><span className="text-gray-500">{t('claimList.details.claimCause')}:</span><span className="font-semibold">{claim.LossCause || '02'}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">{t('claimList.details.claimCaseID')}:</span><span className="font-mono text-xs truncate max-w-[200px]" title={claim.CaseId}>{claim.CaseId || 'N/A'}</span></div>
                                    </CardBody>
                                </Card>

                                <Card className="shadow-sm">
                                    <CardHeader className="flex gap-2 pb-2">
                                        <Shield className="text-primary" size={20} />
                                        <p className="font-bold">{t('claimList.details.claimPolicyInfoTitle')}</p>
                                    </CardHeader>
                                    <CardBody className="space-y-2 text-sm">
                                        <div className="flex justify-between border-b pb-1"><span className="text-gray-500">{t('claimList.details.claimPolicyNo')}:</span><span className="font-semibold text-primary">{claim.PolicyNo || 'N/A'}</span></div>
                                        <div className="flex justify-between border-b pb-1"><span className="text-gray-500">{t('claimList.details.claimPropietary')}:</span><span className="font-semibold">{claim.PolicyHolderName || 'Michael Thompson'}</span></div>
                                        <div className="flex justify-between border-b pb-1"><span className="text-gray-500">{t('claimList.details.claimProduct')}:</span><span className="font-semibold">{claim.ProductName || claim.ProductCode || 'N/A'}</span></div>
                                        <div className="flex justify-between border-b pb-1"><span className="text-gray-500">{t('claimList.details.claimPolicyStart')}:</span><span className="font-semibold">{claim.PolicyStartDate || 'N/A'}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">{t('claimList.details.claimPolicyEnd')}:</span><span className="font-semibold">{claim.PolicyEndDate ? new Date(claim.PolicyEndDate).toLocaleDateString() : 'N/A'}</span></div>
                                    </CardBody>
                                </Card>
                            </div>

                            <Card className="shadow-sm">
                                <CardHeader className="flex gap-2 pb-2">
                                    <DollarSign className="text-success" size={20} />
                                    <p className="font-bold">{t('claimList.details.claimAmountTitle')}</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                        <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">{t('claimList.details.claimAmountRequested')}</p><p className="text-lg font-bold">${claim.RequestAmount || 0}</p></div>
                                        <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">{t('claimList.details.claimAmountSettled')}</p><p className="text-lg font-bold text-success">${claim.SettlementAmount || claim.TotalSettledAmount || 0}</p></div>
                                        <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">{t('claimList.details.claimAmountPending')}</p><p className="text-lg font-bold text-warning">${claim.TotalOutstandingAmount || 0}</p></div>
                                        <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">{t('claimList.details.claimAmountIncurred')}</p><p className="text-lg font-bold">${claim.TotalIncurred || 0}</p></div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    )}

                    {tasks && tasks.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold">Tareas del Siniestro</h2>
                            <Card className="shadow-sm">
                                <CardBody>
                                    <Table aria-label="Tareas del Siniestro">
                                        <TableHeader>
                                            <TableColumn>ID de Tarea</TableColumn>
                                            <TableColumn>Tipo</TableColumn>
                                            <TableColumn>Estado</TableColumn>
                                            <TableColumn>Acciones</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            {tasks.map((task: any) => (
                                                <TableRow key={task.TaskId}>
                                                    <TableCell className="font-mono text-xs">{task.TaskId}</TableCell>
                                                    <TableCell>{task.TaskType}</TableCell>
                                                    <TableCell>
                                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">{task.TaskStatus}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button 
                                                            size="sm" 
                                                            color="primary"
                                                            variant="flat"
                                                            onPress={() => handleAssignTask(task.TaskId)} 
                                                            disabled={task.TaskStatus !== 'Pending'}
                                                        >
                                                            Asignar
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardBody>
                            </Card>

                            {selectedTask && (
                                <Card className="mt-4 border-primary/20">
                                    <CardBody>
                                        <h3 className="text-lg font-bold">Gestionar Tarea: {selectedTask.TaskId}</h3>
                                        <p className="text-sm text-gray-500">Tipo: {selectedTask.TaskType}</p>
                                        <div className="flex flex-wrap gap-3 mt-4">
                                            <Button size="sm" color="primary" onPress={() => handleLoadStep('registration')}>
                                                Cargar Datos de Registro
                                            </Button>
                                            <Button size="sm" variant="bordered" onPress={() => handleLoadStep('calculation')} disabled>
                                                Cargar Cálculo
                                            </Button>
                                            <Button size="sm" variant="bordered" onPress={() => handleLoadStep('settlement')} disabled>
                                                Cargar Liquidación
                                            </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </DefaultLayout>
    );
}
