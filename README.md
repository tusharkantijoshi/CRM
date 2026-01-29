# OsmiumEnergy

A web application for contact management, built with the MERN stack.

## Features

-   **Authentication**: Secure user login and registration using JWT and bcrypt.
-   **Contact Management**: Create, read, update, and delete contacts.
-   **Dashboard**: Validated forms, search functionality, and pagination.
-   **Secure**: Protected routes and API endpoints.

## Tech Stack

### Client
-   **Framework**: React (Vite)
-   **UI Library**: Material UI (MUI)
-   **Language**: TypeScript
-   **State/Forms**: React Hook Form, Zod, Axios

### Server
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB (Mongoose)
-   **Authentication**: JWT, bcryptjs

## Prerequisites

-   Node.js (v18+ recommended)
-   MongoDB (Local or Atlas)

## Getting Started

### Server Setup

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    Copy the example `.env` file and update the values.
    ```bash
    cp .env.example .env
    ```
    *Make sure to set your `MONGO_URI` and `JWT_SECRET`.*

4.  Start the development server:
    ```bash
    npm run dev
    ```
    The server will start on port 3000 (default) and seed the admin user.

### Client Setup

1.  Navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    Copy the example `.env` file.
    ```bash
    cp .env.example .env
    ```
    *Ensure `VITE_API_URL` points to your running server (e.g., `http://localhost:3000/api`).*

4.  Start the development server:
    ```bash
    npm run dev
    ```
    The client will start at `http://localhost:5173`.

## scripts

### Server
-   `npm run dev`: Runs the server in watch mode.
-   `npm run start`: Runs the server in production mode.
-   `npm run seed`: Seeds the database with an initial admin user.

### Client
-   `npm run dev`: Starts the Vite development server.
-   `npm run build`: Builds the application for production.
-   `npm run lint`: Runs ESLint.
