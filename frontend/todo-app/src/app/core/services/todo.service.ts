import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo, TodoCreateDto, TodoUpdateDto } from '../models/todo.model';
import { PagedResult } from '../models/paged-result.model';
import { QueryParameters } from '../models/query-parameters.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly apiUrl = 'http://localhost:5246/api/todo';

  constructor(private http: HttpClient) {}

  getAll(params: QueryParameters): Observable<PagedResult<Todo>> {
    let httpParams = new HttpParams()
      .set('pageNumber', params.pageNumber)
      .set('pageSize', params.pageSize);

    if (params.searchTerm)
      httpParams = httpParams.set('searchTerm', params.searchTerm);

    return this.http.get<PagedResult<Todo>>(this.apiUrl, { params: httpParams });
  }

  getById(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`);
  }

  create(dto: TodoCreateDto): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, dto);
  }

  update(id: number, dto: TodoUpdateDto): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}