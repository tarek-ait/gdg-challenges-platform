# GDG Challenges Platform

A platform for managing challenges created for Google Developer Groups (GDG) events. This application provides a backend API built with Django and a frontend interface built with React and Vite.

## Technologies Used

### Backend
- Python 3.11
- Django 5.1.4
- Django REST Framework 3.14.0
- PostgreSQL (hosted on Render)
- python-dotenv 1.0.1
- python-decouple 3.8
- django-cors-headers 3.14.0

### Frontend
- React 18.3.1
- Vite 6.0.5
- Tailwind CSS 3.4.17
- DaisyUI 4.12.23
- Zustand 5.0.2 (State Management)
- React Router DOM 7.1.1
- Axios 1.7.9
- React Hot Toast 2.4.1

### DevOps
- Docker
- Docker Compose

## Prerequisites

- Docker and Docker Compose installed on your machine
- Git
- A PostgreSQL database (or use the provided connection details)
- Node.js 18+ (if running without Docker)
- Python 3.11 (if running without Docker)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/yourusername/gdg-challenges-platform.git
cd gdg-challenges-platform
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a `.env` file in the backend directory with the following variables:
   ```
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_HOST=your_database_host
   DB_PORT=5432
   ```
   
   Note: You can use the existing database connection details provided in the repository or set up your own PostgreSQL database.

3. If running without Docker, install the Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Navigate to the Django project directory:
   ```bash
   cd challenges_platform
   ```

5. Apply migrations to set up the database:
   ```bash
   python manage.py migrate
   ```

6. Create a superuser to access the admin panel:
   ```bash
   python manage.py createsuperuser
   ```

7. Start the Django development server:
   ```bash
   python manage.py runserver
   ```
   
   The backend API will be available at http://localhost:8000/

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. If running without Docker, install the Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   
   The frontend application will be available at http://localhost:5173/

## Running with Docker

1. Make sure Docker and Docker Compose are installed on your machine.

2. From the root directory of the project, run:
   ```bash
   docker-compose up
   ```

   This will start both the backend and frontend containers.

3. The backend API will be available at http://localhost:8000/
4. The frontend application will be available at http://localhost:5173/

## Application Structure

### Backend Structure

The backend is a Django application with the following structure:

- `challenges_app`: The main Django app containing models, views, and serializers
  - `models.py`: Database models
  - `views/`: Directory containing view modules
  - `serializers/`: Directory containing serializer modules
  - `urls.py`: URL routing

### Frontend Structure

The frontend is a React application with the following structure:

- `src/`: Source code directory
  - `components/`: Reusable UI components
  - `pages/`: Page components
    - `Admin/`: Admin-specific pages
    - `Users/`: User-specific pages
  - `store/`: Zustand state management
  - `lib/`: Utility functions and configurations
  - `constans/`: Constants used throughout the application

## API Endpoints

The backend provides RESTful API endpoints for:

- User authentication
- Challenge management
- Team management
- Submission handling

## Development Notes

- The backend uses Django REST Framework for API development
- The frontend uses Zustand for state management
- CORS is configured to allow the frontend to communicate with the backend
- The application uses PostgreSQL as the database
