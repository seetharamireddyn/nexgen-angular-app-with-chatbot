import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { UpcomingEvents } from './components/upcoming-events/upcoming-events';
import { Footer } from './components/footer/footer';
import { Chatbot } from './components/chatbot/chatbot';
import { ContactAssistantService } from './services/contact-assistant.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Header,
    RouterOutlet,
    UpcomingEvents,
    Footer,
    Chatbot
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly contactAssistant = inject(ContactAssistantService);

  isChatOpen = false;
  selectedTopic = '';

  constructor() {
    this.contactAssistant.openRequests$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((topic) => this.openChat(topic));
  }

  openChat(topic?: string): void {
    this.isChatOpen = true;
    this.selectedTopic = topic ?? '';
  }

  closeChat(): void {
    this.isChatOpen = false;
  }
}
