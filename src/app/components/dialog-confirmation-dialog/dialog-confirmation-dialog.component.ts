import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Data} from '../../model/Data';


@Component({
  selector: 'app-dialog-confirmation-dialog',
  templateUrl: './dialog-confirmation-dialog.component.html',
  styleUrls: ['./dialog-confirmation-dialog.component.scss']
})
export class DialogConfirmationDialogComponent implements OnInit {

  ngOnInit() {
  }
  constructor(
    public dialogRef: MatDialogRef<DialogConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data) {}

  onOkClick(): void {
    this.dialogRef.close();
  }
}
