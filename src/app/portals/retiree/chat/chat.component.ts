import { Component, inject, signal, effect, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { ChatService, ChatMessage } from '../../../core/services/chat.service';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-retiree-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbComponent],
  template: `
    <div class="flex flex-col gap-6 h-[calc(100vh-140px)]" [dir]="lang.isRtl() ? 'rtl' : 'ltr'">
      
      <!-- Breadcrumb Navigation -->
      <app-breadcrumb [items]="[{ label: lang.t('serv.chat') }]"></app-breadcrumb>

      <!-- Main Wide-Pane Chat Grid -->
      <div class="flex-grow grid grid-cols-1 lg:grid-cols-3 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden min-h-0">
        
        <!-- Left: Support Guidelines & Officer Ident (1 Column) -->
        <div class="lg:col-span-1 border-r border-stone-100 p-6 flex flex-col gap-6" [ngClass]="lang.isRtl() ? 'border-l border-r-0' : 'border-r border-l-0'">
          <div>
            <h3 class="font-display text-sm font-bold text-primary mb-1">
              Live Support Room
            </h3>
            <p class="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Secured Military Chatline</p>
          </div>

          <!-- Active Officer Identity -->
          <div class="p-4 rounded-xl bg-luxury-cream border border-accent/15 flex items-center gap-3">
            <div class="relative">
              <div class="h-10 w-10 rounded-full bg-accent text-primary font-bold text-xs flex items-center justify-center shadow-sm select-none">
                OK
              </div>
              <span class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white animate-pulse"></span>
            </div>
            <div class="flex flex-col leading-none">
              <span class="text-xs font-bold text-primary mb-1">Officer Khalid Al-Masroori</span>
              <span class="text-[8px] text-stone-400 font-bold uppercase tracking-widest">MSSPF Duty Officer</span>
            </div>
          </div>

          <!-- Guidelines list -->
          <div class="space-y-4 pt-4 border-t border-stone-100 text-[10px] sm:text-xs text-stone-500 leading-relaxed font-semibold">
            <h4 class="font-bold text-stone-700">Support Working Hours</h4>
            <p>Our dedicated military duty officers are available from 07:30 AM to 02:30 PM (Sunday to Thursday). Messages sent after hours will be queued for response next working day.</p>
            
            <h4 class="font-bold text-stone-700">Document Upload Guideline</h4>
            <p>You can drag & drop or upload scans of official bank statements, ID cards, and court decrees. Supporting documents must be under 5MB and in PDF or image format.</p>
          </div>
        </div>

        <!-- Right: Wide Chat Feed Pane (2 Columns) -->
        <div class="lg:col-span-2 flex flex-col justify-between h-full min-h-0 bg-stone-50/50">
          
          <!-- Message Feed container scrollable -->
          <div #chatFeed class="flex-grow p-6 overflow-y-auto flex flex-col gap-4 min-h-0">
            @for (msg of chat.messages(); track msg.id) {
              <div 
                class="flex flex-col max-w-[70%] animate-fade-in-up"
                [ngClass]="{
                  'self-end': msg.sender === 'user',
                  'self-start': msg.sender === 'agent'
                }"
              >
                <!-- Sender Name & Time stamp -->
                <div class="flex items-baseline gap-2 mb-1 text-[9px] text-stone-400 font-semibold" [ngClass]="msg.sender === 'user' ? 'justify-end' : 'justify-start'">
                  <span>{{ msg.senderName }}</span>
                  <span>{{ msg.timestamp | date:'shortTime' }}</span>
                </div>

                <!-- Chat Bubble Container -->
                <div 
                  class="px-4 py-3 rounded-2xl text-xs font-semibold leading-relaxed border shadow-sm"
                  [ngClass]="{
                    'bg-accent text-primary border-accent rounded-tr-none': msg.sender === 'user' && !lang.isRtl(),
                    'bg-accent text-primary border-accent rounded-tl-none': msg.sender === 'user' && lang.isRtl(),
                    'bg-white text-stone-700 border-stone-200 rounded-tl-none': msg.sender === 'agent' && !lang.isRtl(),
                    'bg-white text-stone-700 border-stone-200 rounded-tr-none': msg.sender === 'agent' && lang.isRtl()
                  }"
                >
                  {{ msg.text }}

                  <!-- Uploaded Attachment representation -->
                  @if (msg.attachment) {
                    <div class="mt-2.5 p-2 rounded bg-black/5 flex items-center gap-2 border border-black/10">
                      <svg class="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <div class="flex flex-col leading-none truncate">
                        <span class="text-[9px] truncate max-w-[150px] font-bold font-mono">{{ msg.attachment.name }}</span>
                        <span class="text-[7px] text-stone-400 font-bold font-mono mt-0.5">{{ msg.attachment.size }}</span>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Typing indicator -->
            @if (chat.isAgentTyping()) {
              <div class="self-start flex flex-col max-w-[70%] animate-fade-in-up">
                <span class="text-[9px] text-stone-400 mb-1">Typing...</span>
                <div class="bg-white border border-stone-200 px-4 py-3.5 rounded-2xl rounded-tl-none flex gap-1 items-center shadow-sm">
                  <span class="w-1.5 h-1.5 rounded-full bg-accent animate-bounce"></span>
                  <span class="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:0.2s]"></span>
                  <span class="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            }
          </div>

          <!-- Attachment notification -->
          @if (attachedFile()) {
            <div class="px-6 py-2 bg-stone-100 border-t border-stone-200 text-xs font-bold text-stone-600 flex items-center justify-between animate-fade-in-up">
              <span class="truncate max-w-[400px]">Attachment ready: {{ attachedFile()?.name }}</span>
              <button (click)="attachedFile.set(null)" class="text-rose-500 font-black cursor-pointer p-1">&times;</button>
            </div>
          }

          <!-- Bottom Text Input Control Area -->
          <div class="p-4 bg-white border-t border-stone-200 flex items-center gap-3">
            <input 
              type="file" 
              #fileSelector 
              (change)="onFileSelected($event)" 
              class="hidden" 
              accept="image/*,application/pdf"
            />
            <button 
              (click)="fileSelector.click()"
              class="text-stone-400 hover:text-stone-600 transition-colors p-1"
              title="Attach document letter"
            >
              <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
              </svg>
            </button>

            <input 
              type="text" 
              [(ngModel)]="chatText"
              (keydown.enter)="sendMessage()"
              [placeholder]="lang.isRtl() ? 'اكتب استفسارك هنا...' : 'Discuss your inquiry with the officer...'"
              class="flex-1 px-4 py-3 border border-stone-200 rounded-xl text-xs font-semibold outline-none focus:ring-1 focus:ring-accent focus:border-accent bg-stone-50/20"
            />

            <button 
              (click)="sendMessage()"
              [disabled]="!chatText.trim() && !attachedFile()"
              class="bg-primary hover:bg-primary-light text-accent px-5 py-3 rounded-xl disabled:opacity-40 transition-all font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <span>{{ lang.isRtl() ? 'إرسال' : 'Send' }}</span>
              <svg class="w-4 h-4 transform" [ngClass]="lang.isRtl() ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </div>

        </div>

      </div>

    </div>
  `
})
export class ChatComponent {
  readonly lang = inject(LanguageService);
  readonly chat = inject(ChatService);

  readonly attachedFile = signal<File | null>(null);
  readonly chatFeed = viewChild<ElementRef<HTMLDivElement>>('chatFeed');

  chatText = '';

  constructor() {
    // Keep scroll aligned to bottom on updates
    effect(() => {
      const feed = this.chatFeed();
      if (feed) {
        setTimeout(() => {
          feed.nativeElement.scrollTop = feed.nativeElement.scrollHeight;
        }, 100);
      }
    });
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.attachedFile.set(target.files[0]);
    }
  }

  sendMessage(): void {
    if (!this.chatText.trim() && !this.attachedFile()) return;

    const file = this.attachedFile();
    this.chat.sendMessage(this.chatText.trim(), file || undefined);
    
    // Clear state
    this.chatText = '';
    this.attachedFile.set(null);
  }
}
