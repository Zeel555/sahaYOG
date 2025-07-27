# SahaYOG Project

SahaYOG is a collaborative raw material sourcing platform designed specifically for street food vendors. The application aims to streamline the process of sourcing ingredients, connecting vendors with suppliers, and facilitating order management.

## Objectives

- To provide a user-friendly interface for street food vendors to find and connect with suppliers.
- To enable suppliers to list their products and manage orders efficiently.
- To facilitate communication between vendors and suppliers for better collaboration.

## Features

- **User Authentication**: Secure login and registration for vendors and suppliers.
- **Supplier Listings**: A comprehensive directory of suppliers with product offerings.
- **Order Management**: Vendors can place orders and track their status.
- **Profile Management**: Users can manage their profiles and view order history.
- **Responsive Design**: A mobile-friendly interface for easy access on the go.

## Project Structure

The project is divided into two main parts: the client (frontend) and the server (backend).

### Client

- **React Application**: Built using React for a dynamic user experience.
- **Components**: Reusable UI components for buttons, forms, and modals.
- **Pages**: Main application pages including home, supplier listings, and order tracking.

### Server

- **Express Application**: Built using Express.js to handle API requests.
- **Controllers**: Business logic for handling user authentication, supplier management, and order processing.
- **Models**: Mongoose models for MongoDB collections.

## Setup Instructions

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB database setup.

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd SahaYOG
   ```

2. Install dependencies for the client:
   ```
   cd client
   npm install
   ```

3. Install dependencies for the server:
   ```
   cd server
   npm install
   ```

### Running the Application

1. Start the server:
   ```
   cd server
   npm start
   ```

2. Start the client:
   ```
   cd client
   npm start
   ```

The application will be running on `http://localhost:3000` for the client and `http://localhost:5000` for the server.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.