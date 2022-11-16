import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {ActivatedRoute} from "@angular/router";
import {catchError, concatMap, last, Observable, throwError} from "rxjs";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {ProductImage} from "../../../../shared/models/product";

@Component({
  selector: 'upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss']
})
export class UploadTaskComponent implements OnInit {
  @Input() file: File;
  @Output() imageObj = new EventEmitter<ProductImage>();
  prodId: string;
  basePath: string = "/productImageUploads";
  percentageChanges$: Observable<number | undefined>;
  isVisible: boolean = true;

  constructor(
    private storage: AngularFireStorage,
    private db: AngularFireDatabase,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.prodId = this.route.snapshot.paramMap.get('id')!;
    const filePath = `${this.basePath}/${this.prodId}/${this.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, this.file);

    this.percentageChanges$ = uploadTask.percentageChanges();

    uploadTask.snapshotChanges()
      .pipe(
        last(),
        concatMap(() => storageRef.getDownloadURL()),
        catchError(err => {
          console.log(err);
          alert('Could not create url.');
          return throwError(err);
        })
      )
      .subscribe(url => {
        const obj: ProductImage = {
          fileName: this.file.name,
          size: this.file.size,
          lastModified: this.file.lastModified,
          type: this.file.type,
          url: url
        }
        this.imageObj.emit(obj);
        setTimeout(() => {
          this.isVisible = false;
        }, 5000)
      });
  }
}
