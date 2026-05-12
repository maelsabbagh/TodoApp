export interface Todo {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  priority: string;
  createdAt: Date;
}

export interface TodoCreateDto {
  title: string;
  description: string;
  priority: number;
}

export interface TodoUpdateDto {
  title: string;
  description: string;
  isCompleted: boolean;
  priority: number;
}