import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../../../core/services/todo.service';
import { Todo, TodoCreateDto, TodoUpdateDto } from '../../../../core/models/todo.model';
import { PagedResult } from '../../../../core/models/paged-result.model';
import { QueryParameters } from '../../../../core/models/query-parameters.model';
import { TodoItemComponent } from '../todo-item/todo-item';
import { TodoFormComponent } from '../todo-form/todo-form';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoItemComponent, TodoFormComponent, ConfirmDialogComponent],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css'
})
export class TodoListComponent implements OnInit {
  pagedResult: PagedResult<Todo> | null = null;
  queryParams: QueryParameters = { pageNumber: 1, pageSize: 5 };
  searchTerm: string = '';

  showForm: boolean = false;
  showConfirmDialog: boolean = false;
  todoToEdit: Todo | null = null;
  todoToDeleteId: number | null = null;
  errorMessage: string = '';

  constructor(private todoService: TodoService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.queryParams.searchTerm = this.searchTerm || undefined;
    this.todoService.getAll(this.queryParams).subscribe({
      next: (result) => {
        this.pagedResult = result;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch(): void {
    this.queryParams.pageNumber = 1;
    this.loadTodos();
  }

  onPageChange(page: number): void {
    this.queryParams.pageNumber = page;
    this.loadTodos();
  }

  openCreateForm(): void {
    this.todoToEdit = null;
    this.showForm = true;
  }

  openEditForm(todo: Todo): void {
    this.todoToEdit = todo;
    this.showForm = true;
  }

  onFormSubmitted(dto: TodoCreateDto | TodoUpdateDto): void {
    if (this.todoToEdit) {
      this.todoService.update(this.todoToEdit.id, dto as TodoUpdateDto).subscribe({
        next: () => { this.showForm = false; this.loadTodos(); },
        error: (err) => { this.errorMessage = err.message; this.cdr.detectChanges(); }
      });
    } else {
      this.todoService.create(dto as TodoCreateDto).subscribe({
        next: () => { this.showForm = false; this.loadTodos(); },
        error: (err) => { this.errorMessage = err.message; this.cdr.detectChanges(); }
      });
    }
  }

  onFormCancelled(): void {
    this.showForm = false;
    this.todoToEdit = null;
  }

  onDeleteClicked(id: number): void {
    this.todoToDeleteId = id;
    this.showConfirmDialog = true;
  }

  onDeleteConfirmed(): void {
    if (this.todoToDeleteId === null) return;
    this.todoService.delete(this.todoToDeleteId).subscribe({
      next: () => {
        this.showConfirmDialog = false;
        this.todoToDeleteId = null;
        this.loadTodos();
      },
      error: (err) => { this.errorMessage = err.message; this.cdr.detectChanges(); }
    });
  }

  onDeleteCancelled(): void {
    this.showConfirmDialog = false;
    this.todoToDeleteId = null;
  }

  clearError(): void {
    this.errorMessage = '';
  }
}