import type {
  HomeInsuranceFormData,
  HomeInsuranceAPIPayload,
  InsuremoAuthResponse,
  InsuremoTokenResponse,
  HomeInsuranceQuoteResponse,
} from '@/types/homeInsurance';

const INSUREMO_BASE_URL = 'https://sandbox-am.insuremo.com';
const INSUREMO_API_BASE_URL = 'https://softtek-sandbox-am.insuremo.com/api/softtek';
const TENANT_CODE = 'softtek';
const ORG_CODE = 'softtek';
const AGENT_CODE = 'PTY10000095006013';

// Credenciales de API
const API_USERNAME = 'softtek.api.test';
const API_ENCRYPTED_PASSWORD = '*mo_encrypted_rsa*w77o4Zh20gt3N0MwcLOoWqTX8U3buR+P0r0IbuTQ4dRyl49hZpbvKhEpX/L1Cx99nlA+UN8zuwiQSfabt5ZC0NsuiS+hjpgiJ0VKs4iyMoruVn6ZXrDnyhnzNs+3NZBVgm3coHZMs3cSe+vTpxY8c90MYiYBQw01FSnlm+EkIkVynPS/Y+Q3AqidjvHMk/ZT0h+tmeP/DE1W5hyrta5x31xhS3bOyozGBCdIKXPeF632/8DRn4io7dXwLWmnOuXyzhVDArY9jtNQvHTEzDRr/7CsKKezkh9vg7ye4DrifkKvh/vdqptIKV2QEn+agzSs9lS2wUdYA13swYK+71aykg==';

// IDs de productos para seguros de hogar
const HOME_INSURANCE_PRODUCT = {
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
};

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
 */
async function authenticate(): Promise<string> {
  const exchangeCode = await login();
  const accessToken = await getAccessToken(exchangeCode);
  return accessToken;
}

/**
 * Convertir datos del formulario al formato de la API
 */
function mapFormDataToAPIPayload(
  formData: HomeInsuranceFormData,
  customerData: any
): HomeInsuranceAPIPayload {
  const today = new Date();
  const effectiveDate = today.toISOString().split('T')[0];
  const expiryDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate() - 1);
  const expiryDateStr = `${expiryDate.toISOString().split('T')[0]}T23:59:59`;

  return {
    EffectiveDate: `${effectiveDate}T00:00:00`,
    ExpiryDate: expiryDateStr,
    PremiumCurrencyCode: 'USD',
    BookCurrencyCode: 'USD',
    PremiumBookExchangeRate: 1,
    PolicyCustomerList: [
      {
        CustomerName: customerData.name || '',
        DateOfBirth: customerData.dateOfBirth || new Date().toISOString(),
        IdType: customerData.idType || '1',
        IdNo: customerData.idNumber || '',
        City: customerData.city || '',
        State: customerData.state || '',
        Mobile: customerData.phone || '',
        Email: customerData.email || '',
        PostCode: customerData.zipCode || '',
        Address: customerData.address || '',
        AddressComplement: '',
        Gender: customerData.gender || 'M',
        CustomerType: 'IndiCustomer',
        IsPolicyHolder: 'Y',
        IsPep: '',
        MonthlyIncome: '',
        ConsentData: '',
        ConsentEmail: '',
        TipoGrupo: '',
      },
    ],
    PolicyLobList: [
      {
        PolicyRiskList: [
          {
            HOIsPropertyOccupied: formData.isPropertyOccupied,
            HODwellingUseTo: formData.dwellingUseTo,
            HOHowManyLiveProperty: formData.howManyLiveProperty,
            HONumberFloors: formData.numberOfFloors,
            HOPropertyInFloodZone: formData.propertyInFloodZone,
            HomeType: formData.homeType,
            HOYearConstruction: `${formData.yearConstruction}T00:00:00`,
            HOConstructionType: formData.constructionType,
            BuildingArea: formData.buildingArea,
            HOLandArea: formData.landArea,
            HORCE: formData.rce,
            HONumberRooms: formData.numberOfRooms,
            HODistanceFireHydrant: formData.distanceFireHydrant,
            HODistanceFireStation: formData.distanceFireStation,
            HOHaveGarage: formData.haveGarage,
            IsThereASwimmingPool: formData.thereIsSwimmingPool,
            HOPoolHaveARailing: formData.poolHaveRailing || '0',
            HOPoolHaveADivingBoard: formData.poolHaveDivingBoard || '0',
            TotalPrice: formData.totalPrice,
            HOAntiTheftAlarm: formData.antiTheftAlarm,
            HOSecurityBars: formData.securityBars,
            HOSecurityCameras: formData.securityCameras,
            HOFireExtinguishers: formData.fireExtinguishers,
            HOManyFireExtinguishers: formData.manyFireExtinguishers || 0,
            HOHaveFireAlarm: formData.haveFireAlarm,
            HOSprinkler: formData.sprinkler,
            HODoorsLocks: formData.doorsLocks,
            HOSafe: formData.safe,
            HOAnimals: formData.animals,
            HOElectronicEquipment: formData.electronicEquipment,
            HOJewelry: formData.jewelry,
            Address1: formData.address1,
            Address2: formData.address2 || '',
            Address3: formData.address3 || '',
            FullAddress: formData.fullAddress,
            District: formData.district,
            Province: formData.province,
            Department: formData.department,
            Country: formData.country,
            Longitude: formData.longitude || '',
            Latitude: formData.latitude || '',
            PostalCode: formData.postalCode,
            ProductElementCode: HOME_INSURANCE_PRODUCT.RiskElementCode,
            ProductElementId: HOME_INSURANCE_PRODUCT.RiskElementId,
            RiskName: 'ProductElement',
            VersionSeq: 1,
            PolicyCoverageList: [
              {
                ProductElementCode: HOME_INSURANCE_PRODUCT.CoverageElementCode,
                CoverageName: 'Fenómenos Naturales',
                SumInsured: formData.totalPrice,
              },
            ],
          },
        ],
        ProductId: HOME_INSURANCE_PRODUCT.ProductId,
        ProductCode: HOME_INSURANCE_PRODUCT.ProductCode,
        ProductElementCode: HOME_INSURANCE_PRODUCT.ProductElementCode,
        TechProductCode: HOME_INSURANCE_PRODUCT.TechProductCode,
        TechProductId: HOME_INSURANCE_PRODUCT.TechProductId,
        VersionSeq: 1,
        PolicyFormList: [],
      },
    ],
    PolicyPaymentInfoList: [
      {
        PayModeCode: 100,
        IsInstallment: 'N',
        InstallmentType: '10',
        BillingType: '1',
      },
    ],
    ProposalStatus: '1',
    PolicyType: '1',
    ProductId: HOME_INSURANCE_PRODUCT.ProductId,
    ProductVersion: HOME_INSURANCE_PRODUCT.ProductVersion,
    ProductCode: HOME_INSURANCE_PRODUCT.ProductCode,
    CampaignDiscountList: [
      {
        DiscountType: '01',
        DiscountCode: '01',
        Percentage: -0.1,
        Comments: '',
      },
      {
        DiscountType: '02',
        DiscountCode: '03',
        Percentage: 0,
        Comments: '',
      },
    ],
    ProposalDate: `${effectiveDate}T00:00:00`,
    OrgCode: ORG_CODE,
    AgentCode: AGENT_CODE,
    PolicyAgentList: [],
    LocalCurrencyCode: 'USD',
    PremiumLocalExchangeRate: 1,
  };
}

