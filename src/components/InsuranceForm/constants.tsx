import { BugIcon, Droplets, FlameKindling, MonitorX, ShieldAlert, UtilityPole } from "lucide-react";

export const TEXT_CONTENT = {
  subtitle: "Protect your device with comprehensive coverage",
  lossesTitle: "Losses Covered",
  quoteTitle: "Get a no-obligation quote",
  quoteDescription:
    "Make sure your valuable personal electronic devices are protected! Mishaps can happen at any time, Worth Ave. Group can protect your device against cracked screens, spills, theft and more!",
  disclaimer: "All fields are required to proceed with the quote.",
};

export const AVAILABLE_OPTIONS = {
  states: [
    { key: "Maine", label: "Maine" },
    { key: "California", label: "California" },
    { key: "New York", label: "New York" },
    { key: "Texas", label: "Texas" },
  ],
  deductibles: [
    { key: "$75", label: "$75" },
    { key: "$100", label: "$100" },
    { key: "$150", label: "$150" },
  ],
  policyTerms: [
    { key: "1 Year", label: "1 Year" },
    { key: "2 Year", label: "2 Year" },
    { key: "3 Year", label: "3 Year" },
  ],
  paymentOptions: [
    { key: "Annual One-Time", label: "Annual One-Time" },
    { key: "Monthly", label: "Monthly" },
    { key: "Quarterly", label: "Quarterly" },
  ],
};

export const SERVICES = [
  {
    key: "cracked_screens",
    label: "Cracked Screens",
    icon:  <MonitorX className="text-lg" />,
    color: "bg-primary/10 text-primary",
  },
  {
    key: "spills_liquid",
    label: "Spills & Liquid Submersion",
    icon: <Droplets className="text-lg" />,
    color: "bg-warning/10 text-warning",
  },
  {
    key: "accidental_damage",
    label: "Accidental Damage (Drops)",
    icon: <BugIcon className="text-lg" />,
    color: "bg-danger/10 text-danger",
  },
  {
    key: "theft_vandalism",
    label: "Theft & Vandalism",
    icon: <ShieldAlert className="text-lg" />,
    color: "bg-success/10 text-success",
  },
  {
    key: "natural_disasters",
    label: "Fire, Flood & Natural Disasters",
    icon: <FlameKindling className="text-lg" />,
    color: "bg-secondary/10 text-secondary",
  },
  {
    key: "power_surge",
    label: "Power Surge By Lightning",
    icon: <UtilityPole className="text-lg" />,
    color: "bg-default/50 text-foreground",
  },
];

// Dummy data para probar el formulario
export const DUMMY_DATA = {
  state: new Set(["California"]),
  coverageAmount: new Set(["1000"]),
  deductible: new Set(["$75"]),
  policyTerm: new Set(["1 Year"]),
  paymentOption: new Set(["Annual One-Time"]),
  manufacturer: "Apple",
  model: "iPhone 13 Pro",
  serialNumber: "IMEI3456789012345",
};