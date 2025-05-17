# Fake Store

A modern e-commerce application built with React, TypeScript, and Firebase authentication.

## Overview

Fake Store is a full-featured e-commerce platform that allows users to browse products, add items to cart, manage their shopping experience, and complete purchases. The application features user authentication, product management, and a responsive design for all devices.

## Features

- **User Authentication**
  - Sign up with email and password
  - Sign in with existing credentials
  - Profile management
  - Secure authentication via Firebase

- **Product Management**
  - Browse product catalog
  - Filter products by category
  - Search functionality
  - Product details view

- **Shopping Experience**
  - Add products to cart
  - Adjust quantities
  - Remove items
  - Persistent shopping cart

- **Checkout Process**
  - Order summary
  - Shipping information
  - Payment processing

- **Responsive Design**
  - Mobile-friendly interface
  - Adaptive layouts for all screen sizes

## Technology Stack

- **Frontend**
  - React
  - TypeScript
  - Context API for state management
  - React Router for navigation

- **Authentication**
  - Firebase Authentication

- **Styling**
  - CSS/SCSS
  - Responsive design principles

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fake-store.git
```

2. Navigate to the project directory:
```bash
cd fake-store
```

3. Install dependencies:
```bash
npm install
```

4. Create a `.env` file in the root directory with your Firebase configuration:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

5. Start the development server:
```bash
npm start
```

## Project Structure

```
fake-store/
├── public/
├── src/
│   ├── components/
│   │   ├── Cart/
│   │   ├── Checkout/
│   │   ├── Layout/
│   │   ├── Products/
│   │   └── User/
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── ProductContext.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── ProductDetails.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Cart.tsx
│   │   └── Checkout.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── firebase.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   ├── App.tsx
│   └── index.tsx
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

## Authentication Flow

The application uses Firebase Authentication for user management. The authentication flow is handled through the `AuthContext` which provides:

- User state management
- Sign-in functionality
- Sign-up with email and password
- Sign-out capability
- Profile updates

## Deployment

### Build for Production

```bash
npx expo start
```

### Deploy to Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase:
```bash
firebase init
```

4. Deploy to Firebase:
```bash
firebase deploy
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Firebase](https://firebase.google.com/) for authentication services
- [React](https://reactjs.org/) for the UI library
- [TypeScript](https://www.typescriptlang.org/) for type safety

---

For any questions or support, please open an issue in the repository.