import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoryService} from "../../services/category.service";
import {Observable} from "rxjs";
import {CategoryGroup} from "../../models/category.model";

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent implements OnInit {
  form: FormGroup;
  categories$: Observable<CategoryGroup[] | null>;

  constructor(
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { category: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.get();

    this.form = new FormGroup({
      category: new FormControl('', [Validators.required])
    })
  }

  onSubmit() {
    this.data = {
      category: this.form.value.category
    };
    this.dialogRef.close( this.data );
  }
}
