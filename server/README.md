# SahaYOG Backend Documentation

## Overview
SahaYOG is a collaborative raw material sourcing platform designed specifically for street food vendors. The application aims to streamline the process of sourcing ingredients, connecting vendors with suppliers, and managing orders efficiently.

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication

## Project Structure
The server-side of the application is structured as follows:

```
server
├── src
│   ├── controllers      # Business logic for routes
│   ├── models           # Mongoose models for MongoDB collections
│   ├── routes           # Route definitions for the Express application
│   ├── middleware       # Middleware functions for authentication and validation
│   ├── utils            # Utility functions for various tasks
│   └── index.js        # Entry point for the backend application
├── package.json         # Backend dependencies and scripts
└── README.md            # Documentation for the backend
```

## Setup Instructions
1. **Clone the repository**
   ```
   git clone <repository-url>
   cd SahaYOG/server
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root of the server directory and add the following variables:
   ```
   MONGODB_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   ```

4. **Run the server**
   ```
   npm start
   ```

## API Endpoints
The backend provides several API endpoints for the frontend to interact with. These include:
- User authentication (login, registration)
- Supplier management (CRUD operations)
- Order processing (create, update, retrieve orders)

## Contribution
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.