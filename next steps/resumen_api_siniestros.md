Resumen de Endpoints - Warranty-1023
Este resumen describe los principales puntos del flujo de gestión de reclamos, desde la carga inicial hasta el
cierre del caso. La información está simplificada para facilitar su comprensión por parte del equipo de
analistas.
1. Apertura de Reclamo sin Póliza
Datos de entrada: descripción del siniestro, fecha, datos del objeto dañado (ej. tipo, marca, valor
estimado).
Respuesta: número de reclamo generado.
2. Consulta de Reclamo
Datos de entrada: número de reclamo.
Respuesta: estado actual, fecha de creación, tareas asociadas, información del objeto.
3. Reclamo con Póliza y Pago Automático
Datos de entrada: número de póliza, datos del siniestro, beneficiario.
Respuesta: número de reclamo, datos de pago generados.
4. Reclamo Común con Póliza
Datos de entrada: número de póliza, datos del siniestro.
Respuesta: número de reclamo.
5. Consulta de Tareas Asociadas al Reclamo
Datos de entrada: número de reclamo.
Respuesta: listado de tareas con estados (pendiente, en proceso, finalizada).
6. Asignación de Tarea
Datos de entrada: número de reclamo, tipo de tarea, usuario asignado.
Respuesta: confirmación de asignación.
7. Carga de Información de Registro
Datos de entrada: nombre, DNI, teléfono, datos del objeto y del incidente.
Respuesta: confirmación de carga.
8. Confirmación del Registro
Datos de entrada: número de reclamo.
Respuesta: cambio de estado del reclamo a "Registrado".
19. Carga de Cálculo
Datos de entrada: número de reclamo.
Respuesta: datos del objeto, propuestas de cálculo, valor estimado.
10. Envío del Cálculo
Datos de entrada: número de reclamo, monto acordado, notas adicionales.
Respuesta: confirmación del cálculo.
11. Consulta de Tareas para Liquidación
Datos de entrada: número de reclamo.
Respuesta: tareas de liquidación pendientes o completadas.
12. Asignación de Tarea de Liquidación
Datos de entrada: número de reclamo, usuario asignado.
Respuesta: confirmación de asignación.
13. Carga de Liquidación
Datos de entrada: monto final, cuenta destino, medio de pago.
Respuesta: confirmación de datos.
14. Envío de Liquidación
Datos de entrada: número de reclamo.
Respuesta: confirmación de pago y cierre del caso.
15. Consulta Final del Reclamo
Datos de entrada: número de reclamo.
Respuesta: estado final, comprobante de pago si aplica.
2