# re-estore

A full-stack, responsive e-commerce web application built with modern web technologies. This project features a robust backend API powered by Node.js and Express, coupled with a fast and interactive frontend built using React and Vite. It includes secure authentication, payment processing via Stripe, and containerized deployment with Docker.

## 🌐 Live Demo

**[Visit Re-Wild Oasis](https://re-estore.nmv-apps.in)**

## 🚀 Key Features

- **User Authentication**: Secure signup, login, and JWT-based session management.
- **Product Catalog**: Browse and view detailed product information.
- **Shopping Cart**: Seamlessly add items to the cart and manage quantities.
- **Secure Checkout**: Integrated with Stripe for secure and reliable payment processing.
- **Order Management**: Track past orders and view order details.
- **Responsive Design**: Beautiful and fluid UI across all devices, styled with Tailwind CSS.
- **Containerization**: Fully containerized with Docker and Docker Compose for easy setup and deployment.

## 💻 Tech Stack

### Frontend

- **React 18** (Vite)
- **Tailwind CSS** (Styling & Responsive Design)
- **React Query** (Data Fetching & Caching)
- **Framer Motion** (Animations)
- **React Router** (Navigation)
- **Axios** (API Client)

### Backend

- **Node.js & Express.js**
- **MongoDB & Mongoose** (Database & ODM)
- **Stripe** (Payment Gateway integration)
- **JWT & bcryptjs** (Authentication & Security)
- **Joi** (Data Validation)

### Infrastructure & Tools

- **Docker & Docker Compose**
- **pnpm** (Package Manager)
- **ESLint & Prettier** (Code Formatting & Quality)

## 🛠️ Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- [Docker & Docker Compose](https://www.docker.com/get-started) (Recommended)
- [Node.js](https://nodejs.org/) (v22+)
- [pnpm](https://pnpm.io/) (v10+)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/re-estore.git
   cd re-estore
   ```

2. **Environment Variables**

   Configure the required environment variables for both the frontend and backend.

   **Frontend:**

   ```bash
   cd frontend
   cp .env.example .env
   # Update the values in .env as needed
   cd ..
   ```

   **Backend:**

   ```bash
   cd backend
   cp .env.example mbm.env
   # Update the values in mbm.env (MongoDB URI, Stripe Keys, JWT Secret, etc.)
   cd ..
   ```

### 🐳 Running with Docker (Recommended)

The easiest way to run the application is using Docker.

```bash
# From the root directory, build and start the containers
docker-compose up --build
```

- Frontend will be accessible at: `http://localhost:5173`
- Backend API will be accessible at: `http://localhost:3000`

### 💻 Running Manually (Without Docker)

If you prefer to run the application natively:

1. **Start the Backend server**

   ```bash
   cd backend
   pnpm install
   pnpm run dev
   ```

2. **Start the Frontend development server**
   ```bash
   cd frontend
   pnpm install
   pnpm run dev
   ```

## 📁 Project Structure

```text
re-estore/
├── backend/            # Express REST API
│   ├── src/            # Controllers, routes, models, middleware
│   ├── Dockerfile      # Backend Docker configuration
│   └── package.json
├── frontend/           # React Application
│   ├── src/            # Components, pages, hooks, utils
│   ├── Dockerfile      # Frontend Docker configuration
│   └── package.json
└── docker-compose.yaml # Orchestrates frontend and backend containers
```
