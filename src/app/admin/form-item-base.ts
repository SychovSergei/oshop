// import {CategoryGroup, Valids} from "../shared/models/category.model";
//
// export class FormItemBase<T> {
//   value: T | undefined;
//   key: string;
//   label: string;
//   order: number;
//   controlType: string;
//   type: string;
//   checked: boolean;//////
//   options: CategoryGroup[];
//   validators: Valids[];
//
//   constructor(options: {
//     value?: T | undefined;
//     key?: string;
//     label?: string;
//     order?: number;
//     controlType?: string;
//     type?: string;
//     checked?: boolean;
//     options?: CategoryGroup[];
//     validators?: Valids[];
//   } = {} ) {
//     this.value = options.value;
//     this.key = options.key || '';
//     this.label = options.label || '';
//     this.order = options.order === undefined ? 1 : options.order;
//     this.controlType = options.controlType || '';
//     this.type = options.type || '';
//     this.checked = options.checked || false;
//     this.options = options.options || [];
//     this.validators = options.validators || [];
//   }
// }
