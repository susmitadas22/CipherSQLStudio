# CipherSQLStudio

> A browser-based SQL learning platform where students practice SQL queries against pre-configured assignments with real-time execution and intelligent AI hints.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Data Flow](#data-flow)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)

---

## 🎯 Overview

CipherSQLStudio is an interactive SQL learning platform designed to help students master SQL through hands-on practice. The platform provides:

- **Pre-configured SQL assignments** with varying difficulty levels
- **Real-time query execution** against a PostgreSQL sandbox database
- **Intelligent AI hints** (not solutions) powered by LLM APIs
- **Mobile-first responsive design** built with vanilla SCSS
- **Optional user authentication** to track progress

**Important**: This is NOT a database creation tool. All assignments and sample data are pre-inserted by administrators.

---

## ✨ Features

### Core Features (90%)

1. **Assignment Listing Page**
   - View all available SQL assignments
   - Filter by difficulty (Easy, Medium, Hard)
   - See assignment tags and descriptions

2. **Assignment Attempt Interface**
   - Question panel with requirements
   - Sample data viewer showing table schemas
   - Monaco Editor for SQL query writing
   - Real-time results display
   - AI-powered hint system

3. **Query Execution Engine**
   - Secure SQL query execution
   - Query validation and sanitization
   - Error handling and feedback
   - Execution time tracking

### Optional Features (10%)

- User authentication (Login/Signup)
- Save and track query attempts
- View attempt history

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React.js 18
- **Styling**: Vanilla SCSS (mobile-first approach)
- **Code Editor**: Monaco Editor
- **HTTP Client**: Axios
- **Routing**: React Router v6

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Sandbox Database**: PostgreSQL (for query execution)
- **Persistence Database**: MongoDB Atlas (for assignments, users, attempts)
- **Security**: Helmet, express-rate-limit, express-validator
- **Authentication**: JWT, bcrypt

### LLM Integration
- Supports OpenAI GPT or Google Gemini
- Configured via environment variables
- Prompt-engineered to provide hints, not solutions

---

## 📁 Project Structure

```
CipherSQLStudio/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB & PostgreSQL connections
│   │   ├── models/
│   │   │   ├── Assignment.js        # Assignment schema
│   │   │   ├── User.js              # User schema (optional)
│   │   │   └── Attempt.js           # Attempt schema (optional)
│   │   ├── routes/
│   │   │   ├── assignments.js       # Assignment routes
│   │   │   ├── query.js             # Query execution & hints
│   │   │   ├── auth.js              # Authentication routes
│   │   │   └── attempts.js          # Attempt history routes
│   │   ├── services/
│   │   │   ├── queryExecutor.js     # SQL execution & validation
│   │   │   └── llmService.js        # LLM hint generation
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT authentication
│   │   ├── scripts/
│   │   │   └── seedAssignments.js   # Database seeding script
│   │   └── server.js                # Express app entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header/              # Navigation header
│   │   │   ├── AssignmentCard/      # Assignment card component
│   │   │   ├── SQLEditor/           # Monaco editor wrapper
│   │   │   ├── ResultsPanel/        # Query results display
│   │   │   └── SampleDataViewer/    # Table schema viewer
│   │   ├── pages/
│   │   │   ├── AssignmentList/      # Assignment listing page
│   │   │   ├── AssignmentAttempt/   # Assignment attempt page
│   │   │   └── Auth/                # Login & Signup pages
│   │   ├── services/
│   │   │   ├── api.js               # Axios instance
│   │   │   └── index.js             # API service functions
│   │   ├── styles/
│   │   │   ├── _variables.scss      # SCSS variables
│   │   │   ├── _mixins.scss         # SCSS mixins
│   │   │   └── main.scss            # Global styles
│   │   ├── App.js                   # Main app component
│   │   └── index.js                 # React entry point
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **MongoDB Atlas** account (or local MongoDB)
- **OpenAI API Key** or **Google Gemini API Key**

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd CipherSQLStudio
```

### Step 2: Backend Setup

```bash
cd backend
npm install
```

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Configure your `.env` file:

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ciphersqlstudio

# PostgreSQL
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=your_password
PG_DATABASE=sql_sandbox

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key

# LLM Provider (openai or gemini)
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-key
# OR
GEMINI_API_KEY=your-gemini-key

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Step 3: Database Seeding

Seed the databases with sample assignments:

```bash
npm run seed
```

This will:
- Create PostgreSQL tables (employees, customers, orders)
- Insert sample data into PostgreSQL
- Create assignments in MongoDB

### Step 4: Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Configure your `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 5: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The application will open at `http://localhost:3000`

---

## 🔄 Data Flow

### Query Execution Flow

```
User writes SQL query in Monaco Editor
          ↓
User clicks "Execute Query" button
          ↓
Frontend sends POST to /api/query/execute
          ↓
Backend validates & sanitizes SQL query
          ↓
Query executed against PostgreSQL sandbox
          ↓
Results/errors returned to backend
          ↓
Response sent back to frontend
          ↓
Results displayed in ResultsPanel component
          ↓
(Optional) Attempt saved to MongoDB if user authenticated
```

### Hint Generation Flow

```
User clicks "Get Hint" button
          ↓
Frontend sends POST to /api/query/hint with assignmentId
          ↓
Backend fetches assignment question from MongoDB
          ↓
Backend sends prompt to LLM API (OpenAI/Gemini)
          ↓
LLM generates hint (not solution) based on prompt engineering
          ↓
Hint returned to backend
          ↓
Response sent back to frontend
          ↓
Hint displayed in hint box
```

---

## 🔐 Environment Variables

### Backend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `PG_HOST` | PostgreSQL host | `localhost` |
| `PG_PORT` | PostgreSQL port | `5432` |
| `PG_USER` | PostgreSQL username | `postgres` |
| `PG_PASSWORD` | PostgreSQL password | `your_password` |
| `PG_DATABASE` | PostgreSQL database name | `sql_sandbox` |
| `LLM_PROVIDER` | LLM provider choice | `openai` or `gemini` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `GEMINI_API_KEY` | Google Gemini API key | `your-key` |
| `JWT_SECRET` | JWT signing secret | `random_secret_string` |

### Frontend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000/api` |

---

## 📖 Usage

### For Students

1. **Browse Assignments**: View all available SQL assignments on the homepage
2. **Select Assignment**: Click on any assignment card to start
3. **View Question**: Read the assignment question and requirements
4. **Check Sample Data**: Review table schemas and sample data
5. **Write Query**: Use the Monaco Editor to write your SQL query
6. **Execute**: Click "Execute Query" to run your query
7. **Get Hints**: Stuck? Click "Get Hint" for AI-powered guidance
8. **Review Results**: See query results or error messages

### For Administrators

To add new assignments, modify the `backend/src/scripts/seedAssignments.js` file and run:

```bash
npm run seed
```

---

## 🔌 API Endpoints

### Assignments

- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/:id` - Get single assignment

### Query Execution

- `POST /api/query/execute` - Execute SQL query
  ```json
  {
    "query": "SELECT * FROM employees",
    "assignmentId": "optional-assignment-id"
  }
  ```

- `POST /api/query/hint` - Get AI hint
  ```json
  {
    "assignmentId": "required-assignment-id",
    "userQuery": "optional-current-query"
  }
  ```

### Authentication (Optional)

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Attempts (Optional)

- `GET /api/attempts` - Get user's attempts (requires auth)
- `GET /api/attempts?assignmentId=:id` - Get attempts for specific assignment

---

## 📱 Mobile-First Responsive Design

The application is built with a mobile-first approach using vanilla SCSS:

- **Breakpoints**: 320px (mobile), 641px (tablet), 1024px (desktop), 1281px (large)
- **SCSS Features**: Variables, mixins, nesting, partials
- **CSS Methodology**: BEM naming convention
- **Touch-Friendly**: All interactive elements sized for mobile touch

---

## 🎨 Design Decisions

### Why Vanilla SCSS?
To demonstrate fundamental CSS/SCSS skills without relying on CSS frameworks.

### Why Monaco Editor?
Professional-grade code editor with SQL syntax highlighting and auto-completion.

### Why Separate Databases?
- **PostgreSQL**: Perfect for SQL query execution and learning
- **MongoDB**: Flexible schema for assignments and user data

### Why LLM Hints?
Provides personalized learning guidance without giving away solutions.

---

## 🔒 Security Features

- **Query Sanitization**: Only SELECT queries allowed
- **SQL Injection Prevention**: Parameterized queries and validation
- **Rate Limiting**: Prevents API abuse
- **Helmet.js**: Security headers
- **JWT Authentication**: Secure user sessions
- **CORS Configuration**: Controlled cross-origin requests
- **Query Timeout**: 5-second maximum execution time

---

## 🧪 Sample Assignments Included

1. **Select All Employees** (Easy) - Basic SELECT statement
2. **Filter High Salary Employees** (Easy) - WHERE clause practice
3. **Count Employees by Department** (Medium) - GROUP BY and aggregate functions
4. **Join Orders with Customers** (Medium) - INNER JOIN practice
5. **Find Top 3 Highest Paid** (Medium) - ORDER BY and LIMIT

---

## 🤝 Contributing

This project is for educational purposes. Feel free to extend and modify as needed.

---

## 📄 License

MIT License

---

## 👨‍💻 Developer Notes


