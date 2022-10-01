import {Directive, EventEmitter, HostListener, Output} from "@angular/core";

@Directive({
  selector: "[dropzone]"
})
export class DropzoneDirective {
  @Output() dropped = new EventEmitter<FileList>();

  @HostListener('drop', ['$event']) onDropFiles($event: any) {
    $event.preventDefault();
    this.dropped.emit($event.dataTransfer!.files);
  }

  @HostListener('dragover', ['$event'])
  onDragOver($event: any) {
    $event.preventDefault();
  }

}
