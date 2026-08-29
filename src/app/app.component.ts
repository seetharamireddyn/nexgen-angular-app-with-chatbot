import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';

type ChatStep = 'welcome' | 'inquiry';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly year = new Date().getFullYear();

  isChatOpen = false;
  chatStep: ChatStep = 'welcome';
  selectedTopic = '';

  inquiry = {
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  };

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  openChat(): void {
    this.isChatOpen = true;
    this.chatStep = 'welcome';
  }

  closeChat(): void {
    this.isChatOpen = false;
  }

  chooseTopic(topic: string): void {
    this.selectedTopic = topic;
    this.chatStep = 'inquiry';
    this.inquiry.message = `I'm interested in ${topic}.`;
  }

  startInquiry(): void {
    this.selectedTopic = '';
    this.chatStep = 'inquiry';
  }

  sendInquiry(): void {
    const subject = encodeURIComponent(
      `PureMinds Inquiry${this.selectedTopic ? ` - ${this.selectedTopic}` : ''}`
    );

    const body = encodeURIComponent(
      `Name: ${this.inquiry.name}\n` +
      `Email: ${this.inquiry.email}\n` +
      `Company: ${this.inquiry.company}\n` +
      `Phone: ${this.inquiry.phone}\n` +
      `Interest: ${this.selectedTopic || 'General Inquiry'}\n\n` +
      `Message:\n${this.inquiry.message}`
    );

    // Replace this address with your real business email.
    window.location.href = `mailto:seetharamireddy.n@gmail.com?subject=${subject}&body=${body}`;
  }
}