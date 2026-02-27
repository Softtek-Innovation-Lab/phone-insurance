/**
 * Índice central de utilidades
 * Re-exporta todas las utilidades del proyecto para facilitar imports
 */

// Utilidades de clases CSS
export { cn } from './classNames';

// Utilidades de formateo de fechas
export { formatDateForApi } from './dateFormatters';

// Re-exportar constants.ts existente por compatibilidad
// (mantiene imports antiguos funcionando)
export * from './constants';
