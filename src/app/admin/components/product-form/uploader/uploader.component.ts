import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent {
  @Input() allowTypes: string[] = [];
  @Output() filesFromDrop = new EventEmitter<File[]>()

  /** onDrop() get file list and convert to array of files.
   *  Although filter by allow types of files */
  onDrop(fileList: FileList) {
    const files: File[] = [];
    let filteredFiles: File[] = [];
    /** get array of files */
    for (let i = 0; i < fileList.length; i++) {
      files.push(fileList.item(i)!);
    }

    /** Filter array by allow types. Get All files by default */
    if (this.allowTypes.length > 0) {
      filteredFiles = files.filter(file => this.allowTypes.includes(file.type));
    }

    this.filesFromDrop.emit(filteredFiles.length > 0 ? filteredFiles : files);
  }


  fromInput(event: Event) {
    this.onDrop((event.currentTarget as HTMLInputElement).files!)
  }
}
