import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProductImage} from "../../../../shared/models/product";

@Component({
  selector: 'uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent {
  @Input() filesFromOldValue: ProductImage[];
  @Output() newFilesListFromDrop = new EventEmitter<File[]>()
  @Output() backupFilesListFromDrop = new EventEmitter<File[]>()

  private newFiles: File[] = [];
  private backupFiles: File[] = [];

  onDrop(loadingFiles: FileList) {
    const fileNamesFromOldValue = this.getActualFileNames(this.filesFromOldValue);
    for (let i = 0; i < loadingFiles.length; i++) {
      if (!fileNamesFromOldValue.includes(loadingFiles.item(i)!.name)) {
        this.newFiles.push(loadingFiles.item(i)!);
      } else if (fileNamesFromOldValue.includes(loadingFiles.item(i)!.name)) {
        this.backupFiles.push(loadingFiles.item(i)!);
      }
    }
    this.newFilesListFromDrop.emit(this.newFiles);
    this.backupFilesListFromDrop.emit(this.backupFiles);
  }

  private getActualFileNames(images: ProductImage[]) {
    const names: string[] = [];
    images.forEach((image) => {
      names.push(image.fileName);
    });
    return names;
  }

  fromInput(event: Event) {
    this.onDrop((event.currentTarget as HTMLInputElement).files!)
  }
}
