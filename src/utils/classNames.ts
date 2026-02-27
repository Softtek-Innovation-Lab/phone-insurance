/**
 * Utilidades para manipulación de nombres de clases CSS
 * Migrado desde src/lib/utils.ts
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina nombres de clases usando clsx y tailwind-merge
 * Útil para manejar clases condicionales de Tailwind CSS
 * 
 * @param inputs - Array de valores de clase que pueden ser strings, objetos, arrays, etc.
 * @returns String con las clases combinadas y deduplicadas
 * 
 * @example
 * cn("px-4 py-2", isActive && "bg-blue-500", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
