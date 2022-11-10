import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProductsComponent} from "./shopping/component/products/products.component";
import {PagenotfoundComponent} from "./core/components/pagenotfound/pagenotfound.component";

const routes: Routes = [
  { path: '',  component: ProductsComponent },
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
