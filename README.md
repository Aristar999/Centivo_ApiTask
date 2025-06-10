# User API Task

This project is a Node.js Express API that connects to a MongoDB database to retrieve user data.
It provides an endpoint to fetch a user's details by their unique ID, but only if their age is greater than 21.

## Features

- Connects to MongoDB using the official driver (`mongoose`)
- GET endpoint at `/users/:id` to fetch user data
- Only returns users with `age > 21`
- Handles invalid user ID formats gracefully
- Returns 404 if user is not found or age requirement is not met

## My Approach

- **Environment Setup**
  - Set up the Express server and connected it to MongoDB using Mongoose.
  - Used environment variables for configuration.
- **Endpoint Implementation**
  - Implemented a GET endpoint at `/users/:id`.
  - The endpoint supports both numeric user IDs and MongoDB ObjectIds.
  - Returns the user document if found and the age condition is satisfied.
  - Returns a 400 status for invalid user ID formats.
  - Returns a 404 status if no user matches or the age condition is not met.
  - Included error handling for robustness and clarity.
