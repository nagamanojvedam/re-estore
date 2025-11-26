# RE-Estore

A modern, full-stack e-commerce platform built with Next.js 15, featuring a complete shopping experience with authentication, product management, order processing, and more.

## 🚀 Features

- **Authentication & Authorization**
  - User registration with email verification
  - JWT-based authentication (access & refresh tokens)
  - Password reset functionality
  - Role-based access control (User/Admin)

- **Product Management**
  - Browse products with search and filtering
  - Product categories and ratings
  - Product reviews and ratings system
  - Wishlist functionality

- **Shopping Experience**
  - Shopping cart management
  - Order placement and tracking
  - Order history
  - Multiple payment status tracking

- **User Features**
  - User profile management
  - Password update
  - Wishlist management
  - Order history and tracking

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend (API Routes)

- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **Joi** - Validation
- **Upstash Redis** - Rate limiting

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd re-estore
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/re-estore

   # JWT
   JWT_SECRET=your-secret-key
   JWT_ACCESS_EXPIRATION=15m
   JWT_REFRESH_EXPIRATION=7d

   # Email (SMTP)
   SMTP_HOST=smtp.mailtrap.io
   SMTP_PORT=2525
   SMTP_USER=your-smtp-user
   SMTP_PASS=your-smtp-password
   EMAIL_FROM=noreply@re-estore.com

   # Redis (for rate limiting)
   UPSTASH_REDIS_REST_URL=your-upstash-url
   UPSTASH_REDIS_REST_TOKEN=your-upstash-token

   # App
   PORT=3000
   NEXT_API_BASE_URL=http://localhost:3000/api
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
re-estore/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── products/     # Product endpoints
│   │   ├── orders/       # Order endpoints
│   │   ├── users/        # User endpoints
│   │   ├── reviews/      # Review endpoints
│   │   └── messages/     # Message endpoints
│   ├── (pages)/          # Application pages
│   └── layout.tsx        # Root layout
├── components/            # React components
├── lib/                  # Utilities and configurations
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom hooks
│   ├── middleware/       # API middleware
│   ├── services/         # API service layer
│   ├── templates/        # Email templates
│   ├── utils/            # Utility functions
│   └── validations/      # Validation schemas
├── models/               # Mongoose models
├── public/               # Static assets
└── .env                  # Environment variables
```

## 🔑 API Routes

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/update-password` - Update password

### Users

- `GET /api/users/me` - Get current user
- `PATCH /api/users/me` - Update current user
- `GET /api/users` - Get all users (admin)
- `GET /api/users/[id]` - Get user by ID (admin)

### Products

- `GET /api/products` - Get all products
- `GET /api/products/[id]` - Get product by ID

### Orders

- `GET /api/orders/me` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get order by ID
- `PATCH /api/orders/[id]` - Update order status (admin)

### Reviews

- `GET /api/reviews/[productId]` - Get user review for product
- `POST /api/reviews` - Create review
- `DELETE /api/reviews/[productId]` - Delete review

### Wishlist

- `GET /api/users/wishlist` - Get user wishlist
- `POST /api/users/wishlist` - Add to wishlist
- `DELETE /api/users/wishlist/[productId]` - Remove from wishlist

## 🧪 Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
```

## 🎨 Features in Detail

### Authentication Flow

- JWT-based authentication with access and refresh tokens
- Secure password hashing with bcryptjs
- Email verification on registration
- Password reset via email
- Token refresh mechanism

### State Management

- React Query for server state
- React Context for global client state
- Local storage for cart persistence

### Form Validation

- Client-side validation with React Hook Form
- Server-side validation with Joi
- Consistent error handling

### Email System

- HTML email templates
- Welcome emails on registration
- Password reset emails
- Order confirmation emails

## 🔒 Security Features

- JWT token authentication
- Password hashing
- Rate limiting with Redis
- Input validation and sanitization
- CORS configuration
- Secure HTTP headers

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For any inquiries, please contact support@re-estore.com
