export interface Product {
  key: string;
  dateCreated: number;
  isActive: boolean;
  title: string;
  price: number;
  category: string;
  images: ProductImage[];
}

export interface ProductNew {
  key: string;
  category: string;
  characteristics: {
    diagonal: string;
    screen_refresh_rate: number;
    screen_resolution: string;
    type_screen: string;
  };
  dateCreated: number;
  isActive: boolean;
  price: number;
  title: string;
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
