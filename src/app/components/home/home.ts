import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ContactAssistantService } from '../../services/contact-assistant.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly router = inject(Router);
  private readonly contactAssistant = inject(ContactAssistantService);

  openContactAssistant(): void {
    this.contactAssistant.open();
  }

  navigateToServices(): void {
    void this.router.navigate(['/services']);
  }
}
