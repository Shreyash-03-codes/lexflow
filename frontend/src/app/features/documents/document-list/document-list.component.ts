import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DocumentService } from '../../../core/services/document.service';
import { Document } from '../../../core/models/document.model';
import { TableComponent, Column } from '../../../shared/components/table/table.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [FormsModule, TableComponent, ButtonComponent, LoaderComponent],
  template: `
    <div class="page">
      <div class="header">
        <h2>Documents</h2>
      </div>

      <div class="upload-area">
        <div class="field">
          <label>Case ID</label>
          <input type="number" [(ngModel)]="caseIdFilter" placeholder="Filter by case ID" />
        </div>
        <app-button (click)="loadDocuments()">Load</app-button>
        <input
          type="file"
          (change)="onFileSelected($event)"
          accept=".pdf,.doc,.docx"
          #fileInput
        />
        <app-button
          [disabled]="!selectedFile || !caseIdFilter"
          [loading]="uploading()"
          (click)="uploadFile()"
        >
          Upload
        </app-button>
      </div>

      <app-loader [loading]="loading()" />

      @if (documents().length) {
        <app-table
          [columns]="columns"
          [data]="documents()"
          [actions]="true"
          (rowClick)="downloadDoc($event)"
        >
          @for (doc of documents(); track doc.id) {
            <app-button (click)="onDownload($event, doc)">Download</app-button>
          }
        </app-table>
      }
    </div>
  `,
  styles: [
    `
      .page { max-width: 960px; }
      .header { margin-bottom: 20px; }
      .header h2 { margin: 0; font-size: 20px; }
      .upload-area {
        display: flex; align-items: flex-end; gap: 12px; margin-bottom: 24px;
        background: white; padding: 16px; border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      }
      .field { display: flex; flex-direction: column; gap: 4px; }
      .field label { font-size: 13px; font-weight: 500; color: #495057; }
      .field input {
        padding: 8px 10px; border: 1px solid #dee2e6; border-radius: 6px; font-size: 14px;
      }
    `,
  ],
})
export class DocumentListComponent implements OnInit {
  documents = signal<Document[]>([]);
  loading = signal(true);
  uploading = signal(false);
  caseIdFilter = 0;
  selectedFile: File | null = null;

  columns: Column[] = [
    { key: 'fileName', label: 'File Name' },
    { key: 'mimeType', label: 'Type' },
    { key: 'caseTitle', label: 'Case' },
    { key: 'uploadedByName', label: 'Uploaded By' },
    { key: 'createdAt', label: 'Uploaded' },
  ];

  constructor(
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
  }

  loadDocuments(): void {
    if (!this.caseIdFilter) return;
    this.loading.set(true);
    this.documentService.getByCase(this.caseIdFilter).subscribe({
      next: (data) => {
        this.documents.set(
          data.map((d) => ({
            ...d,
            createdAt: new Date(d.createdAt).toLocaleDateString(),
          }))
        );
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  uploadFile(): void {
    if (!this.selectedFile || !this.caseIdFilter) return;
    this.uploading.set(true);
    this.documentService.upload(this.caseIdFilter, this.selectedFile).subscribe({
      next: () => {
        this.uploading.set(false);
        this.selectedFile = null;
        this.loadDocuments();
      },
      error: () => (this.uploading.set(false)),
    });
  }

  onDownload(event: Event, doc: Document): void {
    event.stopPropagation();
    this.documentService.download(doc.id).subscribe((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.fileName;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  downloadDoc(doc: Document): void {
    this.onDownload(new Event(''), doc);
  }
}
