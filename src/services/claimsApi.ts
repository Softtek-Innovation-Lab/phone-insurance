import ky from 'ky';
import { formatDateForApi } from '@/utils/constants';
import { FNOLData } from '@/components/claims/FNOLForm';

const API_URL = 'https://ebaogi-gi-sandbox-am.insuremo.com/api/platform';
const INSUREMO_BASE_URL = 'https://sandbox-am.insuremo.com';
const TENANT_CODE = 'softtek';

// Credenciales de API para autenticación Insuremo
const API_USERNAME = 'softtek.api.test';
const API_ENCRYPTED_PASSWORD = '*mo_encrypted_rsa*wPrnrKJv8DryAiH59R/xJ1+ryhdDuyZvN+wFsxgsbSqbxrGTB7JWMbe8VAQ6mnCqgyaSl95Kz383Xn2SBlb/uSY9BN7V3xUxzXct1o0tCNuz449b4tyqqDhNtwWo8ZYrBafxjEGyngFd9bfDlGjmkfMKIUU9g3dbPgrIUzyozV6NlxGoWX/D7oTQGIe0bfJiVPQUxjDRnwjlsoML/LKZ+JRTrbK6wjp+PaFXSRivSGsMd5YK4F7lbwhC0IGYsSK7p+OzHvJh016HsFuYGe3M6L1iJMgVEeqkr8F4QkstA+hFuRvpaD/yVEtU0b4TAHGJg21h9yUGBrkvWmpbu4bE0A==';

// --- Instancia de KY con interceptor para Auth ---
const api = ky.create({
    prefixUrl: API_URL,
    hooks: {
        beforeRequest: [
            request => {
                // Leer el token de la API desde localStorage
                const apiToken = localStorage.getItem('api_token');
                if (apiToken) {
                    request.headers.set('Authorization', `Bearer ${apiToken}`);
                }
                request.headers.set('Content-Type', 'application/json');
            }
        ]
    }
});


// --- Interfaces para los datos ---

interface ApiResponse<T> {
    Model: T;
}

export interface PolicyInfoResponse {
    "@pk": number;
    "@type": string;
    BusinessObjectId: number;
    CaseId: string;
    ClmPolicyId: number;
    PolicyHolderName: string;
    PolicyNo: string;
    ClaimPolicyInsuredList: Array<{
        "@pk": number;
        "@type": string;
        BusinessObjectId: number;
        ClmInsuredId: number;
        InsuredName: string;
        InsuredNo: string;
        OrgInsuredId: number;
        SumInsured: number;
        ClaimPolicyCoverageList: Array<{
            "@pk": number;
            "@type": string;
            BusinessObjectId: number;
            ClmPolicyCoverageId: number;
            CoverageCode: string;
            CoverageName: string;
            DeductibleAmount: number;
            DeductibleRate: number;
            OrgPolicyCoverageId: number;
            ParentClmPolicyCoverageId: number;
            PolicySysCode: string;
            ProductCode: string;
            SumInsured: number;
        }>;
    }>;
    ClaimPolicyPartyList: Array<{
        "@pk": number;
        "@type": string;
        Address: string;
        BirthDate: string;
        BusinessObjectId: number;
        ClmPolicyPartyId: number;
        ContactAddress: string;
        ContactEmail: string;
        ContactFax: string;
        ContactPersonName: string;
        ContactPersonTel: string;
        CustomerType: string;
        Email: string;
        GenderCode: string;
        IdNo: string;
        IdType: string;
        Mobile: string;
        PartyName: string;
        PostCode: string;
        PtyPartyCode: string;
        PtyPartyId: number;
        RoleType: string;
    }>;
    CurrencyCode: string;
    EcsBookCurrencyCode: string;
    EcsPaPolicyId: string;
    EcsProductVersion: string;
    EcsSiCurrencyCode: string;
    EffDate: string;
    ExpDate: string;
    IsDeleted: string;
    OrgCode: string;
    PolicyStatus: number;
    PolicyType: string;
    Premium: number;
    ProductCode: string;
}

