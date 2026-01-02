// Tipos para seguro de hogar basados en la API de Insuremo

export interface HomeInsuranceFormData {
  // Datos de la Propiedad
  homeType: string; // Singlefamilyhome/Multifamilyhome/Villa/Chalet/Apartment/Mansion
  yearConstruction: string;
  constructionType: string; // Concrete/Wood/Stone/ConcreteReinforced/Drywall/Prefabricated
  buildingArea: number; // metros cuadrados
  landArea: number; // metros cuadrados
  numberOfFloors: number;
  numberOfRooms: number;
  totalPrice: number; // valor de la propiedad
  rce: number; // Replacement Cost Estimate
  
  // Uso de la Propiedad
  isPropertyOccupied: string; // "1" = Yes, "0" = No
  dwellingUseTo: string; // Storage/OtherUse/Housing/Rental/CommercialUse/ANursingHome
  howManyLiveProperty: number;
  haveGarage: string; // "Y" = Yes, "N" = No
  
  // Ubicación
  address1: string;
  address2?: string;
  address3?: string;
  fullAddress: string;
  district: string;
  province: string;
  department: string;
  country: string;
  postalCode: string;
  longitude?: string;
  latitude?: string;
  
  // Riesgos
  propertyInFloodZone: string; // "1" = Yes, "0" = No
  
  // Seguridad
  antiTheftAlarm: string; // "1" = Yes, "0" = No
  securityBars: string; // "Y" = Yes, "N" = No
  securityCameras: string; // "Y" = Yes, "N" = No
  fireExtinguishers: string; // "Y" = Yes, "N" = No
  manyFireExtinguishers?: number;
  haveFireAlarm: string; // "1" = Yes, "0" = No
  sprinkler: string; // "Y" = Yes, "N" = No
  doorsLocks: string; // "Y" = Yes, "N" = No
  safe: string; // "Y" = Yes, "N" = No
  animals: string; // "1" = Yes, "0" = No
  
  // Distancias
  distanceFireHydrant: number; // en metros
  distanceFireStation: string; // en km
  
  // Piscina
  thereIsSwimmingPool: string; // "1" = Yes, "0" = No
  poolHaveRailing?: string; // "1" = Yes, "0" = No
  poolHaveDivingBoard?: string; // "1" = Yes, "0" = No
  
  // Bienes
  electronicEquipment: number;
  jewelry: number;
}

export interface HomeInsuranceAPIPayload {
  EffectiveDate: string;
  ExpiryDate: string;
  PremiumCurrencyCode: string;
  BookCurrencyCode: string;
  PremiumBookExchangeRate: number;
  PolicyCustomerList: PolicyCustomer[];
  PolicyLobList: PolicyLob[];
  PolicyPaymentInfoList: PolicyPaymentInfo[];
  ProposalStatus: string;
  PolicyType: string;
  ProductId: number;
  ProductVersion: string;
  ProductCode: string;
  CampaignDiscountList: CampaignDiscount[];
  ProposalDate: string;
  OrgCode: string;
  AgentCode: string;
  PolicyAgentList: any[];
  LocalCurrencyCode: string;
  PremiumLocalExchangeRate: number;
}

export interface PolicyCustomer {
  CustomerName: string;
  DateOfBirth: string;
  IdType: string;
  IdNo: string;
  City: string;
  State: string;
  Mobile: string;
  Email: string;
  PostCode: string;
  Address: string;
  AddressComplement: string;
  Gender: string;
  CustomerType: string;
  IsPolicyHolder: string;
  IsPep: string;
  MonthlyIncome: string;
  ConsentData: string;
  ConsentEmail: string;
  TipoGrupo: string;
}

export interface PolicyLob {
  PolicyRiskList: PolicyRisk[];
  ProductId: number;
  ProductCode: string;
  ProductElementCode: string;
  TechProductCode: string;
  TechProductId: number;
  VersionSeq: number;
  PolicyFormList: any[];
}

export interface PolicyRisk {
  HOIsPropertyOccupied: string;
  HODwellingUseTo: string;
  HOHowManyLiveProperty: number;
  HONumberFloors: number;
  HOPropertyInFloodZone: string;
  HomeType: string;
  HOYearConstruction: string;
  HOConstructionType: string;
  BuildingArea: number;
  HOLandArea: number;
  HORCE: number;
  HONumberRooms: number;
  HODistanceFireHydrant: number;
  HODistanceFireStation: string;
  HOHaveGarage: string;
  IsThereASwimmingPool: string;
  HOPoolHaveARailing: string;
  HOPoolHaveADivingBoard: string;
  TotalPrice: number;
  HOAntiTheftAlarm: string;
  HOSecurityBars: string;
  HOSecurityCameras: string;
  HOFireExtinguishers: string;
  HOManyFireExtinguishers: number;
  HOHaveFireAlarm: string;
  HOSprinkler: string;
  HODoorsLocks: string;
  HOSafe: string;
  HOAnimals: string;
  HOElectronicEquipment: number;
  HOJewelry: number;
  Address1: string;
  Address2: string;
  Address3: string;
  FullAddress: string;
  District: string;
  Province: string;
  Department: string;
  Country: string;
  Longitude: string;
  Latitude: string;
  PostalCode: string;
  ProductElementCode: string;
  ProductElementId: number;
  RiskName: string;
  VersionSeq: number;
  PolicyCoverageList: PolicyCoverage[];
}

export interface PolicyCoverage {
  ProductElementCode: string;
  CoverageName: string;
  SumInsured: number;
}

export interface PolicyPaymentInfo {
  PayModeCode: number;
  IsInstallment: string;
  InstallmentType: string;
  BillingType: string;
}

export interface CampaignDiscount {
  DiscountType: string;
  DiscountCode: string;
  Percentage: number;
  Comments: string;
}

export interface InsuremoAuthResponse {
  data: {
    exchange_code: string;
  };
}

export interface InsuremoTokenResponse {
  data: {
    access_token: string;
  };
}

export interface HomeInsuranceQuoteResponse {
  success: boolean;
  data?: any;
  error?: string;
  policyId?: string;
  totalPremium?: number;
}
