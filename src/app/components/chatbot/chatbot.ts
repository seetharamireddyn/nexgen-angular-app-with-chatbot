import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type ChatStep = 'welcome' | 'inquiry';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class Chatbot implements OnChanges {
  @Input() isOpen = false;
  @Input() initialTopic = '';
  @Output() close = new EventEmitter<void>();

  chatStep: ChatStep = 'welcome';
  selectedTopic = '';
  inquiry = { name: '', email: '', company: '', phone: '', message: '' };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue) {
      this.selectedTopic = this.initialTopic;
      this.chatStep = this.initialTopic ? 'inquiry' : 'welcome';
      this.inquiry.message = this.initialTopic ? `I'm interested in ${this.initialTopic}.` : '';
    }
  }

  closeChat(): void {
    this.close.emit();
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
    const subject = encodeURIComponent(`Qyveriq Inquiry${this.selectedTopic ? ` - ${this.selectedTopic}` : ''}`);
    const body = encodeURIComponent(
      `Name: ${this.inquiry.name}\nEmail: ${this.inquiry.email}\n` +
      `Company: ${this.inquiry.company || 'Not provided'}\n` +
      `Phone: ${this.inquiry.phone || 'Not provided'}\n` +
      `Interest: ${this.selectedTopic || 'General Inquiry'}\n\nMessage:\n${this.inquiry.message}`
    );
    window.location.href = `mailto:info@qyveriq.com?subject=${subject}&body=${body}`;
  }
}
