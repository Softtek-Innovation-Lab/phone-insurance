ESTE FETCH NO ANDA

fetch("https://softtek-sandbox-am.insuremo.com/api/softtek/api-orchestration/v1/flow/easypa_createOrSave", {
  method: "POST",
  mode: "cors",
  credentials: "omit",
  headers: {
    accept: "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9,es;q=0.8",
    authorization: "Bearer q86un7eJTUOP8krLvhBMaQ",
    "content-type": "application/json",
    priority: "u=1, i",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "x-ebao-tenant-code": "softtek"
  },
  referrer: "http://localhost:5173/",
  body: JSON.stringify({
    BusinessCateCode: "1",
    EffectiveDate: "2025-04-25",
    ExpiryDate: "2026-04-24T23:59:59",
    OrgCode: "softtek",
    POIRate: 1,
    PolicyCustomerList: [
      {
        CustomerName: "Michael Thompson",
        DateOfBirth: "1985-08-15",
        GenderCode: "M",
        IdNo: "A123456789",
        IdType: "DriverLicense",
        IsInsured: "N",
        IsOrgParty: "N",
        IsPolicyHolder: "Y",
        VersionSeq: 1,
        TempData: {
          "Mask-IdNo": "Hy4eAmtfvwRJLr3TzyvcZA==",
          "MaskAfter-IdNo": "123456789"
        }
      }
    ],
    PolicyLobList: [
      {
        PolicyRiskList: [
          {
            PolicyCoverageList: [
              {
                PolicyLimitDeductibleList: [
                  {
                    LimitDeductibleValue: 1300,
                    ProductElementCode: "PROP_FULL_DAMAGE_LIM",
                    ProductElementId: 789611476
                  }
                ],
                ProductElementCode: "TRAV_PROP_COV",
                SumInsured: 1300,
                VersionSeq: 1
              }
            ],
            ProductElementCode: "TRAV_PROP_RISK",
            ProductElementId: 789611472,
            RiskName: "ProductElement",
            VersionSeq: 1,
            PredefinedPremium: 70
          },
          {
            PolicyCoverageList: [
              {
                PolicyLimitDeductibleList: [
                  {
                    LimitDeductibleValue: 1300,
                    ProductElementCode: "PROP_FULL_DAMAGE_LIM",
                    ProductElementId: 789611476
                  }
                ],
                ProductElementCode: "TRAV_PROP_COV",
                SumInsured: 1300,
                VersionSeq: 1
              }
            ],
            ProductElementCode: "TRAV_PROP_RISK",
            ProductElementId: 789611472,
            RiskName: "ProductElement",
            VersionSeq: 1,
            PredefinedPremium: 70
          },
          {
            PolicyCoverageList: [
              {
                PolicyLimitDeductibleList: [
                  {
                    LimitDeductibleValue: 1300,
                    ProductElementCode: "PROP_FULL_DAMAGE_LIM",
                    ProductElementId: 789611476
                  }
                ],
                ProductElementCode: "TRAV_PROP_COV",
                SumInsured: 1300,
                VersionSeq: 1
              }
            ],
            ProductElementCode: "TRAV_PROP_RISK",
            ProductElementId: 789611472,
            RiskName: "ProductElement",
            VersionSeq: 1,
            PredefinedPremium: 70
          }
        ],
        ProductCode: "TRAV_PROP_MKT",
        ProductElementCode: "TRAV_PROP_MKT",
        ProductId: 789725307,
        TechProductCode: "TRAV_PROP_TEC",
        TechProductId: 789317612,
        VersionSeq: 1
      }
    ],
    ProductCode: "TRAV_PROP_MKT",
    ProductId: 789725307,
    ProductVersion: "1.0",
    ProposalDate: "2025-04-24",
    TechProductCode: "TRAV_PROP_TEC",
    TechProductId: 789317612,
    VersionSeq: 1
  })
});


//error:

// {
//   "timestamp": "2025-08-04T11:05:31",
//     "timestampServer": "2025-08-04T14:05:31",
//       "traceId": "72483cd55b3fd30c795d3df9c720c6be",
//         "code": "MO-PLATFORM-COMMON-E9998",
//           "message": "Internal Server Error, Trace id: 72483cd55b3fd30c795d3df9c720c6be"
// }