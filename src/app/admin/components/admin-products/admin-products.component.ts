import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ProductService} from "../../../shared/services/product.service";
import {Product} from "../../../shared/models/product";
import {Subscription} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort, Sort} from "@angular/material/sort";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {Router} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DialogBoxComponent} from "../../../shared/components/dialog-box/dialog-box.component";

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  products: MatTableDataSource<Product>;
  displayedColumns: string[] = ['title', 'isActive', 'category', 'price', 'mainImage', 'action'];
  searchValue: string;
  subProducts: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private productService: ProductService,
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.subProducts = this.productService.getAll()
      .subscribe((products) => {
        this.products = new MatTableDataSource<Product>(products);
        this.products.paginator = this.paginator;
        this.products.sort = this.sort;
        this.products.filterPredicate = function (record,filter) {
          return record.title.toLocaleLowerCase().includes(filter.toLocaleLowerCase());
        }
      });
  }

  ngOnDestroy(): void {
    this.subProducts.unsubscribe();
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.width = '500px';
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(DialogBoxComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.createNewProduct(result.category);
    });
  }

  applyFilter(event: KeyboardEvent) {
    this.searchValue = (event.target as HTMLInputElement).value;
    this.products.filter = this.searchValue;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  createNewProduct(category: string) {
    // console.log('createNewProduct', category);
    this.productService.createEmptyProduct(category)
      .then((prodId) => {
        // console.log('prodId', prodId);
        this.router.navigate([`/admin/products/${prodId.key}`])
      })

        // this.router.navigate(['/admin/products/new'])
  }
}
