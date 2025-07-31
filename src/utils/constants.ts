// src/utils/constants.ts

/**
 * Formats a date to YYYY-MM-DDTHH:mm:ss format for the API.
 * @param date The date to format (can be a string or Date object).
 * @returns The formatted date string.
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