/**
 * Crear o guardar una póliza de seguro de hogar
 */
export async function createHomeInsurancePolicy(
  formData: HomeInsuranceFormData,
  customerData: any
): Promise<HomeInsuranceQuoteResponse> {
  try {
    // Autenticar
    const accessToken = await authenticate();

    // Mapear datos
    const payload = mapFormDataToAPIPayload(formData, customerData);

    // Crear póliza
    const response = await fetch(
      `${INSUREMO_API_BASE_URL}/api-orchestration/v1/flow/easypa_createOrSave`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
          'authorization': `Bearer ${accessToken}`,
          'x-mo-tenant-id': TENANT_CODE,
          'x-mo-env': 'kylin_dev',
          'response-type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error creando póliza:', errorText);
      throw new Error('Error creando póliza de seguro de hogar');
    }

    const data = await response.json();

    return {
      success: true,
      data,
      policyId: data.PolicyId || data.ProposalNo,
    };
  } catch (error) {
    console.error('Error en createHomeInsurancePolicy:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Calcular prima de seguro de hogar
 */
export async function calculateHomeInsurancePremium(
  policyData: any
): Promise<HomeInsuranceQuoteResponse> {
  try {
    const accessToken = await authenticate();

    const response = await fetch(
      `${INSUREMO_API_BASE_URL}/api-orchestration/v1/flow/easypa_calculate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'authorization': `Bearer ${accessToken}`,
          'x-mo-tenant-id': TENANT_CODE,
          'x-mo-env': 'kylin_dev',
        },
        body: JSON.stringify(policyData),
      }
    );

    if (!response.ok) {
      throw new Error('Error calculando prima');
    }

    const data = await response.json();

    return {
      success: true,
      data,
      totalPremium: data.TotalPremium,
    };
  } catch (error) {
    console.error('Error en calculateHomeInsurancePremium:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Enlazar póliza (bind)
 */
export async function bindHomeInsurancePolicy(
  policyData: any
): Promise<HomeInsuranceQuoteResponse> {
  try {
    const accessToken = await authenticate();

    const response = await fetch(
      `${INSUREMO_API_BASE_URL}/api-orchestration/v1/flow/easypa_bind`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
          'authorization': `Bearer ${accessToken}`,
          'x-mo-tenant-id': TENANT_CODE,
          'x-mo-env': 'kylin_dev',
          'response-type': 'application/json',
        },
        body: JSON.stringify(policyData),
      }
    );

    if (!response.ok) {
      throw new Error('Error enlazando póliza');
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error en bindHomeInsurancePolicy:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Emitir póliza (issue)
 */
export async function issueHomeInsurancePolicy(
  policyData: any
): Promise<HomeInsuranceQuoteResponse> {
  try {
    const accessToken = await authenticate();

    const response = await fetch(
      `${INSUREMO_API_BASE_URL}/api-orchestration/v1/flow/easypa_issue`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
          'authorization': `Bearer ${accessToken}`,
          'x-mo-tenant-id': TENANT_CODE,
          'x-mo-env': 'kylin_dev',
          'response-type': 'application/json',
        },
        body: JSON.stringify(policyData),
      }
    );

    if (!response.ok) {
      throw new Error('Error emitiendo póliza');
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error en issueHomeInsurancePolicy:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}
