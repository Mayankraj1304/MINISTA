# MINISTA

A fully functional Social Media platform for social interactions.

## Backend Setup

This project uses Node.js, Express, and MongoDB for the backend.

### Prerequisites

- Node.js installed
- MongoDB installed and running locally

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Run `npm install` to install dependencies

### Environment Variables

Create a `.env` file in the root directory with:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/minista
```

### Running the Server

- Development: `npm run dev` (requires nodemon)
- Production: `npm start`

The server will start on port 5000 and connect to MongoDB.
