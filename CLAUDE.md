# ServiceGPT Project Details

## Project Overview
Project Context: AI-Powered Service Provider Directory
1. Introduction & Vision
The project, internally referred to as "Hire Local," is an initiative to create a modern, AI-driven web application designed to simplify the process of finding and contacting local service professionals. The core vision is to move away from traditional, cumbersome directory searches and replace them with an intuitive, conversational interface. Instead of manually filtering through lists, users will be able to describe their needs in natural language, and the platform's AI will provide a curated list of suitable providers, streamlining the connection between consumers and local businesses.

2. Key Stakeholders
Client: Ritesh Pakhare, representing the project's management team. He is responsible for defining the project's vision, managing the budget, and approving the final product.

Developer: Falak, a freelance developer hired to design, develop, and implement the application from the ground up. She is responsible for the technical execution, including UI/UX design, backend development, and AI integration.

3. The Problem
The current methods for finding local service providers (e.g., electricians, plumbers, painters) are often inefficient and time-consuming. Users have to sift through multiple websites, online directories (like Just Dial, Yelp), or search engine results, manually comparing providers and making contact one by one. This process lacks personalization and doesn't easily account for specific user requirements like experience level, availability, or unique job details. The client aims to solve this friction by creating a centralized, intelligent platform that does the heavy lifting for the user.

4. The Proposed Solution
The solution is a web application that leverages the power of OpenAI's GPT models to act as an intelligent assistant. The user journey is designed to be conversational:

A user states their initial need (e.g., "I need an electrician").

The application, through a chat-like interface, asks a series of clarifying questions to gather specific details (location, required experience, availability, etc.).

These answers are compiled into a detailed, structured prompt that is sent to the OpenAI API.

The AI processes the prompt and returns a list of relevant service providers, which are then displayed to the user in a clean, easy-to-read format.

The user can then instantly contact a provider through an integrated WhatsApp messaging feature.

The project also includes a secure administrative backend for the client to monitor the platform's usage, gather analytics on user behavior, and track operational costs like API token consumption.

## Architecture
- **Frontend**: React SPA with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS with custom glassmorphic design
- **State Management**: React hooks (useState, useEffect)
- **Navigation**: Custom screen-based routing system
- **UI Components**: Modular React components with reusable GlassCard wrapper
- **Icons**: Lucide React icon library

**Component Structure**:
- Main App component handles routing between screens
- Separate components for each major screen (Landing, Auth, Dashboard, Chat, Results, etc.)
- Shared components like GlassCard and AnimatedBackground
- Mock data structure for providers and chat sessions

## Technology Stack
- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1 with PostCSS and Autoprefixer
- **Icons**: Lucide React 0.344.0
- **Development Tools**: 
  - ESLint for code linting
  - TypeScript for type safety
  - React Developer Tools (implied)
- **Package Manager**: npm (with lock file)

## Key Features
Based on my analysis of the meeting transcripts, I'll design a comprehensive UI/UX for your local service provider discovery platform. Let me break down all the screens and components:

