import { lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import Skeleton from "./components/ui/Skeleton";

const Analytics = lazy(() => import("./pages/Analytics"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const BudgetPlanner = lazy(() => import("./pages/BudgetPlanner"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Landing = lazy(() => import("./pages/Landing"));
const Profile = lazy(() => import("./pages/Profile"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Settings = lazy(() => import("./pages/Settings"));
const Transactions = lazy(() => import("./pages/Transactions"));

const App = ({ googleConfigured = false }) => {
  const location = useLocation();

  return (
    <>
      <Suspense fallback={<div className="min-h-screen bg-slate-50 p-6 dark:bg-ink"><Skeleton rows={5} /></div>}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<AuthPage mode="login" googleConfigured={googleConfigured} />} />
            <Route path="/register" element={<AuthPage mode="register" googleConfigured={googleConfigured} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/budget" element={<BudgetPlanner />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
      <Toaster position="top-right" toastOptions={{ duration: 2800 }} />
    </>
  );
};

export default App;
