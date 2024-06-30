

export interface Category {
  id: number,
  name: string
}

export interface Image{
  image_url:string
}

export interface Attributes{
  name:string,
  value:string
}

export interface Tages{
  id:number,
  name:string,
}

export interface Product{
  id: number,
  name: string,
  description: string,
  price: number,
  stock: number,
  sale:number
  category: Category
  images: Image[],
  attributes:Attributes[],
  tages:Tages[]
}


