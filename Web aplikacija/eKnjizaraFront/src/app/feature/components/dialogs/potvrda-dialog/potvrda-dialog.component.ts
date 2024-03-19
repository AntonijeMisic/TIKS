import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-potvrda-dialog',
  standalone: true,
  imports: [MatDialogModule, CommonModule],
  templateUrl: './potvrda-dialog.component.html',
  styleUrl: './potvrda-dialog.component.scss'
})
export class PotvrdaDialogComponent implements OnInit {

  public tip!: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {

    this.tip=this.data.tip;
  }

}
