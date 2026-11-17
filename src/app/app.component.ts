import { Component } from '@angular/core';
import { Header } from './components/header/header';
import { Home } from './components/home/home';
import { UpcomingEvents } from './components/upcoming-events/upcoming-events';
import { Services } from './components/services/services';
import { CsvTraining } from './components/csv-training/csv-training';
import { About } from './components/about/about';
import { Approach } from './components/approach/approach';
import { Reviews } from './components/reviews/reviews';
import { Contact } from './components/contact/contact';
import { Footer } from './components/footer/footer';
import { Chatbot } from './components/chatbot/chatbot';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Header,
    Home,
    UpcomingEvents,
    Services,
    CsvTraining,
    About,
    Approach,
    Reviews,
    Contact,
    Footer,
    Chatbot
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isChatOpen = false;
  selectedTopic = '';

  openChat(topic?: string): void {
    this.isChatOpen = true;
    this.selectedTopic = topic ?? '';
  }

  closeChat(): void {
    this.isChatOpen = false;
  }
}
