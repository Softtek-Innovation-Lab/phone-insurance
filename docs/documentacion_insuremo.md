PASO A PASO


- Siniestros

Hay siniestro, busco la póliza del producto.
Crear el FNOL, registrar el siniestro, completando todos los datos.

Luego el departamento de siniestros lo que hace es demostrar q la persona
perdió el producto. Por ejemplo se lo robaron. Todo el proceso se realiza
desde la pagina de InsureMo, excepto, la creación del FNOL y Registración
del siniestro.

1. El asesor de seguros (o esa, el usuario softtek_callcenterop) carga
la información de subclaim y datos de claim reserve, con esto el siniestro
(internamente se lo denomina una task) pasa a estado de Investigación

2. Otro asesor de seguros (o sea, el usuario softtek_serviceprovider) se
encarga de evaluar la información brindada por el cliente, y cargar todos
los datos en la pestaña Investigation Information dentro de la pestaña
Sub-Claim Information, con esto la task pasa a estado Appraisal.

3. Otro asesor de seguros (o sea , el usuario softtek_operation) se encarga
de revisar las reservas para el pago, solicitar información faltante,
calcular el pago al cliente y solicitar la aprobación de ese calculo. Si el
calculo es aceptado, la task pasa al estado de Settlement.

4. Otro asesor de seguros (o sea, el usuario softtek_operationsmanager), quien
aprobó el calculo, se encarga de completar la información de deposito para el
cobro del seguro. Con esto la task pasa a Settlement Approval y una vez
confirmado el deposito en la cuenta del cliente pasa a estado Close.

(el proceso de siniestro tarda una semana desde que se creo fnol)


- Polizas equipo electronico

Pide el producto, una noteobook por ejemplo, completa
el formulario, va al carrito y realiza el pago y genera una nueva
póliza.
En el caso de estos productos el valor ya esta calculado.


- Poliza hogar

Completa los datos del formulario y crear una numero de transacción de
póliza. (créate or save API)

Según las características del la información para el seguro, se calcula
la prima. (calculate API)

Si el cliente acepta los precios de la prima se procede a aceptar la venta
del seguro (bind API)

Emisión de póliza con el numero correspondiente (issue API)