import { Component, OnInit, Inject,Injectable } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';

@Component({
  selector: 'app-messagedialog',
  templateUrl: './messagedialog.component.html',
  styleUrls: ['./messagedialog.component.css']
})
export class MessagedialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<MessagedialogComponent>, @Inject(MAT_DIALOG_DATA) public data : any) { }

  ngOnInit() {
  }

  public closeDialog(){
    this.dialogRef.close();
  }

}
