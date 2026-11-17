import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-csv-training',
  standalone: true,
  imports: [],
  templateUrl: './csv-training.html',
  styleUrl: './csv-training.css',
})
export class CsvTraining {
  @Output() openChat = new EventEmitter<string>();
}
