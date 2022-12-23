import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {catchError, concatMap, last, Observable, take, throwError} from "rxjs";
import {ProductImage} from "../../../../shared/models/product";
import {StorageImagesService} from "../../../../shared/services/storage-images.service";

@Component({
  selector: 'upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss']
})
export class UploadTaskComponent implements OnInit {
  @Input() file: File;
  @Input() path: string[];
  @Input() hideTime: number = 0;
  @Output() imageObj = new EventEmitter<ProductImage>();

  percentageChanges$: Observable<number | undefined>;
  isVisible: boolean = true;

  constructor(
    private storage: AngularFireStorage,
    private storageService: StorageImagesService
    ) { }

  ngOnInit(): void {
    this.storageService.getAllById(this.path[1])
      .pipe(take(1))
      .subscribe((images) => {
        const names: string[] = [];
        if (images) images.forEach((image) => { names.push(image.fileName); });

        let fileName = this.file.name;
        /** if file already exists then change his name
         *  filename -> filename(1)... -> filename(2)... */
        while (names.includes(fileName)) {
          fileName = this.incrementFileName(fileName);
        }
        const filePath = `${this.path.join('/')}/${fileName}`;
        this.loadFileToDb(filePath, fileName);
      }, (error) => {
        console.log(error)
      })
  }

  incrementFileName(fileName: string): string {
    const splitedName = fileName.split('.');
    let firstPartName = splitedName[0];
    let extensionPartName = splitedName[splitedName.length - 1];

    if (firstPartName.lastIndexOf(')') === firstPartName.length - 1) {
      firstPartName = firstPartName.slice(0, -1);
      if (firstPartName.lastIndexOf('(') > 0) {
        const numberParts: string[] = firstPartName.split('(');
        // get number part
        let numPart: string = numberParts[numberParts.length - 1];
        // delete last element
        numberParts.length = numberParts.length-1;
        let str = numberParts.join('(');
        // if numPart is number => increment
        let checkNumber: number = +numPart;
        if (!isNaN(checkNumber) ) checkNumber++;

        return str + '(' + checkNumber + ').' + extensionPartName;
      }
    }
    return splitedName[0] + '(' + 1 + ').' + extensionPartName;
  }

  private loadFileToDb(fPath: string, fName: string) {
    const storageRef = this.storage.ref(fPath);
    const uploadTask = this.storage.upload(fPath, this.file);

    this.percentageChanges$ = uploadTask.percentageChanges();

    uploadTask.snapshotChanges()
      .pipe(
        last(),
        concatMap(() => storageRef.getDownloadURL()),
        catchError(err => {
          return throwError(err);
        })
      )
      .subscribe(url => {
        const obj: ProductImage = {
          fileName: fName,
          size: this.file.size,
          lastModified: this.file.lastModified,
          type: this.file.type,
          url: url
        };
        this.imageObj.emit(obj);
        // hide component after given time
        if (this.hideTime > 0) setTimeout(() => { this.isVisible = false; }, this.hideTime)
      });
  }
}
