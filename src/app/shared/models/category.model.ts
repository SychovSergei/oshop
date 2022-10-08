export interface CategoryGroup {
  categories: Category[];
  name: string;
  disabled?: boolean;
}
export interface Category {
  value: string;
  viewValue: string;
}

export interface Valids {
  name: string;
  value?: any;
  errorMessage: string;
}
