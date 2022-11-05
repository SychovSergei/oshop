import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AuthDialogName, IdentificationDialog} from "../../../shared/models/identification-dialog";
import {Observable, Subject, Subscription} from "rxjs";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Component({
  selector: 'app-identification',
  templateUrl: './identification.component.html',
  styleUrls: ['./identification.component.scss']
})
export class IdentificationComponent implements OnInit {
  title: string;
  dialogName: string;
  private dataSwitch: IdentificationDialog;

  isXSmall: boolean;

  // dataPart: Subject<IdentificationDialog> = new Subject<IdentificationDialog>();
  // dataPart$: Observable<IdentificationDialog> = this.dataPart.asObservable();
  // dataPartSub: Subscription;

  constructor(
    public dialogRef: MatDialogRef<IdentificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IdentificationDialog,
    private responsive: BreakpointObserver,
  ) { }

  ngOnInit(): void {
    this.switchForm(this.data.dialogName);
    this.responsive.observe([Breakpoints.XSmall]).subscribe((res) => {
      this.isXSmall = res.matches;
    });
    // this.title = this.data.title!;
    // this.dialogName = this.data.dialogName;

    // this.dataPartSub = this.dataPart$
    //   .subscribe((d) => {
    //     this.title = d.title!;
    //     this.dialogName = d.dialogName;
    //     });
  }

  // ngOnDestroy() {
  //   this.dataPartSub.unsubscribe();
  // }

  switchForm(event: AuthDialogName) {
    this.dataSwitch = this.defineDialogData(event);
    this.title = this.dataSwitch.title!;
    this.dialogName = this.dataSwitch.dialogName;
  }

  closeForm() {
    localStorage.removeItem('loginForm');
    localStorage.removeItem('registerForm');
    this.dialogRef.close();
  }

  private defineDialogData(initial: AuthDialogName): IdentificationDialog {
    switch (initial) {
      case 'login':
        return { title: 'Login', dialogName: initial };
      case 'register':
        return { title: 'Register', dialogName: initial };
      case 'resetPassword':
        return { title: 'Reset Password', dialogName: initial };
    }
  }
}
