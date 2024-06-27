export interface Customer {
  name: string;
  image_url: string;
}

export interface Product{
  id:number,
  name:string,
  description:string,
  image_url:string,
  price:number
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
  customer_id: number|null;
  product_id: number;
}

export interface AllReviews{
  id:number,
  rate: number;
  comment: string;
  customer:Customer,
  product: Product,
  created_at: string,
  updated_at: string
}
