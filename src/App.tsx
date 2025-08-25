// React import not required with automatic runtime
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingScreen from './components/LandingScreen'
import AuthScreen from './components/AuthScreen'
import Dashboard from './components/Dashboard'
import ChatInterface from './components/ChatInterface'
import ProviderResultsScreen from './components/ProviderResultsScreen'
import ChatHistory from './components/ChatHistory'
import UserProfileScreen from './components/UserProfileScreen'
import SavedProvidersScreen from './components/SavedProvidersScreen'
import HowItWorksScreen from './components/HowItWorksScreen'
import ComingSoonScreen from './components/ComingSoonScreen'
import AdminLogin from './components/admin/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'
import AnalyticsDashboard from './components/admin/AnalyticsDashboard'

import { UnifiedThemeToggle } from './components/shared'
import { ThemeProvider } from './theme/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
          <div className="relative">
            <UnifiedThemeToggle />
          </div>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingScreen />} />
          <Route path="/auth" element={<AuthScreen />} />
          <Route path="/login" element={<AuthScreen />} />
          <Route path="/signup" element={<AuthScreen />} />
          <Route path="/how-it-works" element={<HowItWorksScreen />} />
          
          {/* User Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/providers" element={<ProviderResultsScreen />} />
          <Route path="/history" element={<ChatHistory />} />
          <Route path="/profile" element={<UserProfileScreen />} />
          <Route path="/saved" element={<SavedProvidersScreen />} />
          
          {/* Coming Soon / Placeholder Routes */}
          <Route path="/coming-soon" element={<ComingSoonScreen />} />
          <Route path="/services" element={<ComingSoonScreen />} />
          <Route path="/professionals" element={<ComingSoonScreen />} />
          <Route path="/pricing" element={<ComingSoonScreen />} />
          <Route path="/support" element={<ComingSoonScreen />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
        </Routes>
      </div>
    </Router>
    </ThemeProvider>
  )
}

export default App
