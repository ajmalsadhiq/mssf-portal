import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      <!-- File Input Reference hidden -->
      <input 
        type="file" 
        [accept]="acceptString()" 
        #fileInput 
        (change)="onFileSelected($event)" 
        class="hidden" 
      />

      <!-- Drag Over Trigger Container -->
      @if (!uploadedFile()) {
        <div 
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
          (click)="fileInput.click()"
          class="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 select-none bg-stone-50/50 hover:bg-stone-50"
          [ngClass]="{
            'border-accent bg-luxury-cream/60 animate-pulse-gold': isDragOver(),
            'border-stone-300': !isDragOver()
          }"
        >
          <!-- Upload Cloud Vector SVG -->
          <div class="w-10 h-10 text-stone-400 mb-3 group-hover:text-accent transition-colors">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
          </div>

          <h5 class="text-xs font-bold text-stone-700 mb-1 leading-tight text-center">
            {{ label() }}
          </h5>
          <p class="text-[10px] text-stone-400 font-semibold text-center leading-relaxed">
            Drag & drop here or click to browse. Max size: {{ maxSizeMb() }}MB.
          </p>
        </div>
      } @else {
        <!-- Uploaded File Drawer Indicator -->
        <div class="flex flex-col p-4 rounded-xl border border-accent/20 bg-luxury-cream/40 shadow-sm animate-fade-in-up">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2.5 truncate">
              <!-- PDF vs Image Vector Icons -->
              <div class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-primary">
                @if (uploadedFile()?.type?.includes('pdf')) {
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                } @else {
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                }
              </div>
              <div class="flex flex-col truncate">
                <span class="text-xs font-bold text-primary leading-tight truncate">{{ uploadedFile()?.name }}</span>
                <span class="text-[9px] text-stone-400 font-semibold leading-none">{{ (uploadedFile()!.size / 1024 / 1024) | number:'1.1-2' }} MB</span>
              </div>
            </div>

            <!-- Clear Action trash button -->
            <button 
              (click)="clearFile()"
              class="flex-shrink-0 text-stone-400 hover:text-stone-700 transition-colors p-1"
              aria-label="Remove uploaded file"
            >
              <svg class="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>

          <!-- Mock Loading Progress Bar -->
          @if (uploadProgress() < 100) {
            <div class="w-full mt-3">
              <div class="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                <div class="bg-accent h-full transition-all duration-100 ease-out" [style.width.%]="uploadProgress()"></div>
              </div>
              <span class="text-[9px] text-stone-400 font-bold uppercase mt-1 block">Uploading... {{ uploadProgress() }}%</span>
            </div>
          } @else {
            <div class="flex items-center gap-1 mt-2 text-[9px] text-emerald-600 font-bold uppercase tracking-wider">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Ready for submission</span>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class FileUploaderComponent {
  readonly lang = inject(LanguageService);
  private readonly notification = inject(NotificationService);

  readonly label = input.required<string>();
  readonly maxSizeMb = input<number>(5);
  readonly allowedTypes = input<string[]>(['application/pdf', 'image/jpeg', 'image/png']);

  readonly fileSelected = output<File | null>();

  readonly uploadedFile = signal<File | null>(null);
  readonly isDragOver = signal<boolean>(false);
  readonly uploadProgress = signal<number>(0);

  protected acceptString(): string {
    return this.allowedTypes().join(',');
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.processFile(target.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
    
    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  private processFile(file: File): void {
    // Validate file size
    const maxBytes = this.maxSizeMb() * 1024 * 1024;
    if (file.size > maxBytes) {
      this.notification.error(
        this.lang.isRtl() 
          ? `فشل الرفع: حجم الملف يتجاوز الحد الأقصى المسموح به وهو ${this.maxSizeMb()} ميغابايت` 
          : `Upload failed: File size exceeds the maximum limit of ${this.maxSizeMb()}MB.`
      );
      return;
    }

    // Validate file type
    const matches = this.allowedTypes().some(type => {
      const regex = new RegExp(type.replace('*', '.*'));
      return regex.test(file.type);
    });

    if (!matches) {
      this.notification.error(
        this.lang.isRtl()
          ? 'نوع الملف المرفوع غير مدعوم. يرجى إرفاق ملف PDF أو صورة عادية.'
          : 'Invalid file format. Please upload a valid PDF document or image.'
      );
      return;
    }

    this.uploadedFile.set(file);
    this.fileSelected.emit(file);
    this.simulateUpload();
  }

  private simulateUpload(): void {
    this.uploadProgress.set(0);
    const interval = setInterval(() => {
      this.uploadProgress.update(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 10;
      });
    }, 100);
  }

  clearFile(): void {
    this.uploadedFile.set(null);
    this.fileSelected.emit(null);
    this.uploadProgress.set(0);
  }
}
