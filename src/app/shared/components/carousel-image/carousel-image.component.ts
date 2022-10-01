import {Component, Input, OnInit} from '@angular/core';
import {ProductImage} from "../../models/product";

@Component({
  selector: 'carousel-image',
  templateUrl: './carousel-image.component.html',
  styleUrls: ['./carousel-image.component.scss']
})
export class CarouselImageComponent implements OnInit {
  @Input()  images: ProductImage[];
  @Input()  id: string;

  constructor() { }

  ngOnInit(): void {
  }

}
