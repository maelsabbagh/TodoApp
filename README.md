# TodoApp

A full-stack Todo List application built with **ASP.NET Core 8** and **Angular 21**, featuring CRUD operations, pagination, search, and Google OAuth SSO.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | ASP.NET Core 8 Web API |
| Frontend | Angular 21 (Standalone Components) |
| Database | SQL Server LocalDB |
| ORM | Entity Framework Core 8 |
| Authentication | Google OAuth 2.0 (SSO) |

---

---

## Prerequisites

Make sure the following are installed on your machine:

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [SQL Server LocalDB](https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb) (comes with Visual Studio)
- [Node.js v18+](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli): `npm install -g @angular/cli`

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/maelsabbagh/TodoApp.git
cd TodoApp
```

### 2. Backend Setup

#### 2.1 Configure the database connection string

Open `backend/TodoApp/appsettings.json` and update the connection string if needed:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=TodoAppDb;Trusted_Connection=True;"
}
```

> If your SQL Server instance has a different name, replace `(localdb)\\mssqllocaldb` with your instance name. You can find your instance name in **SQL Server Object Explorer** inside Visual Studio.

#### 2.2 Configure Google OAuth Client ID

Open `backend/TodoApp/appsettings.Development.json` and add your Google Client ID:

```json
"GoogleAuth": {
  "ClientId": "YOUR_GOOGLE_CLIENT_ID_HERE"
}
```

#### 2.3 Configure allowed frontend origin

Open `backend/TodoApp/appsettings.Development.json` and verify the Angular URL matches your frontend port:

```json
"AllowedOrigins": [ "http://localhost:4200" ]
```

> If Angular runs on a different port, update this value accordingly.

#### 2.4 Run database migrations

Open **Package Manager Console** in Visual Studio and run:

```powershell
Update-Database
```

This creates the `TodoAppDb` database and `Todos` table automatically.

#### 2.5 Run the backend

Open the solution in Visual Studio and press **F5** or click the **Run** button. The API will start at:

> If your backend runs on a different port, note it down — you'll need to update the frontend environment config.

---

### 3. Frontend Setup

#### 3.1 Install dependencies

```bash
cd frontend/todo-app
npm install
```

#### 3.2 Configure environment

Open `frontend/todo-app/src/environments/environment.development.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5246/api',
  googleClientId: 'YOUR_GOOGLE_CLIENT_ID_HERE'
};
```

Update:
- `apiUrl` → if your backend runs on a different port, change `5246` to your port
- `googleClientId` → your Google OAuth Client ID from Google Cloud Console

#### 3.3 Run the frontend

```bash
ng serve
```

The app will be available at `http://localhost:4200`.

---

## API Endpoints

Base URL: `http://localhost:5246/api`

### Todos

| Method | Endpoint | Description |
|---|---|---|
| GET | `/todo` | Get all todos (paginated + search) |
| GET | `/todo/{id}` | Get a single todo by ID |
| POST | `/todo` | Create a new todo |
| PUT | `/todo/{id}` | Update an existing todo |
| DELETE | `/todo/{id}` | Delete a todo |

#### GET /todo — Query Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| pageNumber | int | 1 | Page number |
| pageSize | int | 10 | Items per page (max 50) |
| searchTerm | string | null | Search by title or description |

#### Example Request — Create Todo

```json
POST /api/todo
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "priority": 1
}
```

Priority values: `0` = Low, `1` = Medium, `2` = High

#### Example Response

```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "isCompleted": false,
  "priority": "Medium",
  "createdAt": "2026-05-12T10:00:00Z"
}
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/googleauth/login` | Validate Google ID token and return user info |

#### Example Request

```json
POST /api/googleauth/login
{
  "idToken": "google_id_token_here"
}
```

#### Example Response

```json
{
  "email": "user@gmail.com",
  "name": "John Doe",
  "picture": "https://..."
}
```

---

## Google OAuth Setup

To enable SSO you need a Google OAuth Client ID:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Navigate to **APIs & Services → OAuth consent screen** and configure it
4. Navigate to **Clients → Create Client**
5. Select **Web application**
6. Add `http://localhost:4200` to both:
   - Authorized JavaScript origins
   - Authorized redirect URIs
7. Copy the **Client ID** and add it to:
   - `appsettings.Development.json` → `GoogleAuth:ClientId`
   - `environment.development.ts` → `googleClientId`

---

## Architecture Decisions

- **Layered Architecture** — Controllers → Services → Repositories → Data, each with a single responsibility
- **Repository Pattern** — abstracts data access, making the codebase testable and maintainable
- **DTOs** — entities are never exposed directly to the API; DTOs control what data is sent and received
- **Global Exception Middleware** — centralized error handling instead of try-catch in every controller
- **Generic Pagination** — `PagedResult<T>` and `QueryParameters` are reusable across any future entities
- **Environment Configuration** — API URLs and sensitive config are environment-specific, never hardcoded
- **Functional Guards & Interceptors** — modern Angular 17+ approach using functions instead of classes

---

## Security Notes

- Google tokens are validated server-side using `Google.Apis.Auth` — never trusted blindly
- User info is persisted in `localStorage` for session persistence across refreshes
- In production, HttpOnly cookies with a token refresh flow would be the recommended approach
- HTTPS should be configured at the infrastructure level for production deployments
- CORS is restricted to known frontend origins via configuration

---

## Running Both Together

1. Start the backend from Visual Studio (**F5**)
2. In a separate terminal, navigate to `frontend/todo-app` and run `ng serve`
3. Open `http://localhost:4200` in your browser
4. Sign in with your Google account
5. Start managing your todos!