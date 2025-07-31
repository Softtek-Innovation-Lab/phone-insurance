import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  dateOfBirth: string;
  gender: string;
  idNumber: string;
  idType: string;
  avatar: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
