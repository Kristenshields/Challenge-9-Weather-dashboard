// Original code
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
// Import the routes
import routes from './routes/index.js';
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use(routes);
// Serve static files
app.use(express.static('../client/dist'));
// Middleware for parsing JSON

// Connect the routes
// Start the server

// TODO: Serve static files of entire client dist folder
// TODO: Implement middleware for parsing JSON and urlencoded form data
// TODO: Implement middleware to connect the routes
// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));