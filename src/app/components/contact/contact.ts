import { Component, inject } from '@angular/core';
import { ContactAssistantService } from '../../services/contact-assistant.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  private readonly contactAssistant = inject(ContactAssistantService);

  openChat(): void {
    this.contactAssistant.open();
  }
}
