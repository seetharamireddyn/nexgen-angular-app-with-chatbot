import { Component, inject } from '@angular/core';
import { ContactAssistantService } from '../../services/contact-assistant.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {
  private readonly contactAssistant = inject(ContactAssistantService);

  openChat(topic: string): void {
    this.contactAssistant.open(topic);
  }
}
