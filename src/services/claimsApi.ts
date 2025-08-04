import ky from 'ky';
import { formatDateForApi } from '@/utils/constants';

const API_URL = 'https://ebaogi-gi-sandbox-am.insuremo.com/api/platform';

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
const _getCallCenterToken = async () => {

    try {
        // Usar un endpoint diferente para la autenticación del call center
        const loginApi = ky.create();
        const response: { access_token: string } = await loginApi.post('https://sandbox-am.insuremo.com/cas/ebao/v1/json/tickets', {
            headers: {
                'Content-Type': 'application/json',
                'x-ebao-tenant-code': 'softtek',
            },
            json: {
                username: 'softtek_callcenter',
                password: 'Softtek@2025',
            }
        }).json();
        if (response.access_token) {
            localStorage.setItem('call_center_api_token', response.access_token);
            return response.access_token;
        }
        return null;
    } catch (error) {
        console.error("Call Center Login failed:", error);
        return null;
    }
};

// --- Servicio de API ---

export const claimsApi = {
    async openClaim(data: NewClaimData): Promise<ApiResponse<ClaimResponse>> {
        try {
            const response: ApiResponse<ClaimResponse> = await api.post('easyclaim-core-v2/business/v1/fnol', { json: data }).json();
            return response;
        } catch (error) {
            console.error("Error opening claim:", error);
            throw error;
        }
    },

    async queryClaim(claimNo?: string): Promise<ApiResponse<{ data: any[] }>> {
        const payload = {
            "PageNo": 1,
            "PageSize": 10,
            "Parameters": {
                "ClaimNo": claimNo || ""
            }
        };
        const response: ApiResponse<{ data: any[] }> = await api.post('easyclaim-core-v2/business/v1/queryClaim', { json: payload }).json();
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

    async reportAccidentWithPolicy(policyNo: string, dateOfLoss: string): Promise<ApiResponse<any>> {
        const token = await _getCallCenterToken();
        if (!token) throw new Error("Could not authenticate call center");

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
    },

    async retrievePolicy(policyNo: string, accidentTime: string): Promise<ApiResponse<any>> {
        const token = await _getCallCenterToken();
        console.log("Retrieve Policy called with token:", token);
        if (!token) throw new Error("Could not authenticate call center");

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
    }
};
