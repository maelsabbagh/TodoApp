import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../../../core/models/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.css'
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() editClicked = new EventEmitter<Todo>();
  @Output() deleteClicked = new EventEmitter<number>();

  onEdit(): void {
    this.editClicked.emit(this.todo);
  }

  onDelete(): void {
    this.deleteClicked.emit(this.todo.id);
  }
}