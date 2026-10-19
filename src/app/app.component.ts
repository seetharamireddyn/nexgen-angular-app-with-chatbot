import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  openChat(topic?: string): void {
    this.isChatOpen = true;
    this.chatStep = topic ? 'inquiry' : 'welcome';

    if (topic) {
      this.selectedTopic = topic;
      this.inquiry.message = `I'm interested in ${topic}.`;
    }
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
    this.inquiry.message = '';
  }

  sendInquiry(): void {
    const subject = encodeURIComponent(
      `Qyveriq Inquiry${this.selectedTopic ? ` - ${this.selectedTopic}` : ''}`
    );

    const body = encodeURIComponent(
      `Name: ${this.inquiry.name}\n` +
      `Email: ${this.inquiry.email}\n` +
      `Company: ${this.inquiry.company || 'Not provided'}\n` +
      `Phone: ${this.inquiry.phone || 'Not provided'}\n` +
      `Interest: ${this.selectedTopic || 'General Inquiry'}\n\n` +
      `Message:\n${this.inquiry.message}`
    );

    // This opens the visitor's configured email application; it does not send silently.
    window.location.href = `mailto:info@qyveriq.com?subject=${subject}&body=${body}`;
  }
}
