export interface VendorReceivables {
  message: string;
  data: {
    id: number;
    vendor_id: number;
    amount: number;
    created_at: string;
    updated_at: string;
  }|null;
}




