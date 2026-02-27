/**
 * Tipos compartidos para las respuestas de la API de Insuremo
 * Centraliza las definiciones de tipos para evitar duplicación
 */

/**
 * Respuesta genérica de la API de Insuremo
 * Todas las respuestas siguen este patrón
 */
export interface InsuremoApiResponse<T> {
    Model: T;
    Status?: string;
}

/**
 * Respuesta de autenticación - Paso 1 (Login)
 * Contiene el código de intercambio que se usa para obtener el access token
 */
export interface InsuremoAuthResponse {
    data: {
        exchange_code: string;
    };
}

/**
 * Respuesta de autenticación - Paso 2 (Exchange Token)
 * Contiene el token de acceso para hacer llamadas a la API
 */
export interface InsuremoTokenResponse {
    data: {
        access_token: string;
    };
}

/**
 * Respuesta de autenticación del Call Center
 * Usado para operaciones de reclamos
 */
export interface CallCenterAuthResponse {
    access_token: string;
}

/**
 * Estructura base para payloads de pólizas
 */
export interface PolicyPayload {
    EffectiveDate: string;
    ExpiryDate: string;
    PremiumCurrencyCode: string;
    BookCurrencyCode: string;
    PremiumBookExchangeRate: number;
    ProposalStatus: string;
    PolicyType: string;
    ProductId: number;
    ProductVersion: string;
    ProductCode: string;
    ProposalDate: string;
    OrgCode: string;
    LocalCurrencyCode: string;
    PremiumLocalExchangeRate: number;
}

/**
 * Respuesta genérica de operación exitosa/fallida
 */
export interface OperationResponse {
    success: boolean;
    data?: any;
    error?: string;
    message?: string;
}
