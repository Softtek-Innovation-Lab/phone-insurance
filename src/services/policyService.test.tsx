import { renderHook } from '@testing-library/react';
import { usePolicyService } from './policyService';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import React from 'react';

// Mock Redux store
const mockStore = configureStore([]);
const store = mockStore({
    auth: {
        accessToken: 'MbMlKH7IRwelv8NP_6P1WQ',
    },
});

// Mock fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
    })
) as jest.Mock;

describe('usePolicyService', () => {
    it('should call createOrSavePolicy with the correct payload', async () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;
        const { result } = renderHook(() => usePolicyService(), { wrapper });

        const policyData = {
            BusinessCateCode: "1",
            EffectiveDate: "2025-04-25",
            ExpiryDate: "2026-04-24T23:59:59",
            OrgCode: "softtek",
            POIRate: 1,
            PolicyCustomerList: [{
                CustomerName: "Richard Vives",
                DateOfBirth: "1975-04-21",
                GenderCode: "M",
                IdNo: "123456789",
                IdType: "1",
                IsInsured: "N",
                IsOrgParty: "N",
                IsPolicyHolder: "Y",
                VersionSeq: 1,
                TempData: {
                    "Mask-IdNo": "Hy4eAmtfvwRJLr3TzyvcZA==",
                    "MaskAfter-IdNo": "123456789"
                }
            }],
            PolicyLobList: [{
                PolicyRiskList: [{
                    PolicyCoverageList: [{
                        PolicyLimitDeductibleList: [{
                            LimitDeductibleValue: 1300,
                            ProductElementCode: "PROP_FULL_DAMAGE_LIM",
                            ProductElementId: 789611476
                        }],
                        ProductElementCode: "TRAV_PROP_COV",
                        SumInsured: 1300,
                        VersionSeq: 1
                    }],
                    ProductElementCode: "TRAV_PROP_RISK",
                    ProductElementId: 789611472,
                    RiskName: "ProductElement",
                    VersionSeq: 1,
                    PredefinedPremium: 70
                }, {
                    PolicyCoverageList: [{
                        PolicyLimitDeductibleList: [{
                            LimitDeductibleValue: 1300,
                            ProductElementCode: "PROP_FULL_DAMAGE_LIM",
                            ProductElementId: 789611476
                        }],
                        ProductElementCode: "TRAV_PROP_COV",
                        SumInsured: 1300,
                        VersionSeq: 1
                    }],
                    ProductElementCode: "TRAV_PROP_RISK",
                    ProductElementId: 789611472,
                    RiskName: "ProductElement",
                    VersionSeq: 1,
                    PredefinedPremium: 70
                }, {
                    PolicyCoverageList: [{
                        PolicyLimitDeductibleList: [{
                            LimitDeductibleValue: 1300,
                            ProductElementCode: "PROP_FULL_DAMAGE_LIM",
                            ProductElementId: 789611476
                        }],
                        ProductElementCode: "TRAV_PROP_COV",
                        SumInsured: 1300,
                        VersionSeq: 1
                    }],
                    ProductElementCode: "TRAV_PROP_RISK",
                    ProductElementId: 789611472,
                    RiskName: "ProductElement",
                    VersionSeq: 1,
                    PredefinedPremium: 70
                }],
                ProductCode: "TRAV_PROP_MKT",
                ProductElementCode: "TRAV_PROP_MKT",
                ProductId: 789725307,
                TechProductCode: "TRAV_PROP_TEC",
                TechProductId: 789317612,
                VersionSeq: 1
            }],
            ProductCode: "TRAV_PROP_MKT",
            ProductId: 789725307,
            ProductVersion: "1.0",
            ProposalDate: "2025-04-24",
            TechProductCode: "TRAV_PROP_TEC",
            TechProductId: 789317612,
            VersionSeq: 1
        };

        await result.current.createOrSavePolicy(policyData);

        expect(fetch).toHaveBeenCalledWith(
            "https://softtek-sandbox-am.insuremo.com/api/softtek/api-orchestration/v1/flow/easypa_createOrSave",
            {
                method: "POST",
                headers: {
                    "accept": "application/json, text/plain, */*",
                    "authorization": "Bearer MbMlKH7IRwelv8NP_6P1WQ",
                    "content-type": "application/json",
                    "x-ebao-tenant-id": "softtek"
                },
                body: JSON.stringify(policyData),
            }
        );
    });
});
