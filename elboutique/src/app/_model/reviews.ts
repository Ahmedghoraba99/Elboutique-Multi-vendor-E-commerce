export interface Customer {
  name: string;
  image_url: string;
}

export interface Review {
  id: number;
  rate: number;
  comment: string;
  customer: Customer;
  created_at: string;
  updated_at: string;
}

export interface ReviewResponse {
  data: Review[];
}

export interface AddReview{
  rate: number;
  comment: string;
  customer_id: number;
  product_id: number;
}
