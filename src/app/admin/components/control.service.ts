import {Injectable} from "@angular/core";
import {Observable, tap} from "rxjs";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Control} from "./dynamic-form-control/dynamic-form-control.component";

@Injectable()
export class ControlService {

  constructor(private db: AngularFireDatabase) {
  }

  getControl(controlName: string): Observable<Control[] | null> {
    return this.db.object<Control[] | null>('/controls/' + controlName)
      .valueChanges()
      // .pipe(
      //   tap((v) => {
      //     console.log('get control: TAP', v)
      //   })
      // )
  }

}


