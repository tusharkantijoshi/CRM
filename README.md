# Osmium Energy - Contact Management System

A full-stack web application for contact management with role-based access control, built with the MERN stack and modern development practices.

## Features

### Authentication & Authorization
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Role-Based Access Control (RBAC)**: Two user roles with distinct permissions:
  - **Admin**: Full access to create, update, delete contacts and view activity logs
  - **User**: Read-only access to view contacts
- **Persistent Sessions**: Context-based authentication with automatic token rehydration
- **Protected Routes**: Client-side route protection with role-based UI rendering

### Contact Management
- **CRUD Operations**: Complete contact lifecycle management (admin only)
- **Search & Filter**: Real-time search across contact name, email, phone, and company
- **Pagination**: Efficient data loading with customizable page size
- **Status Tracking**: Active/Inactive contact status with visual indicators
- **Contact Details**: Name, email, phone, company, status, and notes

### Activity Logging
- **Comprehensive Audit Trail**: Track all contact creation, updates, and deletions
- **Detailed Change Tracking**: For updates, stores both old and new values
- **User Attribution**: Every action linked to the user who performed it
- **Timestamp Tracking**: Automatic creation and modification timestamps
- **Activity Viewer**: Admin-only dialog to view contact history

### User Experience
- **Responsive Design**: Fully responsive UI for mobile, tablet, and desktop
- **Material-UI**: Modern, accessible components with consistent design
- **Real-time Validation**: Form validation with Zod schemas and React Hook Form
- **Loading States**: Clear feedback during async operations
- **Error Handling**: User-friendly error messages and validation feedback
- **404 Page**: Custom not found page with navigation options

### Security
- **Helmet**: Security headers middleware for Express
- **CORS**: Configured cross-origin resource sharing
- **Input Validation**: Server and client-side validation
- **Password Security**: Bcrypt hashing with salt rounds
- **Protected Endpoints**: JWT verification on all private routes

## Tech Stack

### Client
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Utilities**: Lodash, date-fns, jwt-decode

### Server
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **Security**: Helmet, CORS
- **Language**: ES6+ (ES Modules)

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB (Local instance or MongoDB Atlas)
- npm or yarn package manager

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd osmiumenergy
```

### 2. Server Setup

Navigate to the server directory:
```bash
cd server
```

Install dependencies:
```bash
npm install
```

Create environment file:
```bash
cp .env.example .env
```

Configure environment variables in `.env`:
```env
MONGO_URI=mongodb://localhost:27017/osmiumenergy
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/osmiumenergy

JWT_SECRET=your-secret-key-here
PORT=3000
```

Start the development server:
```bash
npm run dev
```

The server will:
- Connect to MongoDB
- Seed default admin and user accounts
- Start on port 3000 (or your configured PORT)

**Default User Accounts:**
- Admin: `admin@osmiumenergy.com` / `Admin@123`
- User: `user@osmiumenergy.com` / `Admin@123`

### 3. Client Setup

Navigate to the client directory:
```bash
cd client
```

Install dependencies:
```bash
npm install
```

Create environment file:
```bash
cp .env.example .env
```

Configure environment variables in `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

Start the development server:
```bash
npm run dev
```

The client will start at `http://localhost:5173` (or next available port).

## Project Structure

```
osmiumenergy/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API client and endpoints
│   │   ├── components/    # Reusable React components
│   │   ├── context/       # React Context providers
│   │   ├── pages/         # Page components
│   │   ├── types/         # TypeScript type definitions
│   │   └── theme.ts       # MUI theme configuration
│   └── package.json
│
└── server/                # Express backend
    ├── db/
    │   ├── models/        # Mongoose models
    │   └── connection.js  # MongoDB connection
    ├── middleware/        # Express middleware
    ├── modules/           # Feature modules
    │   └── contacts/      # Contact management
    ├── routes/            # Route definitions
    ├── scripts/           # Utility scripts (seed, etc.)
    └── package.json
```

## API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/public/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "user"  // Optional, defaults to "user"
}
```

#### Login
```http
POST /api/public/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

### Contact Endpoints (Protected)

All contact endpoints require `Authorization: Bearer <token>` header.

#### Get All Contacts
```http
GET /api/contacts?page=1&limit=12&search=keyword
```

#### Get Contact by ID
```http
GET /api/contacts/:id
```

#### Create Contact (Admin Only)
```http
POST /api/contacts
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Acme Inc",
  "status": "active",
  "notes": "Important client"
}
```

#### Update Contact (Admin Only)
```http
PUT /api/contacts/:id
Content-Type: application/json

{
  "name": "John Doe Updated",
  "status": "inactive"
}
```

#### Delete Contact (Admin Only)
```http
DELETE /api/contacts/:id
```

#### Get Contact Activity (Admin Only)
```http
GET /api/contacts/:id/activity
```

## NPM Scripts

### Server
- `npm run dev` - Start development server with auto-reload and database seeding
- `npm start` - Start production server with database seeding
- `npm run seed` - Seed default users (admin and user)

### Client
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## User Roles & Permissions

### Admin Role
- ✅ Create new contacts
- ✅ Edit existing contacts
- ✅ Delete contacts
- ✅ View all contacts
- ✅ View activity logs
- ✅ Search and filter contacts

### User Role
- ❌ Cannot create contacts
- ❌ Cannot edit contacts
- ❌ Cannot delete contacts
- ✅ View all contacts (read-only)
- ❌ Cannot view activity logs
- ✅ Search and filter contacts

## Responsive Breakpoints

The application is fully responsive using Material-UI breakpoints:
- **xs** (< 600px): Mobile devices
- **sm** (600px - 900px): Tablets (portrait)
- **md** (900px - 1200px): Tablets (landscape) / Small laptops
- **lg** (1200px+): Desktops

### Mobile Optimizations
- Vertical stacking of UI elements
- Full-width buttons for touch targets
- Hidden email in header to save space
- Single-column contact grid
- Responsive search and action buttons

## Environment Variables

### Server (.env)
```env
MONGO_URI=<mongodb-connection-string>
JWT_SECRET=<your-secret-key>
PORT=3000
```

### Client (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## Development Tips

1. **Hot Reload**: Both client and server support hot reloading during development
2. **Database Seeding**: Server automatically seeds default users on startup
3. **TypeScript**: Client uses TypeScript for type safety
4. **Validation**: Both server (Mongoose) and client (Zod) validate data
5. **Context API**: User authentication state managed with React Context

## Troubleshooting

### Server won't start
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- Verify port 3000 is not already in use

### Client can't connect to server
- Ensure server is running on port 3000
- Check `VITE_API_URL` in client `.env`
- Verify CORS is properly configured

### Authentication issues
- Clear localStorage in browser
- Check JWT_SECRET matches between sessions
- Verify token hasn't expired (30 day expiry)

## License

This project is private and proprietary.

## Contributing

This is a private project. For questions or issues, please contact the development team.