## **OVERALL DESIGN THEME**
- **Color Scheme**: Modern gradient-based design with primary colors (deep blue #1a365d to bright blue #3182ce), secondary accent (orange #ff6b35), neutral grays, and white backgrounds
- **Typography**: Clean, modern sans-serif fonts (Inter/Poppins style)
- **Design Style**: Glassmorphism elements, subtle shadows, rounded corners, micro-animations
- **Layout**: Mobile-first responsive design with clean white space

---

## **USER-FACING SCREENS**

### **1. Landing/Welcome Screen**
**Components:**
- Hero section with animated gradient background
- App logo and tagline: "Find Local Experts Instantly with AI"
- Two prominent CTA buttons: "Get Started" and "Learn More"
- Feature highlights with icons (AI-powered, Local providers, Instant results)
- Testimonials carousel
- Footer with links

**Mobile**: Single column layout
**Web**: Split layout with hero content left, feature animation right

### **2. Authentication Screen**
**Components:**
- Clean centered card design with subtle shadow
- App logo at top
- Toggle between "Sign In" / "Sign Up"
- Social login buttons:
  - Google login (prominent, with Google icon)
  - Facebook login (with Facebook icon)
- Divider line with "or"
- Traditional email/password form (minimal fields)
- "Forgot Password" link
- Terms & Privacy links at bottom

**Styling**: Glassmorphic card on gradient background

### **3. User Dashboard/Home Screen**
**Layout:**
- **Header**: Logo, search bar, profile avatar, notifications bell
- **Main Content Area**:
  - Welcome message with user's name
  - Quick action cards: "Find Provider", "View History", "Saved Providers"
  - Recent searches section with small cards
  - Trending categories carousel
- **Bottom Navigation** (Mobile): Home, Search, History, Profile

### **4. AI Chat Interface Screen**
**Components:**
- **Header**: Provider category icon, "Finding [Category] Providers", back button
- **Chat Container**:
  - AI avatar with typing indicators
  - Message bubbles (AI messages in blue, user in gray)
  - Predefined question chips/buttons below AI messages
  - Progress indicator showing conversation steps
- **Input Area**: 
  - Text input with microphone icon
  - Send button with animation
  - Quick suggestion chips

**Interactive Elements:**
- Smooth message animations
- Typing indicators
- Auto-scroll to latest message
- Expandable input area

### **5. Provider Results Screen**
**Components:**
- **Filter Header**: Location chip, category chip, map view toggle
- **Results Grid**:
  - Provider cards with:
    - Profile photo/business logo
    - Business name and rating stars
    - Distance from user
    - Price range indicator
    - Services offered tags
    - "Contact" button (WhatsApp green)
    - "Save" heart icon
    - "View Details" link
- **Map Integration**: Toggle between list and map view
- **Load More** button at bottom

**Card Design**: Elevated white cards with rounded corners, subtle shadows, hover effects

### **6. Provider Detail Screen**
**Components:**
- **Header**: Business cover photo, back button, share icon
- **Business Info**:
  - Logo, name, rating, review count
  - Address with map integration
  - Phone, website, hours
  - Photo gallery carousel
- **Services & Pricing**: Expandable sections
- **Reviews**: Star ratings with review cards
- **Contact Section**: WhatsApp button, call button, email button
- **Similar Providers**: Horizontal scroll cards

### **7. Chat History Screen**
**Components:**
- **Header**: "My Conversations", search icon, filter icon
- **Session List**:
  - Cards showing:
    - Date/time of conversation
    - Category searched
    - Number of providers found
    - Conversation preview
    - Status (completed/ongoing)
- **Filter Options**: By date, category, status
- **Search Bar**: To find specific conversations

### **8. User Profile Screen**
**Components:**
- **Profile Header**:
  - Large profile picture with edit option
  - User name and email
  - Account type badge
- **Settings Sections**:
  - Personal Information (expandable)
  - Location Preferences
  - Notification Settings
  - Privacy Settings
  - Connected Accounts (Google/Facebook)
- **Activity Summary**:
  - Total searches
  - Providers contacted
  - Saved providers count
- **Action Buttons**: Edit Profile, Change Password, Logout

### **9. Saved Providers Screen**
**Components:**
- **Header**: "Saved Providers", search, sort options
- **Provider Grid**: Similar to results screen but with "Remove" option
- **Categories Filter**: Horizontal scrollable chips
- **Empty State**: Illustration when no saved providers

### **10. Contact History Screen**
**Components:**
- **Header**: "Contact History", filter options
- **Contact Cards**:
  - Provider name and photo
  - Contact method used (WhatsApp/email)
  - Date/time of contact
  - Status (sent/delivered/replied)
  - Message preview
  - "Contact Again" button
- **Filter Options**: By provider, date, contact method

---

## **ADMIN DASHBOARD SCREENS**

### **11. Admin Login Screen**
**Components:**
- Distinct admin branding (darker theme)
- Logo with "Admin Portal" text
- Email/password form only
- "Forgot Password" link
- Security badge/icon
- Two-factor authentication option

### **12. Admin Dashboard Home**
**Layout:**
- **Top Navigation**: Logo, admin name, notifications, logout
- **Sidebar Menu**:
  - Dashboard (home icon)
  - Analytics (chart icon)
  - Users (users icon)
  - Providers (building icon)
  - Search Logs (search icon)
  - Settings (gear icon)

**Main Content**:
- **KPI Cards Row**:
  - Total Users (with growth percentage)
  - Active Sessions
  - API Calls Today
  - Top Category
- **Charts Section**:
  - Usage over time (line chart)
  - Popular categories (donut chart)
  - Geographic distribution (map view)
- **Recent Activity Feed**:
  - Real-time user actions
  - System notifications

### **13. Analytics Dashboard**
**Components:**
- **Time Range Selector**: Dropdown for day/week/month/year
- **Metrics Grid**:
  - Token usage graphs
  - User engagement metrics
  - Search success rates
  - Response times
- **Interactive Charts**:
  - Search volume trends
  - Category popularity
  - Peak usage hours
  - Geographic heat map
- **Export Options**: PDF, CSV, Excel buttons

### **14. User Management Screen**
**Components:**
- **Header**: "User Management", add user button, export button
- **Search & Filter Bar**:
  - Search by name/email
  - Filter by status, registration date, activity
- **User Table**:
  - Profile photo, name, email
  - Registration date
  - Last active
  - Total searches
  - Status (active/inactive)
  - Actions (view, edit, suspend)
- **Pagination**: Page numbers with prev/next
- **Bulk Actions**: Select all checkbox, bulk operations

### **15. Search Logs Screen**
**Components:**
- **Header**: "Search Analytics", real-time toggle, export
- **Filter Panel**:
  - Date range picker
  - Category filter
  - User filter
  - Success/failure filter
- **Logs Table**:
  - Timestamp
  - User name
  - Search query
  - Category
  - Results count
  - Time taken
  - Tokens used
- **Search Details Modal**: Expandable detailed view

### **16. Provider Management Screen**
**Components:**
- **Header**: "Provider Directory", add provider, bulk import
- **Management Grid**:
  - Provider cards with edit capabilities
  - Status indicators (verified/unverified)
  - Contact information
  - Service categories
  - Rating/review summary
- **Provider Detail Modal**:
  - Full provider information
  - Edit capabilities
  - Verification status
  - Review management

### **17. Settings Screen**
**Components:**
- **System Configuration**:
  - API settings (OpenAI, Google Maps)
  - Rate limiting controls
  - Cache settings
- **User Interface Settings**:
  - Default categories
  - Search result limits
  - Message templates
- **Security Settings**:
  - Admin permissions
  - Session timeouts
  - Audit log settings
- **Notification Settings**:
  - Email alerts
  - System monitoring
  - Error notifications

---

## **SHARED UI COMPONENTS**

### **Navigation Components**
- **Mobile**: Bottom tab bar with 4-5 main sections
- **Web**: Top navigation with dropdown menus
- **Sidebar**: Collapsible admin sidebar with icons and labels

### **Interactive Elements**
- **Buttons**: Rounded, gradient fills, hover animations
- **Cards**: Elevated design with subtle shadows
- **Forms**: Clean inputs with floating labels
- **Modals**: Glassmorphic overlay with backdrop blur

### **Loading States**
- Skeleton screens for content loading
- Spinner animations for actions
- Progress bars for multi-step processes

### **Empty States**
- Friendly illustrations
- Helpful text with action suggestions
- CTA buttons to guide users

This comprehensive design covers all user scenarios and admin requirements while maintaining a modern, visually appealing interface. Each screen is designed to be responsive and user-friendly across both mobile and web platforms.

## Development Setup
1. **Prerequisites**: Node.js and npm installed
2. **Installation**: 
   ```bash
   npm install
   ```
3. **Development Server**: 
   ```bash
   npm run dev
   ```
4. **Build**: 
   ```bash
   npm run build
   ```
5. **Preview Production Build**: 
   ```bash
   npm run preview
   ```

## Important Notes
- **Current Status**: Frontend-only implementation with mock data
- **Missing Integrations**: 
  - OpenAI API integration for AI chat
  - Real provider database/API
  - Authentication system (Google/Facebook OAuth)
  - WhatsApp integration
  - Google Maps integration
  - Real-time notifications
- **Design System**: Uses glassmorphic design with animated gradients
- **Responsive**: Mobile-first design with desktop adaptations
- **State Management**: Currently using React state, may need Redux/Context for real implementation

## Commands
- **Development**: `npm run dev`
- **Build**: `npm run build` 
- **Lint**: `npm run lint`
- **Preview**: `npm run preview`
- **Type Check**: `tsc --noEmit` (TypeScript compiler check)

## File Structure
```
ServiceGPT/
├── src/
│   ├── App.tsx          # Main application component with routing
│   ├── main.tsx         # React app entry point
│   ├── index.css        # Global styles and Tailwind imports
│   └── vite-env.d.ts    # Vite environment types
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
├── tsconfig.json        # TypeScript configuration
└── eslint.config.js     # ESLint configuration
```

## Recent Changes
- Initial project setup with Vite + React + TypeScript
- Implemented comprehensive UI/UX design with glassmorphic theme
- Created all major screens: Landing, Auth, Dashboard, Chat, Provider Results, Provider Detail, Chat History, Admin Dashboard
- Added mock data for providers and chat sessions
- Implemented responsive design with mobile-first approach

## Next Steps / TODO
- **Backend Development**: 
  - Set up Node.js/Express server or serverless functions
  - Integrate OpenAI API for chat functionality
  - Create provider database and API endpoints
  - Implement authentication system
- **Integrations**:
  - Google Maps API for location services
  - WhatsApp Business API for messaging
  - OAuth providers (Google, Facebook)
- **Database Design**:
  - User profiles and authentication
  - Provider directory with reviews and ratings
  - Chat sessions and conversation history
  - Search analytics and usage metrics
- **Production Deployment**:
  - Environment configuration
  - Security implementation
  - Performance optimization
  - Monitoring and analytics