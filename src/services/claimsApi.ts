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
    Model: {
        ClaimCase: {
            ClaimNo: string;
        };
    };
}

// --- Helper for Call Center Auth ---
const _getCallCenterToken = async () => {
    let token = localStorage.getItem('call_center_api_token');
    if (token) {
        return token;
    }
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
    async openClaim(data: NewClaimData): Promise<ClaimResponse> {
        try {
            const response: ClaimResponse = await api.post('easyclaim-core-v2/business/v1/fnol', { json: data }).json();
            return response;
        } catch (error) {
            console.error('Error opening claim:', error);
            throw error;
        }
    },

    async queryClaim(claimNo?: string) { // claimNo es ahora opcional
        const payload = {
            SortFieldsAndTypes: { AccidentTime: "desc" },
            PageNo: 1,
            PageSize: 10,
            ClaimNo: claimNo || "", // Usar string vacío si no se provee claimNo
        };
        try {
            const response = await api.post('easyclaim-core-v2/api/v1/queryClaim', { json: payload }).json();
            return response;
        } catch (error) {
            console.error(`Error querying claim ${claimNo}:`, error);
            throw error;
        }
    },

    async queryTask(claimNo: string) {
        const payload = {
            ClaimNo: claimNo,
            PageNo: "1",
            PageSize: "100",
        };
        try {
            const response = await api.post('easyclaim-core-v2/api/v1/queryTask', { json: payload }).json();
            return response;
        } catch (error) {
            console.error(`Error querying tasks for claim ${claimNo}:`, error);
            throw error;
        }
    },

    async assignTask(claimNo: string, taskId: string) {
        const payload = {
            ClaimNo: claimNo,
            TaskId: taskId,
            "@type": "ClaimRequestForm-ClaimRequestForm",
        };
        try {
            const response = await api.post('easyclaim-core-v2/business/v1/taskAssignment', { json: payload }).json();
            return response;
        } catch (error) {
            console.error(`Error assigning task ${taskId}:`, error);
            throw error;
        }
    },

    async loadStepData(step: 'registration' | 'calculation' | 'settlement', claimNo: string, taskId: string) {
        const payload = {
            OperationType: "3", // 3 for load
            ClaimNo: claimNo,
            TaskId: taskId,
            "@type": "ClaimRequestForm-ClaimRequestForm",
        };
        try {
            const response = await api.post(`easyclaim-core-v2/business/v1/${step}`, { json: payload }).json();
            return response;
        } catch (error) {
            console.error(`Error loading data for ${step}:`, error);
            throw error;
        }
    },

    async submitStepData(step: 'registration' | 'calculation' | 'settlement', payload: any) {
        try {
            // The payload for submit should be constructed outside and passed in
            const response = await api.post(`easyclaim-core-v2/business/v1/${step}`, { json: payload }).json();
            return response;
        } catch (error) {
            console.error(`Error submitting data for ${step}:`, error);
            throw error;
        }
    },

    async reportAccidentWithPolicy(policyNo: string, dateOfLoss: string) {
        const now = formatDateForApi(new Date());
        const payload = {
            "@type": "ClaimRequestForm-ClaimRequestForm",
            "ReportChannel": "2",
            "OperationType": "3",
            "ClaimNo": "CTRAV_PROP_MKT202500000127",
            "ClaimCase": {
                "@type": "ClaimCase-ClaimCase",
                "AccidentTime": formatDateForApi(dateOfLoss),
                "PolicyNo": policyNo,
                "NoticeTime": now,
                "ProductCode": "X_EX_US_FURNWTY1",
                "WithPolicy": "1",
            }
        };
        try {
            const response = await api.post('easyclaim-core-v2/business/v1/fnol', { json: payload }).json();
            return response;
        } catch (error) {
            console.error(`Error reporting accident for policy ${policyNo}:`, error);
            throw error;
        }
    },

    async retrievePolicy(policyNo: string, accidentTime: string) {
        const token = await _getCallCenterToken();
        if (!token) {
            throw new Error("Unable to get call center token");
        }

        const payload = {
            "@type": "ClaimRequestForm-ClaimRequestForm",
            "PolicyNo": policyNo,
            "AccidentTime": formatDateForApi(accidentTime),
            "IsManualPolicy": false // Corregido
        };
        try {
            // Usamos la URL correcta y una llamada directa con el token del call center
            const correctUrl = 'https://softtek-sandbox-am.insuremo.com/api/platform/easyclaim-core-v2/api/v1/retrievePolicy';
            const response = await ky.post(correctUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                json: payload
            }).json();
            return response;
        } catch (error) {
            console.error(`Error retrieving policy ${policyNo}:`, error);
            throw error;
        }
    },
};
