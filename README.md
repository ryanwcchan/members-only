# Members Forum

This project is a simple Express app that uses passport.js for user authentication. Users can sign up, log in, and create posts.

---

## Features

### User Management
- **Sign-up form**: Users can create accounts by providing their  username, full name, email, password, and confirming their password.
  - Passwords are secured using bcrypt.
- **Login form**: Users can log in to access their own profile information as well as see their own post list.

### Messaging
- **Create posts**: Members can create messages with a title and text content.
- **Delete posts**: Admins and post authors have access to delete posts.

### Role-Based Permissions
- Members can view message authors and dates.
- Admins can view and manage all posts.

---

## Tech Stack
- **Backend**: Express.js
- **Database**: PostgreSQL
- **Authentication**: Passport.js
- **Password Security**: bcrypt
- **Frontend**: EJS (Embedded JavaScript templates)

---

## Getting Started

### Prerequisites
Ensure you have the following installed:
- Node.js
- PostgreSQL
- npm (Node Package Manager)

### Installation
1. Clone this repository:
   ```bash
   git clone (By HTTP or SSH)
   cd members-only
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the PostgreSQL database:
   - Create a database named `club_membership`.
   - Run the provided SQL scripts (if any) or use the models defined in the app to generate tables.
4. Create a `.env` file for environment variables:
   ```
   DATABASE_URL=postgres://<username>:<password>@localhost:5432/club_membership
   SECRET_KEY=<your-secret-key>
   ```
5. Start the application:
   ```bash
   npm start
   ```
6. Visit the app at [http://localhost:3000](http://localhost:3000).
