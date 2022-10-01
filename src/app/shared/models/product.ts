export interface Product {
  key: string;
  dateCreated: number;
  isActive: boolean;
  title: string;
  price: number;
  category: string;
  images: ProductImage[];
}

export interface ProductImage {
  key?: string;
  fileName: string;
  size: number;
  lastModified: number;
  type: string;
  url: string;
}