export interface NewClaimData {
    // Basado en "open claim without policy"
    ReportChannel: string;
    OperationType: string;
    ClaimCase: {
        AccidentTime: string;
        ClaimObjectList: {
            DamageType: string;
            Property: object;
            RiskName: string;
            SequenceNo: number;
            StatusCode: string;
            SubClaimType: string;
            DamageObject: string;
        }[];
        EcsHasOtherPolicies: string;
        EcsIsFromApp: string;
        EcsProductLineCode: string;
        EcsProductVersion: string;
        FnolRemark: string;
        FnolStatus: string;
        LossCause: string;
        NoticeTime: string;
        ProductCode: string;
        RecordType: string;
        VersionSeq: number;
        WithPolicy: string;
        SettlementTimes: number;
    };
}

export interface ClaimResponse {
    ClaimCase: {
        ClaimNo: string;
    };
}

// --- Helper for Call Center Auth ---
export const getCallCenterToken = async () => {
    try {
        // Usar un endpoint diferente para la autenticación del call center
        const loginApi = ky.create();
        const response: { access_token: string } = await loginApi.post('https://sandbox-am.insuremo.com/cas/ebao/v1/json/tickets', {
            headers: {
                'Content-Type': 'application/json',
                'x-ebao-tenant-code': 'softtek',
            },
            json: {
                username: 'softtek_callcenterop',
                password: 'Softtek@2025',
            }
        }).json();
        if (response.access_token) {
            localStorage.setItem('api_token', response.access_token);
            return response.access_token;
        }
        return null;
    } catch (error) {
        console.error("Call Center Login failed:", error);
        return null;
    }
};

// --- Helper for Insuremo API Auth (login + exchange) ---
interface InsuremoAuthResponse {
    data: {
        exchange_code: string;
    };
}

interface InsuremoTokenResponse {
    data: {
        access_token: string;
    };
}

async function login(): Promise<string> {
    const response = await fetch(
        `${INSUREMO_BASE_URL}/cas/v2/login?client_id=key&response_type=code&tenant_code=${TENANT_CODE}&redirect_uri=${INSUREMO_BASE_URL}&tenant_uri=https://${TENANT_CODE}-sandbox-am.insuremo.com/ui/admin/%23/&format=json`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            body: JSON.stringify({
                username: API_USERNAME,
                tenant_code: TENANT_CODE,
                user_source_id: 'mo',
                enc_password: API_ENCRYPTED_PASSWORD,
                verification_type: '',
                verification: '',
                tenant_uri: `https://${TENANT_CODE}-sandbox-am.insuremo.com/ui/admin/#/`,
            }),
        }
    );

    if (!response.ok) {
        throw new Error('Error en autenticación');
    }

    const data: InsuremoAuthResponse = await response.json();
    return data.data.exchange_code;
}

