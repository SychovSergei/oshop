export interface Product {
  key?: string;
  dateCreated: number;
  description: string;
  discount: number;
  available: boolean;
  quantity: number;
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

export interface Notebooks extends Product{
  characteristics: {
    screen: {
      diagonal: string;
      type: string;
      refresh_rate: number;
      resolution: string;
      integrated_camera: string;
    },
    processor: {
      cpu: string;
      operating_system: number;
      generation: string;
    },
    ram: {
      type: string;
      slots_number: number;
      volume: string;
    },
    data_drivers: {
      ssd_capacity: string;
    }
  };
}
