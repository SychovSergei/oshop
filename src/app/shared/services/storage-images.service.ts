import {Injectable} from "@angular/core";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {ProductImage} from "../models/product";
import {combineLatest, forkJoin, map, Observable, of, switchMap} from "rxjs";
import firebase from "firebase/compat";
import FullMetadata = firebase.storage.FullMetadata;

@Injectable()
export class StorageImagesService {

  private baseProductImagePath: string = "/productImageUploads/";

  constructor(private storage: AngularFireStorage) {}

  getAllById(id: string): Observable<ProductImage[] | null> {
    const storageRef = this.storage.ref(this.baseProductImagePath + id);
    return storageRef.listAll()
      .pipe(
        switchMap((result) => {
          const arr: Array<Observable<ProductImage>> = [];
          if (result.items.length > 0) {
            result.items.forEach((imageRef) => {
              arr.push(
                forkJoin([imageRef.getMetadata(), imageRef.getDownloadURL()])
                  .pipe(
                    map((res) => {
                      return {
                        fileName: res[0].name,
                        size: res[0].size,
                        type: res[0].contentType || '',
                        lastModified: new Date(res[0].updated).getTime(),
                        url: res[1]
                      } as ProductImage
                    })
                  )
              )
            })
            return of(arr)
              /** convert  Observable<T>[] to  Observable<T[]> */
              .pipe(switchMap(item => combineLatest(item)))
          } else {
            return of(null)
          }
        }),
      )
  }

  deleteImageByUrl(path: string): Observable<boolean> {
    return this.storage.refFromURL(path).delete()
      .pipe(map(() => { return true }));
  }

  /** ??? If the ID does not exist then return an empty array.
   *  Otherwise, return an array of file names. */ //TODO Check if method is used
  getFileNamesById(id: string): Observable<string[]> {
    const storageRef = this.storage.ref(this.baseProductImagePath + id);
    return storageRef.listAll()
      .pipe(
        switchMap((result) => {
          const arr: Promise<FullMetadata>[] = [];
          result.items.forEach((imageRef) => { arr.push(imageRef.getMetadata()) })
          return arr.length > 0 ? forkJoin(arr) : of([]);
        }),
        switchMap((res) => {
          const names: string[] = [];
          res.forEach((item) => { names.push(item.name); })
          return of(names);
        }),
      )
  }

}
///** ??? delete??? */
  // getImagesByProductId(id: string): Observable<ProductImage[]> {
  //   const storageRef = this.storage.ref(this.baseProductImagePath + id);
  //   const filesFromStorage: ProductImage[] = [];
  //   return storageRef.listAll()
  //     .pipe(
  //       switchMap((result) => {
  //         result.items.forEach((imageRef) => {
  //           const fileItem: ProductImage = {fileName: '',url: '',size:0,type:'',lastModified:0};
  //           imageRef.getMetadata().then((res) => {
  //             fileItem.fileName = res.name;
  //             fileItem.size = res.size;
  //             fileItem.type = res.contentType || '';
  //             fileItem.lastModified = new Date(res.updated).getTime();
  //           });
  //           imageRef.getDownloadURL().then((downloadUrl) => {
  //             fileItem.url = downloadUrl;
  //           });
  //           filesFromStorage.push(fileItem);
  //         });
  //         return forkJoin(filesFromStorage);
  //       })
  //     )
  // }


  // checkFilesInStorageById(id: string) {
  //   if (id) {
  //     const storageRef = this.storage.ref("/productImageUploads/" + id);
  //     storageRef.listAll()
  //       .subscribe((result) => {
  //         result.items.forEach((imageRef) => {
  //           // And finally display them
  //           console.log('STORAGE imageRef = ', imageRef.getDownloadURL());
  //           console.log('STORAGE imageRef.fullPath = ', imageRef.fullPath);
  //           imageRef.getMetadata().then((res) => {
  //             console.log(res.size)
  //             // console.log(imageRef.storage.refFromURL(res));
  //           })
  //           // imageRef.getDownloadURL().then((res) => {
  //           //   console.log(res)
  //           //   console.log(imageRef.storage.refFromURL(res));
  //           // })
  //           // console.log('bucket', imageRef.fullPath);
  //         });
  //       });
  //   }
  // }



// const imgRef = this.storage.ref('/productImageUploads/temp_-NJ9_X5-Wr7LopoCFZPo/274406559.jpg');
// imgRef.getDownloadURL().subscribe((res) => {
//   const newRefUrl = this.storage.refFromURL(res);
//   console.log(res)
//   console.log('newRefUrl',newRefUrl)
// })


// /////////////
// const storage = getStorage();
// // Create a reference under which you want to list
// const listRef = ref(storage, '/productImageUploads/temp_-NJ9_X5-Wr7LopoCFZPo/');
//
// // Find all the prefixes and items.
// listAll(listRef)
//   .then((res) => {
//     console.log('res', res)
//     res.prefixes.forEach((folderRef) => {
//       // All the prefixes under listRef.
//       // You may call listAll() recursively on them.
//       console.log('prefixes', folderRef)
//     });
//     res.items.forEach((itemRef) => {
//       // All the items under listRef.
//       console.log('items', itemRef)
//     });
//   }).catch((error) => {
//   // Uh-oh, an error occurred!
// });
