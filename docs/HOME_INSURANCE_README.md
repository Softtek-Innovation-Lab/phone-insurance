# Módulo de Seguros de Hogar - Documentación

## Descripción General

El módulo de seguros de hogar permite a los usuarios solicitar cotizaciones y crear pólizas de seguros para sus propiedades. Se integra con la API de Insuremo para procesar las solicitudes.

## Características Implementadas

### 1. Producto de Seguro de Hogar
- **Categoría**: Home 🏠
- **Ubicación**: Sección de productos en la página principal
- **ProductCode**: `HOMEOWNER_MKT`
- **ProductId**: `906147921`

### 2. Formulario Multi-Paso

El formulario está dividido en 4 pasos:

#### Paso 1: Información de la Propiedad
- Tipo de hogar (casa unifamiliar, apartamento, villa, etc.)
- Tipo de construcción (concreto, madera, piedra, etc.)
- Año de construcción
- Área de construcción (m²)
- Área del terreno (m²)
- Número de pisos
- Número de habitaciones
- Valor de la propiedad (USD)
- Estimación de costo de reemplazo (USD)
- Uso de la vivienda (residencial, alquiler, almacenamiento, etc.)
- Número de ocupantes

#### Paso 2: Ubicación de la Propiedad
- Dirección línea 1
- Dirección línea 2 (opcional)
- Dirección completa
- Distrito
- Provincia
- Departamento
- Código postal
- Latitud (opcional)
- Longitud (opcional)

#### Paso 3: Seguridad y Características
- Sistema de alarma antirrobo
- Rejas de seguridad
- Cámaras de seguridad
- Alarma contra incendios
- Extintores (cantidad)
- Distancia a hidrante (metros)
- Distancia a estación de bomberos (km)
- Piscina
- Zona de inundación
- Valor de equipo electrónico (USD)
- Valor de joyas (USD)

#### Paso 4: Revisión
- Resumen de la información ingresada
- Confirmación antes de enviar

## Integración con API de Insuremo

### Endpoints Utilizados

1. **Login**: `POST /cas/v2/login`
   - Obtiene el código de intercambio (exchange_code)

2. **Token**: `POST /cas/oauth2.0/v2/consume`
   - Intercambia el exchange_code por access_token

3. **Crear Póliza**: `POST /api/softtek/api-orchestration/v1/flow/easypa_createOrSave`
   - Crea una nueva póliza de seguro de hogar

4. **Calcular Prima**: `POST /api/softtek/api-orchestration/v1/flow/easypa_calculate`
   - Calcula la prima del seguro

5. **Enlazar Póliza**: `POST /api/softtek/api-orchestration/v1/flow/easypa_bind`
   - Enlaza la póliza

6. **Emitir Póliza**: `POST /api/softtek/api-orchestration/v1/flow/easypa_issue`
   - Emite la póliza final

### Credenciales de API

Las credenciales se encuentran en `src/services/homeInsuranceService.ts`:
- **Usuario**: `softtek.api.test`
- **Tenant**: `softtek`
- **Entorno**: `kylin_dev` (sandbox)

## Archivos Creados

### Tipos
- `src/types/homeInsurance.ts` - Interfaces TypeScript para el módulo

### Servicios
- `src/services/homeInsuranceService.ts` - Lógica de integración con API

### Páginas
- `src/pages/home-insurance.tsx` - Formulario principal de solicitud

### Datos
- `src/data/products.ts` - Producto agregado con flag `isHomeInsurance: true`

### Assets
- `src/assets/products/home.webp` - Imagen del producto

## Flujo de Usuario

1. Usuario navega a la página principal
2. Filtra por categoría "Home" o busca "Home Insurance"
3. Hace clic en "Get Insurance" en el producto de seguros de hogar
4. Es redirigido a `/home-insurance`
5. Completa el formulario en 4 pasos
6. Revisa la información en el paso 4
7. Envía la solicitud
8. El sistema:
   - Autentica con la API de Insuremo
   - Mapea los datos del formulario al formato de la API
   - Crea la póliza
   - Muestra notificación de éxito/error
   - Redirige al perfil del usuario

