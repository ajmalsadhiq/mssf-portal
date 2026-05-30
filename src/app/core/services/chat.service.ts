import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  senderName: string;
  text: string;
  timestamp: Date;
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  readonly messages = signal<ChatMessage[]>([]);
  readonly isAgentTyping = signal<boolean>(false);

  private readonly mockAgentReplies = [
    'Welcome to the MSSPF live support. How may I assist you with your pension services today, Sir?',
    'I can confirm that our systems received your IBAN update request. It is currently being verified with the Central Bank of Oman.',
    'Regarding your certificate request, you can download a QR-coded digital version immediately under the "Certificates" tab in this portal.',
    'For military funeral claims, the standard processing time is 48 working hours after uploading the death certificate and legal heir documents.',
    'Thank you for providing the document copy. I will attach it directly to your open file. Is there anything else I can help you with today?'
  ];

  private replyIndex = 0;

  constructor() {
    // Initial greeting
    this.messages.set([
      {
        id: 'init-1',
        sender: 'agent',
        senderName: 'Officer Khalid (MSSPF Support)',
        text: 'Assalamu Alaikum. Welcome to the Military and Security Services Pension Fund live chat. How can I assist you today?',
        timestamp: new Date(Date.now() - 60000)
      }
    ]);
  }

  sendMessage(text: string, attachmentFile?: File): void {
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      senderName: 'You',
      text,
      timestamp: new Date()
    };

    if (attachmentFile) {
      userMsg.attachment = {
        name: attachmentFile.name,
        size: `${(attachmentFile.size / 1024).toFixed(1)} KB`,
        type: attachmentFile.type
      };
    }

    this.messages.update(curr => [...curr, userMsg]);

    // Simulate Agent typing and replying
    this.isAgentTyping.set(true);
    setTimeout(() => {
      this.isAgentTyping.set(false);
      
      const agentReply: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'agent',
        senderName: 'Officer Khalid (MSSPF Support)',
        text: this.mockAgentReplies[this.replyIndex % this.mockAgentReplies.length],
        timestamp: new Date()
      };
      
      this.replyIndex++;
      this.messages.update(curr => [...curr, agentReply]);
    }, 1800);
  }

  clearChat(): void {
    this.messages.set([]);
  }
}
