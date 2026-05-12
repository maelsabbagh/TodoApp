import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo, TodoCreateDto, TodoUpdateDto } from '../../../../core/models/todo.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.css'
})
export class TodoFormComponent implements OnInit {
  @Input() todoToEdit: Todo | null = null;
  @Output() formSubmitted = new EventEmitter<TodoCreateDto | TodoUpdateDto>();
  @Output() formCancelled = new EventEmitter<void>();

  title: string = '';
  description: string = '';
  priority: number = 1;
  isCompleted: boolean = false;

  get isEditMode(): boolean {
    return this.todoToEdit !== null;
  }

  ngOnInit(): void {
    if (this.todoToEdit) {
      this.title = this.todoToEdit.title;
      this.description = this.todoToEdit.description;
      this.priority = this.getPriorityValue(this.todoToEdit.priority);
      this.isCompleted = this.todoToEdit.isCompleted;
    }
  }

  onSubmit(): void {
  if (!this.title.trim()) return;

  const dto: TodoCreateDto | TodoUpdateDto = this.isEditMode
    ? { 
        title: this.title, 
        description: this.description, 
        priority: +this.priority,  // + operator converts string to number
        isCompleted: this.isCompleted 
      }
    : { 
        title: this.title, 
        description: this.description, 
        priority: +this.priority   // + operator converts string to number
      };

  this.formSubmitted.emit(dto);
}

  onCancel(): void {
    this.formCancelled.emit();
  }

  private getPriorityValue(priority: string): number {
    const map: Record<string, number> = { 'Low': 0, 'Medium': 1, 'High': 2 };
    return map[priority] ?? 1;
  }
}