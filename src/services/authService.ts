/**
 * Servicio centralizado de autenticación para Insuremo API
 * 
 * Este servicio maneja toda la lógica de autenticación con la API de Insuremo,
 * incluyendo login, exchange de tokens y helpers de autenticación.
 */

import type { 
    InsuremoAuthResponse, 
    InsuremoTokenResponse, 
    CallCenterAuthResponse 
} from '@/types/api';

const INSUREMO_BASE_URL = 'https://sandbox-am.insuremo.com';
const TENANT_CODE = 'softtek';

// Credenciales de API para autenticación Insuremo
const API_USERNAME = 'softtek.api.test';
const API_ENCRYPTED_PASSWORD = '*mo_encrypted_rsa*wPrnrKJv8DryAiH59R/xJ1+ryhdDuyZvN+wFsxgsbSqbxrGTB7JWMbe8VAQ6mnCqgyaSl95Kz383Xn2SBlb/uSY9BN7V3xUxzXct1o0tCNuz449b4tyqqDhNtwWo8ZYrBafxjEGyngFd9bfDlGjmkfMKIUU9g3dbPgrIUzyozV6NlxGoWX/D7oTQGIe0bfJiVPQUxjDRnwjlsoML/LKZ+JRTrbK6wjp+PaFXSRivSGsMd5YK4F7lbwhC0IGYsSK7p+OzHvJh016HsFuYGe3M6L1iJMgVEeqkr8F4QkstA+hFuRvpaD/yVEtU0b4TAHGJg21h9yUGBrkvWmpbu4bE0A==';

/**
 * Paso 1: Autenticación - Obtener exchange_code
 */
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

/**
 * Paso 2: Intercambiar exchange_code por access_token
 */
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

/**
 * Obtener token de autenticación completo (login + exchange)
 * Usado principalmente para operaciones de pólizas y consultas
 */
export async function authenticateInsuremo(): Promise<string> {
    const exchangeCode = await login();
    const accessToken = await getAccessToken(exchangeCode);
    return accessToken;
}

/**
 * Obtener token de autenticación para Call Center
 * Usado principalmente para operaciones de reclamos
 */
export async function getCallCenterToken(): Promise<string | null> {
    try {
        const response = await fetch('https://sandbox-am.insuremo.com/cas/ebao/v1/json/tickets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-ebao-tenant-code': TENANT_CODE,
            },
            body: JSON.stringify({
                username: 'softtek_callcenterop',
                password: 'Softtek@2025',
            })
        });

        if (!response.ok) {
            throw new Error('Call Center authentication failed');
        }

        const data: CallCenterAuthResponse = await response.json();
        
        if (data.access_token) {
            localStorage.setItem('api_token', data.access_token);
            return data.access_token;
        }
        
        return null;
    } catch (error) {
        console.error("Call Center Login failed:", error);
        return null;
    }
}

/**
 * Constantes exportadas para uso en otros servicios
 */
export const AUTH_CONSTANTS = {
    INSUREMO_BASE_URL,
    TENANT_CODE,
    API_USERNAME,
} as const;
