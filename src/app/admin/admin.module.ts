import { NgModule } from '@angular/core';
import {AdminProductsComponent} from "./components/admin-products/admin-products.component";
import {AdminOrdersComponent} from "./components/admin-orders/admin-orders.component";
import {ProductFormComponent} from "./components/product-form/product-form.component";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {AdminAuthGuard} from "./services/admin-auth.guard";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatButtonModule} from "@angular/material/button";
import {AdminRoutingModule} from "./admin-routing.module";
import {UploaderComponent} from "./components/product-form/uploader/uploader.component";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatListModule} from "@angular/material/list";
import {DropzoneDirective} from "./directives/dropzone.directive";
import {UploadTaskComponent} from "./components/product-form/upload-task/upload-task.component";
import {ProductImageItemComponent} from "./components/product-form/product-image-item/product-image-item.component";
import {FileSizePipe} from "./pipes/file-size.pipe";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

@NgModule({
  declarations: [
    AdminProductsComponent,
    AdminOrdersComponent,
    ProductFormComponent,
    UploaderComponent,
    DropzoneDirective,
    UploadTaskComponent,
    ProductImageItemComponent,
    FileSizePipe,
  ],
  imports: [
    AdminRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatProgressBarModule,
    MatListModule,
    DragDropModule,
    MatSlideToggleModule,
  ],
  exports: [
    AdminProductsComponent,
    AdminOrdersComponent,
    ProductFormComponent,
  ],
  providers: [
    AdminAuthGuard,
    FileSizePipe
  ]
})
export class AdminModule { }
