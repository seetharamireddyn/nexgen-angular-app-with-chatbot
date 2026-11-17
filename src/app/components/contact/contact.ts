import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  @Output() openChat = new EventEmitter<void>();
}
