/**
 * Utilidades para formateo de fechas
 * Migrado desde src/utils/constants.ts
 */

/**
 * Formatea una fecha al formato YYYY-MM-DDTHH:mm:ss para la API de Insuremo
 * 
 * @param date - La fecha a formatear (puede ser string o Date)
 * @returns La fecha formateada como string
 * 
 * @example
 * formatDateForApi(new Date()) // "2026-02-27T10:30:45"
 * formatDateForApi("2026-02-27") // "2026-02-27T00:00:00"
 */
export const formatDateForApi = (date: string | Date): string => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};
