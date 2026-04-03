import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface LightboxData {
  id: string | number;
  task: any;
}

@Component({
  selector: 'custom-lightbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="lightbox-modal">
      <div class="lightbox-header">
        <h3>{{ isNewTask ? 'New Task' : 'Edit Task' }}</h3>
        <button class="close-btn" (click)="onCancelClick()" title="Close">
          ×
        </button>
      </div>
      
      <div class="lightbox-body">
        <div class="form-group">
          <label>Task Name:</label>
          <input 
            [(ngModel)]="localTask.text" 
            class="form-input"
            placeholder="Enter task name"
            (keyup.enter)="onSaveClick()"
          />
        </div>
      </div>
      
      <div class="lightbox-footer">
        <button class="btn btn-danger" (click)="onDeleteClick()" [disabled]="isNewTask">
          Delete
        </button>
        <button class="btn btn-secondary" (click)="onCancelClick()">
          Cancel
        </button>
        <button class="btn btn-primary" (click)="onSaveClick()">
          Save
        </button>
      </div>
    </div>
  `,
  styles: [` .lightbox-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000;
      max-width: 500px;
      background: #f8f9fa;
      width: 100%;
      max-height: 90vh;
      overflow: hidden;
    }
   
    .lightbox-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px 16px;
      border-bottom: 1px solid #e0e0e0;
      background: #f8f9fa;
    }
   
    .lightbox-header h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }
   
    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
    }
   
    .close-btn:hover {
      background: #e0e0e0;
      color: #333;
    }
   
    .lightbox-body {
      padding: 24px;
      max-height: 400px;
      overflow-y: auto;
    }
   
    .form-group {
      margin-bottom: 20px;
    }
   
    .form-group label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
      color: #555;
      font-size: 14px;
    }
   
    .form-input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
   
    .form-input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
    }
   
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
   
    .form-range {
      width: 100%;
      height: 6px;
      margin-top: 8px;
    }
   
    .lightbox-footer {
      padding: 16px 24px 24px;
      border-top: 1px solid #e0e0e0;
      background: #f8f9fa;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }
   
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      min-width: 80px;
    }
   
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
   
    .btn-primary {
      background: #007bff;
      color: white;
    }
   
    .btn-primary:hover:not(:disabled) {
      background: #0056b3;
      transform: translateY(-1px);
    }
   
    .btn-secondary {
      background: #6c757d;
      color: white;
    }
   
    .btn-secondary:hover:not(:disabled) {
      background: #545b62;
    }
   
    .btn-danger {
      background: #dc3545;
      color: white;
    }`]
})

export class CustomLightboxComponent {
  @Input() data!: LightboxData;
  @Input() onSave!: (task: any) => void;
  @Input() onCancel!: () => void;
  @Input() onDelete!: () => void;
  
  localTask: any = {};

  ngOnInit() {
    if (this.data?.task) {
      this.localTask = { ...this.data.task };
    }
  }

  get isNewTask(): boolean {
    return Boolean(this.localTask?.$new);
  }

  onSaveClick() { 
    this.onSave(this.localTask); 
  }
  
  onCancelClick() { 
    this.onCancel(); 
  }
  
  onDeleteClick() { 
    this.onDelete(); 
  }
}
