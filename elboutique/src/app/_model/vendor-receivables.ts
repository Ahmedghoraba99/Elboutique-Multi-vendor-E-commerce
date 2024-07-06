export interface VendorReceivables {
  message: string;
  data: {
    id: number;
    vendor_id: number;
    amount: number;
    created_at: string;
    updated_at: string;
  }|null;
  vendor_products:Products[]|[]
}

interface Products{
  sale:number,
  reviews:Reviews[]|[],
  reportProducts:Report[]|[]
}

interface Reviews {
  rate:number
}

interface Report{
  reason:string
}

