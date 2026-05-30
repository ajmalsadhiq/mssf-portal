import { Component, inject, signal, effect, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating Circular Bubble Trigger -->
    @if (!isOpen()) {
      <button 
        (click)="isOpen.set(true)"
        class="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-primary shadow-xl hover:scale-115 transition-all duration-300 animate-pulse-gold active:scale-90 border-2 border-primary/20 cursor-pointer"
        [ngClass]="lang.isRtl() ? 'left-6 right-auto' : 'right-6'"
        aria-label="Open support chat"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
      </button>
    } @else {
      <!-- Expanded Elegant Chat Panel Box -->
      <div 
        class="fixed bottom-6 right-6 z-40 w-80 h-[400px] flex flex-col rounded-2xl shadow-2xl border border-accent/20 bg-white luxury-glass overflow-hidden animate-fade-in-up"
        [ngClass]="lang.isRtl() ? 'left-6 right-auto' : 'right-6'"
      >
        <!-- Luxury Header Banner -->
        <div class="px-4 py-3 bg-primary text-white flex items-center justify-between border-b border-accent/20">
          <div class="flex items-center gap-2">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span class="text-xs font-bold font-display text-accent tracking-wide">MSSPF Live Help Desk</span>
          </div>
          
          <!-- Close button -->
          <button (click)="isOpen.set(false)" class="text-stone-300 hover:text-white transition-colors cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Chat Feed Area -->
        <div #scrollContainer class="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 bg-stone-50/50">
          @for (msg of chat.messages(); track msg.id) {
            <div 
              class="flex flex-col max-w-[80%]"
              [ngClass]="{
                'self-end': msg.sender === 'user',
                'self-start': msg.sender === 'agent'
              }"
            >
              <!-- Sender Name -->
              <span class="text-[9px] text-stone-400 mb-1" [ngClass]="msg.sender === 'user' ? 'text-right' : 'text-left'">
                {{ msg.senderName }}
              </span>

              <!-- Bubble Text content -->
              <div 
                class="px-3.5 py-2.5 rounded-2xl text-xs font-medium leading-relaxed shadow-sm border"
                [ngClass]="{
                  'bg-accent text-primary border-accent rounded-tr-none': msg.sender === 'user' && !lang.isRtl(),
                  'bg-accent text-primary border-accent rounded-tl-none': msg.sender === 'user' && lang.isRtl(),
                  'bg-white text-stone-700 border-stone-200 rounded-tl-none': msg.sender === 'agent' && !lang.isRtl(),
                  'bg-white text-stone-700 border-stone-200 rounded-tr-none': msg.sender === 'agent' && lang.isRtl()
                }"
              >
                {{ msg.text }}

                <!-- Attachment Metadata rendering -->
                @if (msg.attachment) {
                  <div class="mt-2 p-1.5 rounded bg-black/5 flex items-center gap-1.5 border border-black/10">
                    <svg class="w-3.5 h-3.5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span class="text-[8px] truncate max-w-[120px] font-mono leading-none">{{ msg.attachment.name }}</span>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Agent typing animation indicator -->
          @if (chat.isAgentTyping()) {
            <div class="self-start flex flex-col max-w-[80%] animate-fade-in-up">
              <span class="text-[9px] text-stone-400 mb-1">Typing...</span>
              <div class="bg-white border border-stone-200 px-3.5 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center shadow-sm">
                <span class="w-1.5 h-1.5 rounded-full bg-accent animate-bounce"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:0.2s]"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          }
        </div>

        <!-- Attachment indicator drawer -->
        @if (selectedFile()) {
          <div class="px-4 py-1.5 bg-stone-100 border-t border-stone-200 text-[10px] font-bold text-stone-600 flex items-center justify-between animate-fade-in-up">
            <span class="truncate max-w-[200px]">Attached: {{ selectedFile()?.name }}</span>
            <button (click)="selectedFile.set(null)" class="text-rose-500 font-black cursor-pointer">&times;</button>
          </div>
        }

        <!-- Bottom Input Bar -->
        <div class="p-3 border-t border-stone-100 flex items-center gap-2 bg-white">
          <!-- Mock Attachment Paperclip Trigger hidden -->
          <input 
            type="file" 
            #fileInput 
            (change)="onFileAttached($event)" 
            class="hidden" 
            accept="image/*,application/pdf"
          />
          <button 
            (click)="fileInput.click()"
            class="flex-shrink-0 text-stone-400 hover:text-stone-600 transition-colors p-1"
            title="Attach file"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
            </svg>
          </button>

          <!-- Input Text Area -->
          <input 
            type="text" 
            [(ngModel)]="msgText"
            (keydown.enter)="send()"
            [placeholder]="lang.isRtl() ? 'اكتب رسالتك...' : 'Type message...'"
            class="flex-1 py-1.5 px-3 border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-accent focus:border-accent"
          />

          <!-- Send Action Button -->
          <button 
            (click)="send()"
            [disabled]="!msgText.trim() && !selectedFile()"
            class="flex-shrink-0 bg-primary hover:bg-primary-light text-accent p-2 rounded-xl disabled:opacity-40 transition-all cursor-pointer shadow-sm"
          >
            <svg class="w-3.5 h-3.5 transform" [ngClass]="lang.isRtl() ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </button>
        </div>
      </div>
    }
  `
})
export class ChatWidgetComponent {
  readonly lang = inject(LanguageService);
  readonly chat = inject(ChatService);

  readonly isOpen = signal<boolean>(false);
  readonly selectedFile = signal<File | null>(null);
  
  readonly scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  msgText = '';

  constructor() {
    // Proactively scroll chat feed down on any message updates
    effect(() => {
      const container = this.scrollContainer();
      if (container) {
        setTimeout(() => {
          container.nativeElement.scrollTop = container.nativeElement.scrollHeight;
        }, 100);
      }
    });
  }

  onFileAttached(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile.set(target.files[0]);
    }
  }

  send(): void {
    if (!this.msgText.trim() && !this.selectedFile()) return;

    const file = this.selectedFile();
    this.chat.sendMessage(this.msgText.trim(), file || undefined);
    
    // Reset values
    this.msgText = '';
    this.selectedFile.set(null);
  }
}
