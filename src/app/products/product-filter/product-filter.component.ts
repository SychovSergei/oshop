import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {CategoryList, CategoryService} from "../../category.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit {
  @Input('category') category: string;
  categories$: Observable<CategoryList[]>;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
  ) {
      this.categories$ = categoryService.getAll();
  }

  ngOnInit(): void {
  }

}
