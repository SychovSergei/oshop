import {Injectable} from "@angular/core";
import {Product} from "../models/product";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {AuthService} from "./auth.service";
import {map, Observable, switchMap, take} from "rxjs";
import {WishList} from "../models/wish-list";
import {NotifierService} from "angular-notifier";

@Injectable({
  providedIn: "root"
})
export class WishListService {
  private userUid: string | undefined;
  private readonly notifier: NotifierService;
  wishList: WishList;

  constructor(
    private authService: AuthService,
    private db: AngularFireDatabase,
    private notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  getWishList(): Observable<WishList> {
    return this.authService.user$
      .pipe(
        switchMap((user) => {
          this.userUid = user?.uid;
          return this.db.object<WishList>('/wishLists/' + user?.uid)
            .valueChanges()
            .pipe(
              map(prod =>
                new WishList(prod ? prod.items : {})
              )
            )
        })
      )
  }

  private getItem(userUid: string, productId: string) {
    return this.db.object<Product>('/wishLists/' + userUid + '/items/' + productId);
  }

  updateWishList(product: Product) {
    let listItem = this.getItem(this.userUid!, product.key!);
    listItem.snapshotChanges()
      .pipe(take(1))
      .subscribe((item) => {
        if (item.payload.toJSON() === null) {
          listItem.update(product).then(() => {
            this.notifier.notify('success', 'The product has been added to the wishlist.');
          })
        } else {
          listItem.remove();
        }
      });
  }

}
