export interface Address {
  id: number;
  governorate: string;
  city: string;
  street: string;
  house_number: string | null;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  addresses: Address[];
  phones: Phone[];
  role: string,
  image_url:string
}
export interface Phone {
  id: number;
  customer_id: number;
  phoneNumper: string;
}

interface Data{
  id: number;
  name: string;
  email: string;
  phone: string | null;
  addresses: Address[];
  phones: Phone[];
  image:string
}
export interface ProfileUser{
  data: Data;
}
