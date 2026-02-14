
# Admin Dashboard Panel

## Overview
A Staff-Level production-ready Admin Dashboard for an e-commerce system. Built with React 18, TypeScript, Tailwind CSS, ShadCN UI, and TanStack Query.
Designed for scalability, performance, and clean architecture.

## Tech Stack
- **Framework:** React 18 + Vite
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS + ShadCN UI (Radix UI)
- **State Management:** Zustand (Auth, Settings, Sidebar) + TanStack Query (Server State)
- **Form Handling:** React Hook Form + Zod
- **Networking:** Axios with robust Interceptors (Token Refresh)
- **Charts:** Recharts
- **Icons:** Lucide React

## Features
- **Authentication**: JWT based auth with automatic token refresh on 401. Session persistence.
- **Dashboard**: Real-time stats, interactive charts (Pie, Bar), recent products.
- **Product Management**:
    - Server-side pagination, debounced search, category filtering.
    - Optimistic updates for mutations (Delete).
    - Add/Edit products with complex form validation.
    - Cloudinary Image Upload (Thumbnail + Gallery).
- **User Management**: Read-only user list with details modal.
- **Settings**: Theme toggle (Light/Dark/System), Table density control, Sidebar config.
- **Architecture**: Clean separation of concerns (UI / Service / Store / Hooks).
- **UX**: Skeletons, Loading states, Toasts, Responsive Layout.

## Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file (see `.env.example`).
4. Run development server:
   ```bash
   npm run dev
   ```

## Environment Variables
- `VITE_API_BASE_URL`: Base URL for the API (default: `https://dummyjson.com`)
- `VITE_CLOUDINARY_CLOUD_NAME`: Cloudinary Cloud Name
- `VITE_CLOUDINARY_UPLOAD_PRESET`: Cloudinary Upload Preset (Unsigned)

## Key Architecture Decisions
- **Axios Interceptors**: Centralized error handling and token refresh logic in `lib/axios.ts`. This ensures silent session renewal without user interruption.
- **TanStack Query**: Used for all server state to handle caching, deduping, and revalidation. Simplifies `useEffect` chains.
- **Zustand**: Used for global client-only state (Auth User, Theme preferences). Lighter than Redux.
- **Optimistic Updates**: Implemented for Product Deletion to provide instant feedback.

## Tradeoffs
- **DummyJSON**: The backend is mocked via DummyJSON. Some complex filters (like stock range) are simulated or limited by API capabilities.
- **Cloudinary Unsigned Upload**: Used for simplicity. In a real production app, signed uploads via backend generation would be more secure.
