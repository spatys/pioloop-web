# Pioloop Frontend - Next.js Application

## 🎨 Frontend Architecture

### Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Lucide React** for icons
- **React Hook Form** with Zod validation
- **React Query** for server state
- **Framer Motion** for animations
- **React Hot Toast** for notifications

### Project Structure

```
Pioloop-web/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   ├── globals.css        # Global styles
│   │   ├── api/               # API routes
│   │   └── register/          # Registration pages
│   ├── components/             # React components
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   └── layout/            # Layout components
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── core/                  # Core business logic
│   │   ├── types/             # TypeScript types
│   │   │   ├── index.ts
│   │   │   ├── User.ts
│   │   │   ├── Property.ts
│   │   │   ├── Reservation.ts
│   │   │   ├── Payment.ts
│   │   │   ├── Contract.ts
│   │   │   ├── Invoice.ts
│   │   │   ├── Money.ts
│   │   │   ├── Api.ts
│   │   │   ├── Forms.ts
│   │   │   ├── Filters.ts
│   │   │   ├── Dashboard.ts
│   │   │   ├── Notification.ts
│   │   │   ├── Theme.ts
│   │   │   └── Loading.ts
│   │   ├── repositories/      # Data access layer
│   │   │   ├── interfaces/    # Repository interfaces
│   │   │   │   ├── IAuthRepository.ts
│   │   │   │   ├── IPropertyRepository.ts
│   │   │   │   ├── IReservationRepository.ts
│   │   │   │   ├── IContractRepository.ts
│   │   │   │   ├── IInvoiceRepository.ts
│   │   │   │   └── IPaymentRepository.ts
│   │   │   ├── implementations/ # Repository implementations
│   │   │   │   ├── AuthRepository.ts
│   │   │   │   ├── PropertyRepository.ts
│   │   │   │   ├── ReservationRepository.ts
│   │   │   │   ├── ContractRepository.ts
│   │   │   │   ├── InvoiceRepository.ts
│   │   │   │   └── PaymentRepository.ts
│   │   │   └── index.ts
│   │   ├── services/          # Business logic layer
│   │   │   ├── interfaces/    # Service interfaces
│   │   │   │   ├── IAuthService.ts
│   │   │   │   ├── IPropertyService.ts
│   │   │   │   ├── IBookingService.ts
│   │   │   │   ├── IContractService.ts
│   │   │   │   ├── IInvoiceService.ts
│   │   │   │   └── IPaymentService.ts
│   │   │   ├── implementations/ # Service implementations
│   │   │   │   ├── AuthService.ts
│   │   │   │   ├── PropertyService.ts
│   │   │   │   ├── BookingService.ts
│   │   │   │   ├── ContractService.ts
│   │   │   │   ├── InvoiceService.ts
│   │   │   │   └── PaymentService.ts
│   │   │   └── index.ts
│   │   └── utils/             # Utility functions
│   │       └── index.ts
│   ├── context/               # React context
│   │   └── AuthContext.tsx
│   ├── hooks/                 # Custom React hooks
│   │   └── useAuth.ts
│   ├── layouts/               # Layout components
│   │   ├── MainLayout.tsx
│   │   └── AuthLayout.tsx
│   └── modules/               # Feature modules
│       ├── auth/              # Authentication module
│       │   ├── components/
│       │   │   ├── LoginForm.tsx
│       │   │   ├── RegisterForm.tsx
│       │   │   ├── MultiStepRegisterForm.tsx
│       │   │   ├── EmailStep.tsx
│       │   │   ├── VerificationStep.tsx
│       │   │   └── ProfileStep.tsx
│       │   └── pages/
│       ├── properties/        # Properties module
│       │   ├── components/
│       │   │   └── PropertyCard.tsx
│       │   └── pages/
│       ├── bookings/          # Bookings module
│       │   ├── components/
│       │   │   └── BookingForm.tsx
│       │   └── pages/
│       └── dashboard/         # Dashboard module
│           ├── components/
│           │   └── DashboardStats.tsx
│           └── pages/
├── public/                    # Static assets
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── postcss.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Navigate to the frontend directory:**

   ```bash
   cd Pioloop-web
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create environment file:**

   ```bash
   cp .env.example .env.local
   ```

4. **Update environment variables:**

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`.

## 🎨 Design System

### Color Palette

The application uses a consistent violet color palette:

- **Primary**: `#a855f7` (violet-500)
- **Secondary**: `#9333ea` (violet-600)
- **Accent**: `#7c3aed` (violet-700)

### Components

- **Button**: Multiple variants (primary, outline, ghost)
- **Input**: Form inputs with validation states
- **Card**: Property cards with hover effects
- **Modal**: Overlay dialogs for forms
- **Loading**: Spinner and skeleton components

## 📱 Responsive Design

The frontend is fully responsive and optimized for:

- **Desktop** (1024px+)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🔧 Configuration

### TailwindCSS

The project uses TailwindCSS with custom configuration:

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#faf5ff",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7c3aed",
        },
      },
    },
  },
};
```

### TypeScript

Strict TypeScript configuration for type safety:

```json
{
  "compilerOptions": {
    "strict": true,
    "jsx": "preserve",
    "lib": ["dom", "dom.iterable", "es6"]
  }
}
```

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

## 📦 Build & Deployment

### Development Build

```bash
npm run build
```

### Production Build

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

## 🔐 Authentication

### Features

- JWT token management
- Role-based access control
- Protected routes
- Auto-logout on token expiry
- Remember me functionality

### Context Usage

```typescript
import { useAuth } from "../hooks/useAuth";

const { user, login, logout, loading } = useAuth();
```

## 📊 State Management

### React Query

For server state management:

```typescript
import { useQuery, useMutation } from "@tanstack/react-query";

const { data, isLoading } = useQuery({
  queryKey: ["properties"],
  queryFn: () => propertyService.getProperties(),
});
```

### Local State

For component state:

```typescript
import { useState } from "react";

const [isOpen, setIsOpen] = useState(false);
```

## 🎯 Features

### Core Functionality

- ✅ User Registration & Authentication
- ✅ Property Browsing & Search
- ✅ Reservation Management
- ✅ Payment Processing
- ✅ Invoice Management
- ✅ Contract Management
- ✅ Responsive Design
- ✅ Dark/Light Theme Support

### User Experience

- ✅ Loading states
- ✅ Error boundaries
- ✅ Form validation
- ✅ Toast notifications
- ✅ Smooth animations
- ✅ Accessibility features

## 🛠️ Development

### Code Style

- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Component documentation

### Git Workflow

1. Create feature branch
2. Make changes
3. Add tests
4. Submit pull request

## 📈 Performance

### Optimizations

- Next.js Image optimization
- Code splitting
- Lazy loading
- Bundle analysis
- Performance monitoring

### Lighthouse Scores

- Performance: 95+
- Accessibility: 100
- Best Practices: 95+
- SEO: 100

---

**Pioloop Frontend** - Modern, responsive, and user-friendly real estate platform.
