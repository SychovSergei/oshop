import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProductImage} from "../../../../shared/models/product";

@Component({
  selector: 'product-image-item',
  templateUrl: './product-image-item.component.html',
  styleUrls: ['./product-image-item.component.scss']
})
export class ProductImageItemComponent implements OnInit {
  @Input() image: ProductImage;
  @Input() isDeleted: boolean;
  @Output() deleteImageName = new EventEmitter<ProductImage>();
  @Output() restoreImageName = new EventEmitter<ProductImage>();

  constructor() { }

  ngOnInit(): void {
  }

  deleteImage() {
    this.deleteImageName.emit(this.image);
  }

  restoreImage() {
    this.restoreImageName.emit(this.image);
  }

}
