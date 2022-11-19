import { Component, OnInit } from '@angular/core';
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  isWideScreen: boolean;

  constructor(
    private responsive: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.responsive.observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge]).subscribe((res) => {
      this.isWideScreen = res.matches;
    });
  }

}
