import { Component, inject } from '@angular/core';
import { ContactAssistantService } from '../../services/contact-assistant.service';

@Component({
  selector: 'app-csv-training',
  standalone: true,
  imports: [],
  templateUrl: './csv-training.html',
  styleUrl: './csv-training.css',
})
export class CsvTraining {
  private readonly contactAssistant = inject(ContactAssistantService);

  openChat(topic: string): void {
    this.contactAssistant.open(topic);
  }
}
