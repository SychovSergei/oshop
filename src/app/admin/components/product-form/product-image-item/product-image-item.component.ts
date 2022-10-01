import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProductImage} from "../../../../shared/models/product";

@Component({
  selector: 'product-image-item',
  templateUrl: './product-image-item.component.html',
  styleUrls: ['./product-image-item.component.scss']
})
export class ProductImageItemComponent implements OnInit {
  @Input() image: ProductImage;
  @Output() deleteImageName = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  deleteImage(imageName: string) {
    this.deleteImageName.emit(this.image.fileName);
  }

}
