import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Observable} from "rxjs";
import firebase from "firebase/compat";
import {AuthService} from "../../../shared/services/auth.service";
import {AuthDialogName} from "../../../shared/models/identification-dialog";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {IdentificationComponent} from "../identification/identification.component";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {UserService} from "../../../shared/services/user.service";

@Component({
  selector: 'app-auth-avatar',
  templateUrl: './auth-avatar.component.html',
  styleUrls: ['./auth-avatar.component.scss']
})
export class AuthAvatarComponent implements OnInit {
  @Output() success = new EventEmitter<boolean>();
  user$: Observable<firebase.User | null>
  url: string | undefined;
  isXSmall: boolean;

  constructor(
    private authService: AuthService,
    public userService: UserService,

    private responsive: BreakpointObserver,
    matIconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {
    matIconRegistry.addSvgIcon('user-circle-reg',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/user-circle-reg.svg'));

  }

  ngOnInit(): void {
    this.user$ = this.authService.user$;
    this.responsive.observe([Breakpoints.XSmall]).subscribe((res) => {
      this.isXSmall = res.matches;
    });
  }

  openDialog(initial: AuthDialogName) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.disableClose = false;
    dialogConfig.data = { dialogName: initial };

    if (this.isXSmall) {
      dialogConfig.panelClass = 'fullscreen-auth-dialog';
    } else {
      dialogConfig.panelClass = 'auth-dialog';
    }

    let dialogRef: MatDialogRef<IdentificationComponent> =
      this.dialog.open(IdentificationComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      this.success.emit(true);
    });

  }

}