async function getAccessToken(exchangeCode: string): Promise<string> {
    const response = await fetch(
        `${INSUREMO_BASE_URL}/cas/oauth2.0/v2/consume?exchange_code=${exchangeCode}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'x-mo-tenant-id': TENANT_CODE,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Error obteniendo access token');
    }

    const data: InsuremoTokenResponse = await response.json();
    return data.data.access_token;
}

export const authenticateInsuremo = async (): Promise<string> => {
    const exchangeCode = await login();
    const accessToken = await getAccessToken(exchangeCode);
    return accessToken;
};

// --- Servicio de API ---

export const claimsApi = {
    async loadPolicyInfo(claimNo: string): Promise<ApiResponse<PolicyInfoResponse>> {
        const token = await getCallCenterToken();
        if (!token) throw new Error("Could not authenticate call center");

        const payload = {
            "@type": "ClaimRequestForm-ClaimRequestForm",
            "ClaimNo": claimNo
        };

        return ky.post(
            'https://softtek-sandbox-am.insuremo.com/api/platform/easyclaim-core-v2/api/v1/loadPolicyInfo',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json; charset=UTF-8',
                    'accept': 'application/json',
                    'accept-language': 'en-US,en;q=0.9,es;q=0.8',
                    'x-mo-env': 'kylin_dev',
                    'x-mo-module-permission-code': 'NEWEST_CLAIM_TASK',
                    'x-mo-module-ui-url': `https://softtek-sandbox-am.insuremo.com/ui/easyclaim-v2/?iframeV=0.10833980343790162#/task/notice?ClaimNo=${claimNo}`,
                    'x-mo-tenant-id': 'softtek',
                    'x-mo-user-identity': 'softtek_callcenter',
                    'x-mo-user-name': 'softtek_callcenter',
                    'Referer': 'https://softtek-sandbox-am.insuremo.com/ui/easyclaim-v2/?iframeV=0.10833980343790162'
                },
                json: payload
            }
        ).json();
    },

    async submitFNOL(claimNo: string, taskId: string, data: FNOLData, policyNo: string) {
        const token = await getCallCenterToken();
        if (!token) throw new Error("Could not authenticate call center");

        // Obtener la información de la póliza para tener los datos correctos del case
        const policyInfo = await this.loadPolicyInfo(claimNo);
        const caseId = policyInfo.Model.CaseId;
        const clmPolicyId = policyInfo.Model.ClmPolicyId;
        const policyHolderName = policyInfo.Model.PolicyHolderName;

        // Extraer el @pk del CaseId (primera parte antes de la coma)
        const pkNumber = parseInt(caseId.split(',')[0]);

        // Usar el BusinessObjectId específico del claim case que sabemos que funciona
        const businessObjectId = 371651130;

        // Formatear las fechas correctamente
        const currentDate = new Date();
        const accidentDate = new Date(data.dateOfLoss);

        // Si la fecha del accidente es futura, usar una fecha 1 mes antes de hoy
        let finalAccidentDate = accidentDate;
        if (accidentDate > currentDate) {
            finalAccidentDate = new Date();
            finalAccidentDate.setMonth(finalAccidentDate.getMonth() - 1);
        }

        const accidentTime = formatDateForApi(finalAccidentDate);
        const currentTime = formatDateForApi(currentDate);        // Construir el payload usando los datos correctos
        const payload = {
            "@type": "ClaimRequestForm-ClaimRequestForm",
            "ReportChannel": "2",
            "OperationType": "2",
            "ClaimNo": claimNo,
            "TaskId": taskId,
            "ClaimCase": {
                "@pk": pkNumber,
                "@type": "ClaimCase-ClaimCase",
                "AccidentTime": accidentTime,
                "BusinessObjectId": businessObjectId,
                "CaseId": caseId,
                "CaseStatus": "01",
                "ClaimNo": claimNo,
                "ClmPolicyId": clmPolicyId,
                "EcsInsertTime": new Date().toISOString().slice(0, 19),
                "EcsIsFromApp": "N",
                "EcsProductLineCode": "02",
                "EcsProductVersion": "1.0",
                "EcsUpdateTime": new Date().toISOString().slice(0, 19),
                "FnolNo": claimNo,
                "FnolStatus": "01",
                "NoticeTime": currentTime,
                "PolicyNo": policyNo,
                "PolicyOrgCode": "softtek",
                "ProductCode": "TRAV_PROP_MKT",
                "RecordType": "1",
                "VersionSeq": 2,
                "WithPolicy": "1",
                "PolicyHolderName": policyHolderName,
                "SettlementTimes": 0,
                "EcsHasOtherPolicies": data.otherPolicies === 'yes' ? '1' : '0',
                "LossCause": data.causeOfLoss,
                "FnolRemark": data.accidentDescription || "",
            }
        };

        const fnolResponse = await ky.post(
            'https://softtek-sandbox-am.insuremo.com/api/platform/easyclaim-core-v2/business/v1/fnol',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json; charset=UTF-8',
                    'accept': 'application/json',
                    'accept-language': 'en-US,en;q=0.9,es;q=0.8',
                    'x-mo-env': 'am_uat',
                    'x-mo-module-permission-code': 'NEWEST_CLAIM_TASK',
                    'x-mo-module-ui-url': `https://softtek-sandbox-am.insuremo.com/ui/easyclaim-v2/?iframeV=0.4039595344506257#/task/notice?ClaimNo=${claimNo}&TaskId=${taskId}`,
                    'x-mo-tenant-id': 'softtek',
                    'x-mo-user-identity': 'softtek_callcenter',
                    'x-mo-user-name': 'softtek_callcenter',
                    'Referer': 'https://softtek-sandbox-am.insuremo.com/ui/easyclaim-v2/?iframeV=0.4039595344506257'
                },
                json: payload
            }
        ).json();

        // Después del FNOL exitoso, obtener el TaskId del siguiente paso

        // 1. Obtener pending tasks
        const pendingTasksResponse = await ky.post(
            'https://softtek-sandbox-am.insuremo.com/api/platform/easyclaim-core-v2/taskAssignApproach/v1/getPendingTaskCreatedByOperation',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json; charset=UTF-8',
                    'accept': 'application/json',
                    'accept-language': 'en-US,en;q=0.9,es;q=0.8',
                    'x-mo-env': 'am_uat',
                    'x-mo-module-permission-code': 'NEWEST_CLAIM_TASK',
                    'x-mo-module-ui-url': `https://softtek-sandbox-am.insuremo.com/ui/easyclaim-v2/?iframeV=0.30910960076122096#/task/notice?ClaimNo=${claimNo}&TaskId=${taskId}`,
                    'x-mo-tenant-id': 'softtek',
                    'x-mo-user-identity': 'softtek_callcenter',
                    'x-mo-user-name': 'softtek_callcenter',
                    'Referer': 'https://softtek-sandbox-am.insuremo.com/ui/easyclaim-v2/?iframeV=0.30910960076122096'
                },
                json: {
                    "currentTaskId": taskId,
                    "isGetAuthUser": "Y"
                }
            }
        ).json() as any;

        // Obtener el CaseId del pending task
        const pendingTask = pendingTasksResponse.Model?.PendingTasks?.[0];
        if (!pendingTask) {
            console.warn("No pending tasks found, skipping task assignment");
            return fnolResponse;
        }

        const pendingCaseId = pendingTask.CaseId;

        // 2. Obtener el TaskId específico para el task assignment
        const transferTasksResponse = await ky.post(
            `https://softtek-sandbox-am.insuremo.com/api/platform/easyclaim-core-v2/api/v1/loadTransferPendingTasks?caseId=${pendingCaseId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json; charset=UTF-8',
                    'accept': 'application/json',
                    'accept-language': 'en-US,en;q=0.9,es;q=0.8',
                    'x-mo-env': 'am_uat',
                    'x-mo-module-permission-code': 'NEWEST_CLAIM_TASK',
                    'x-mo-module-ui-url': `https://softtek-sandbox-am.insuremo.com/ui/easyclaim-v2/?iframeV=0.30910960076122096#/task/notice?ClaimNo=${claimNo}&TaskId=${taskId}`,
                    'x-mo-tenant-id': 'softtek',
                    'x-mo-user-identity': 'softtek_callcenter',
                    'x-mo-user-name': 'softtek_callcenter',
                    'Referer': 'https://softtek-sandbox-am.insuremo.com/ui/easyclaim-v2/?iframeV=0.30910960076122096'
                }
            }
        ).json() as any;

        // Obtener el TaskId del primer task en la lista
        const nextTask = transferTasksResponse.Model?.TaskList?.[0];
        if (!nextTask) {
            console.warn("No transfer tasks found, skipping task assignment");
            return fnolResponse;
        }

        const nextTaskId = nextTask.TaskId;

        // 3. Hacer el task assignment con el TaskId correcto
        const taskAssignmentPayload = {
            "@type": "ClaimRequestForm-ClaimRequestForm",
            "TaskId": nextTaskId,
            "ClaimNo": claimNo
        };

        await ky.post(
            'https://softtek-sandbox-am.insuremo.com/api/platform/easyclaim-core-v2/business/v1/taskAssignment',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json; charset=UTF-8',
                    'accept': 'application/json',
                    'accept-language': 'en-US,en;q=0.9,es;q=0.8',
                    'x-mo-env': 'am_uat',
                    'x-mo-module-permission-code': 'NEWEST_CLAIM_TASK',
                    'x-mo-module-ui-url': `https://softtek-sandbox-am.insuremo.com/ui/easyclaim-v2/?iframeV=0.2564593501463439#/task/notice?ClaimNo=${claimNo}&TaskId=${taskId}`,
                    'x-mo-tenant-id': 'softtek',
                    'x-mo-user-identity': 'softtek_callcenter',
                    'x-mo-user-name': 'softtek_callcenter',
                    'Referer': 'https://softtek-sandbox-am.insuremo.com/ui/easyclaim-v2/?iframeV=0.2564593501463439'
                },
                json: taskAssignmentPayload
            }
        );

        return fnolResponse;
    },

    async openClaim(data: NewClaimData): Promise<ApiResponse<ClaimResponse>> {
        try {
            const response: ApiResponse<ClaimResponse> = await api.post('easyclaim-core-v2/business/v1/fnol', { json: data }).json();
            return response;
        } catch (error) {
            console.error("Error opening claim:", error);
            throw error;
        }
    },

    async queryClaim(userIdNumber?: string): Promise<ApiResponse<{ ClaimList: any[], PageNo: number, PageSize: number, Total: number }>> {
        // Usar autenticación Insuremo (login + exchange) igual que easypa_createOrSave
        const accessToken = await authenticateInsuremo();
        
        const payload = {
            "SortFieldsAndTypes": {
                "AccidentTime": "desc"
            },
            "PageNo": 1,
            "PageSize": 10,
            "MultipleQuery": userIdNumber
        };
        
        const response = await ky.post(
            `https://softtek-sandbox-am.insuremo.com/api/platform/easyclaim-core-v2/api/v1/queryClaim`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'accept': '*/*',
                    'accept-language': 'es-419,es;q=0.9,en;q=0.8',
                    'referer': 'https://softtek-sandbox-am.insuremo.com/ui/easyclaim-v2/?iframeV=0.2714630512301402',
                    'response-type': 'application/json',
                    'x-mo-env': 'am_uat',
                    'x-mo-tenant-id': TENANT_CODE,
                    'x-mo-module-permission-code': 'NEWEST_CLAIM_QUERY',
                    'x-mo-module-ui-url': 'https://softtek-sandbox-am.insuremo.com/ui/easyclaim-v2/?iframeV=0.27146305123014025#/claimQuery?apcforca=NEWEST_CLAIM_QUERY',
                    'x-mo-user-identity': 'softtek.api.test',
                    'x-mo-user-name': 'softtek.api.test',
                },
                json: payload
            }
        ).json() as any;
        
        return response;
    },

    async queryTask(claimNo: string): Promise<ApiResponse<{ TaskInfoList: any[] }>> {
        const payload = {
            "PageNo": 1,
            "PageSize": 10,
            "Parameters": {
                "ClaimNo": claimNo
            }
        };
        const response: ApiResponse<{ TaskInfoList: any[] }> = await api.post('easyclaim-core-v2/business/v1/queryTask', { json: payload }).json();
        return response;
    },

    async assignTask(claimNo: string, taskId: string): Promise<void> {
        const payload = {
            "ClaimNo": claimNo,
            "TaskId": taskId
        };
        await api.post('easyclaim-core-v2/business/v1/assignTask', { json: payload });
    },

    async loadStepData(step: string, claimNo: string, taskId: string): Promise<ApiResponse<any>> {
        const payload = {
            "claimNo": claimNo,
            "taskId": taskId
        };
        const response: ApiResponse<any> = await api.post(`easyclaim-core-v2/business/v1/${step}/load`, { json: payload }).json();
        return response;
    },

    async submitStepData(step: string, payload: any): Promise<ApiResponse<any>> {
        const response: ApiResponse<any> = await api.post(`easyclaim-core-v2/business/v1/${step}/submit`, { json: payload }).json();
        return response;
    },

    async reportAccidentWithPolicy(policyNo: string, dateOfLoss: string, causeOfLoss?: string): Promise<ApiResponse<any>> {
        const token = await getCallCenterToken();
        if (!token) throw new Error("Could not authenticate call center");

        const payload = {
            "@type": "ClaimRequestForm-ClaimRequestForm",
            "OperationType": "1",
            "ReportChannel": "2",
            "ClaimCase": {
                "@type": "ClaimCase-ClaimCase",
                "PolicyNo": policyNo,
                "AccidentTime": formatDateForApi(new Date(dateOfLoss)),
                ...(causeOfLoss && { "LossCause": causeOfLoss })
            },
            "IsManualPolicy": false
        };

        const response: ApiResponse<any> = await ky.post(
            'https://softtek-sandbox-am.insuremo.com/api/platform/easyclaim-core-v2/business/v1/fnol',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json; charset=UTF-8',
                    'x-mo-env': 'am_uat',
                    'x-mo-module-permission-code': 'NEWEST_CLAIM_TASK',
                    'x-mo-module-ui-url': 'https://softtek-sandbox-am.insuremo.com/ui/easyclaim-v2/?iframeV=0.8539853838967773#/taskQuery?apcforca=NEWEST_CLAIM_TASK',
                    'x-mo-tenant-id': 'softtek',
                    'x-mo-user-identity': 'softtek_callcenter',
                    'x-mo-user-name': 'softtek_callcenter'
                },
                json: payload
            }
        ).json();
        return response;
    },

    async retrievePolicy(policyNo: string, accidentTime: string) {
        const token = await getCallCenterToken();
        if (!token) {
            throw new Error("Authentication failed");
        }

        const payload = {
            "@type": "ClaimRequestForm-ClaimRequestForm",
            "PolicyNo": policyNo,
            "AccidentTime": formatDateForApi(new Date(accidentTime)),
            "IsManualPolicy": false
        };

        const response: ApiResponse<any> = await ky.post(
            'https://softtek-sandbox-am.insuremo.com/api/platform/easyclaim-core-v2/api/v1/retrievePolicy',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json; charset=UTF-8',
                    'x-mo-env': 'am_uat',
                    'x-mo-module-permission-code': 'NEWEST_CLAIM_TASK',
                    'x-mo-module-ui-url': 'https://softtek-sandbox-am.insuremo.com/ui/easyclaim-v2/?iframeV=0.8539853838967773#/taskQuery?apcforca=NEWEST_CLAIM_TASK',
                    'x-mo-tenant-id': 'softtek',
                    'x-mo-user-identity': 'softtek_callcenter',
                    'x-mo-user-name': 'softtek_callcenter'
                },
                json: payload
            }
        ).json();
        return response;
    },

    async reportAccident(policyNo: string, dateOfLoss: string) {
        const token = await getCallCenterToken();
        if (!token) {
            throw new Error("Authentication failed");
        }

        const payload = {
            "@type": "ClaimRequestForm-ClaimRequestForm",
            "OperationType": "1",
            "ReportChannel": "2",
            "ClaimCase": {
                "@type": "ClaimCase-ClaimCase",
                "PolicyNo": policyNo,
                "AccidentTime": formatDateForApi(new Date(dateOfLoss))
            },
            "IsManualPolicy": false
        };

        const response: ApiResponse<any> = await ky.post(
            'https://softtek-sandbox-am.insuremo.com/api/platform/easyclaim-core-v2/business/v1/fnol',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json; charset=UTF-8',
                    'x-mo-env': 'am_uat',
                    'x-mo-module-permission-code': 'NEWEST_CLAIM_TASK',
                    'x-mo-module-ui-url': 'https://softtek-sandbox-am.insuremo.com/ui/easyclaim-v2/?iframeV=0.8539853838967773#/taskQuery?apcforca=NEWEST_CLAIM_TASK',
                    'x-mo-tenant-id': 'softtek',
                    'x-mo-user-identity': 'softtek_callcenter',
                    'x-mo-user-name': 'softtek_callcenter'
                },
                json: payload
            }
        ).json();
        return response;
    }
};
