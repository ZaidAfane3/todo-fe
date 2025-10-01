# Todo Frontend

A modern, responsive React frontend for the Todo Microservice application.

## Features

- 🔐 **Authentication**: Login/logout with session management
- ✅ **Todo Management**: Create, read, update, and delete todos
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- 🔄 **Real-time Updates**: Optimistic updates for better UX
- 🐳 **Docker Support**: Easy containerized deployment
- 📱 **Mobile Friendly**: Responsive design that works on all devices

## Tech Stack

- **React 18** - Frontend framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful icons
- **Docker** - Containerization

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend services running (Auth service on port 3001, Todo service on port 3002)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd elm-phase2/code/fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy the example environment file:
   ```bash
   cp env.example .env
   ```

   Update the `.env` file with your service URLs:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:3002
   REACT_APP_AUTH_BASE_URL=http://localhost:3001
   REACT_APP_FRONTEND_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   The app will be available at `http://localhost:3000`

## Docker Usage

### Build and run with Docker

```bash
# Build the Docker image
npm run docker:build

# Run the container
npm run docker:run
```

### Using Docker Compose (Full Stack)

To run the entire microservice stack including the frontend:

```bash
# From the project root
docker-compose up --build
```

This will start:
- PostgreSQL database
- Auth service (port 3001)
- Todo service (port 3002)
- Frontend (port 3000)

## API Integration

The frontend communicates with two backend services:

### Auth Service (`REACT_APP_AUTH_BASE_URL`)
- `POST /login` - User authentication
- `POST /logout` - User logout
- `GET /is-logged-in` - Check authentication status

### Todo Service (`REACT_APP_API_BASE_URL`)
- `GET /to-do` - Get all todos
- `POST /to-do` - Create new todo
- `PUT /to-do/:id` - Update todo
- `DELETE /to-do/:id` - Delete todo

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── TodoForm.js     # Form for creating/editing todos
│   ├── TodoItem.js     # Individual todo item
│   ├── TodoList.js     # List of todos
│   └── UserProfile.js  # User profile display
├── hooks/              # Custom React hooks
│   ├── useAuth.js      # Authentication state management
│   └── useTodos.js     # Todo state management
├── pages/              # Page components
│   ├── Dashboard.js    # Main todo dashboard
│   └── Login.js        # Login page
├── services/           # API service functions
│   └── api.js          # Axios configuration and API calls
├── App.js              # Main app component with routing
├── App.css             # Custom styles
└── index.js            # App entry point
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App
- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run Docker container

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_BASE_URL` | Todo service URL | `http://localhost:3002` |
| `REACT_APP_AUTH_BASE_URL` | Auth service URL | `http://localhost:3001` |
| `REACT_APP_FRONTEND_URL` | Frontend URL | `http://localhost:3000` |

## Development

### Code Style

- Uses ESLint with Create React App defaults
- Tailwind CSS for styling
- Component-based architecture
- Custom hooks for state management

### Adding New Features

1. Create components in `src/components/`
2. Add custom hooks in `src/hooks/` if needed
3. Update routing in `App.js` for new pages
4. Add API calls to `src/services/api.js`

## Demo Credentials

- **Username**: admin
- **Password**: password

## Contributing

1. Follow the existing code style
2. Add proper error handling
3. Test with both backend services running
4. Update documentation as needed

## License

MIT License - see LICENSE file for details
