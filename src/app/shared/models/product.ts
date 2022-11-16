import {FormGroup} from "@angular/forms";

export class Product<T> {
  key?: string;
  dateCreated: number;
  dateModify: number;
  description: string;
  discount: number;
  available: boolean;
  quantity: number;
  title: string;
  price: number;
  category: string;
  images: ProductImage[];
  creatorId: string;
  details: T;
}

export interface ProductImage {
  key?: string;
  fileName: string;
  size: number;
  lastModified: number;
  type: string;
  url: string;
}

export class NotebookItem {
  screen_diagonal: string;
  screen_type: string;
  processor_cpu: string;
}
export class ComputerItem {
  screen_diagonal: string;
}

export type ProductTypeUnion =
  Product<NotebookItem> |
  Product<ComputerItem>



export abstract class AbstractProdItemDetail {
  public childForm: FormGroup;
}

export interface ContentType {
  id: string;
  label: string;
}