## Formato de Datos de la API

### Valores Esperados

#### HOIsPropertyOccupied, HOPropertyInFloodZone, IsThereASwimmingPool, etc.
- `"1"` = Sí
- `"0"` = No

#### HOSecurityBars, HOSecurityCameras, HOFireExtinguishers, etc.
- `"Y"` = Sí
- `"N"` = No

#### HomeType
- `"Singlefamilyhome"` - Casa unifamiliar
- `"Multifamilyhome"` - Casa multifamiliar
- `"Villa"` - Villa
- `"Chalet"` - Chalet
- `"Apartment"` - Apartamento
- `"Mansion"` - Mansión

#### HOConstructionType
- `"Concrete"` - Concreto
- `"Wood"` - Madera
- `"Stone"` - Piedra
- `"ConcreteReinforced"` - Concreto reforzado
- `"Drywall"` - Drywall
- `"Prefabricated"` - Prefabricado

#### HODwellingUseTo
- `"Housing"` - Vivienda
- `"Rental"` - Alquiler
- `"Storage"` - Almacenamiento
- `"CommercialUse"` - Uso comercial
- `"OtherUse"` - Otro uso
- `"ANursingHome"` - Casa de retiro

## Configuración de Productos

```typescript
{
  ProductId: 906147921,
  ProductCode: 'HOMEOWNER_MKT',
  TechProductCode: 'HOME_STK',
  TechProductId: 906147910,
  ProductElementCode: 'HOMEOWNER_MKT',
  ProductElementId: 906147922,
  RiskElementCode: 'DWELLING_RISK',
  RiskElementId: 906624903,
  CoverageElementCode: 'HOUSENATURPHENOM_COV',
  CoverageElementId: 906624905,
  ProductVersion: '1.0',
}
```

## Descuentos de Campaña

Por defecto, se aplican dos descuentos:
1. Descuento tipo "01" con código "01": -10% (-0.1)
2. Descuento tipo "02" con código "03": 0%

## Mejoras Futuras

1. **Integración con Usuario Actual**
   - Usar datos reales del usuario autenticado en lugar de datos de prueba
   - Conectar con el perfil del usuario

2. **Cálculo Dinámico de Prima**
   - Implementar cálculo en tiempo real mientras el usuario completa el formulario
   - Mostrar estimación de precio antes de enviar

3. **Validaciones Avanzadas**
   - Validación de direcciones con servicios de geolocalización
   - Validación de valores de propiedad según ubicación

4. **Gestión de Pólizas**
   - Ver pólizas de hogar en el perfil
   - Renovar pólizas existentes
   - Modificar coberturas

5. **Imágenes de Propiedad**
   - Permitir subir fotos de la propiedad
   - Documentación de características de seguridad

6. **Comparación de Coberturas**
   - Mostrar diferentes opciones de cobertura
   - Comparar precios y beneficios

## Testing

Para probar el módulo:

```bash
# Iniciar el servidor de desarrollo
npm run dev

# Navegar a http://localhost:3000
# Hacer clic en la categoría "Home"
# Seleccionar "Home Insurance"
# Completar el formulario de 4 pasos
```

### Datos de Prueba

Puedes usar estos valores de ejemplo:
- **Tipo de hogar**: Single Family Home
- **Tipo de construcción**: Concrete
- **Año**: 2020-01-01
- **Área de construcción**: 200 m²
- **Área del terreno**: 500 m²
- **Valor**: $100,000
- **Dirección**: Cualquier dirección válida
- **Distrito**: LIM
- **Provincia**: LIM
- **Departamento**: PER

## Soporte

Para problemas o preguntas sobre este módulo, contactar al equipo de desarrollo.

## Notas Importantes

⚠️ **Credenciales de API**: Las credenciales actuales son para el entorno sandbox. Para producción, actualizar las credenciales en `homeInsuranceService.ts`.

⚠️ **CORS**: Si experimentas problemas de CORS, asegúrate de que el servidor permita solicitudes desde tu dominio.

⚠️ **Autenticación**: El token de acceso tiene una duración limitada. El servicio autentica automáticamente en cada solicitud.
