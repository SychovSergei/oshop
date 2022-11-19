import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PagenotfoundComponent} from "./core/components/pagenotfound/pagenotfound.component";
import {MainPageComponent} from "./shopping/components/main-page/main-page.component";

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
