import { Routes } from '@angular/router';
import { TodoListComponent } from './features/todos/components/todo-list/todo-list';
import { LoginComponent } from './features/auth/components/login/login';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: TodoListComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];