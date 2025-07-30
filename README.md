# Tour Package Management System

A web application for managing tour packages, allowing admins to create and manage travel packages and schedules, and users to browse packages and submit enquiries via a REST API. This project is part of a machine test for a recruitment process.

## Project Structure

tour-package-management/
├── back-end/                # Node.js + Express backend
│   ├── node_modules/
│   ├── prisma/             # Prisma schema & migrations(ORM)
│   ├── src/                # Backend source code
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── main.ts        # Backend entry point
│   ├── .env               # Environment variables
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json      # TypeScript configuration
├── front-end/              # React + Vite + Tailwind frontend
│   ├── node_modules/
│   ├── public/            # Static assets
│   ├── src/               # Frontend source code
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── main.tsx       # Frontend entry point
│   ├── .env
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── vite.config.js
│   └── eslint.config.js
└── README.md              # Project overview



## Tech Stack
- **Frontend**:
  - **React.js**: JavaScript library for building user interfaces.
  - **Vite**: Fast frontend build tool for development and production.
  - **Tailwind CSS**: Utility-first CSS framework for styling.
- **Backend**:
  - **Node.js**: JavaScript runtime for server-side logic.
  - **Express.js**: Web framework for building RESTful APIs.
  - **MongoDB Atlas**: Cloud-hosted MongoDB database for data storage.
  - **AWS S3**: Cloud storage for package and schedule photos.
  - **JWT**: JSON Web Tokens for secure admin authentication.
- **Other Tools**:
  - **Git**: Version control system.
  - **GitHub**: Hosting for Git repository.

## Features
### Admin Panel
- **Countries & Cities Management**: Add/edit/delete countries and cities.
- **Tour Packages**: Create/edit/delete packages with title, source/destination, description, terms, and photos.
- **Package Schedules**: Manage schedules with title, dates, amount, and photos, linked to packages.
- **Enquiries Management**: View customer enquiries with details like name, email, phone, message, and related package/schedule.

### Customer-Facing Website
- **Home Page**: Banner carousel configurable from admin panel.
- **Packages List Page**: Displays packages in a grid/list with name, description, photos, and amount.
- **Single Package Details Page**: Shows package and schedule details with an enquiry form (via REST API).
- **Thank You Page**: Displayed after enquiry form submission.

## Setup Instructions
### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- AWS S3 bucket and credentials
- Git

### Backend Setup
1. Navigate to `back-end/`:
   ```bash
   cd back-end




   Install dependencies:
bashnpm install

Create a .env file in back-end/ with the following:
textPORT=5000
MONGODB_URI=<your_mongodb_atlas_connection_string>
AWS_ACCESS_KEY_ID=<your_aws_access_key>
AWS_SECRET_ACCESS_KEY=<your_aws_secret_key>
AWS_S3_BUCKET=<your_s3_bucket_name>
JWT_SECRET=<your_jwt_secret>

Run the backend server:
bashnpm run dev


Frontend Setup

Navigate to front-end/:
bashcd front-end

Install dependencies:
bashnpm install

Create a .env file in front-end/ with:
textVITE_API_URL=http://localhost:5000/api

Run the frontend development server:
bashnpm run dev


Running the Application

Start the backend server (npm run dev in back-end/).
Start the frontend server (npm run dev in front-end/).
Access the frontend at http://localhost:5173 (default Vite port).
Admin login/logout and country creation APIs are available at http://localhost:5000/api.