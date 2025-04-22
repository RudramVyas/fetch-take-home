import React, { JSX } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Search from "./pages/Search";
import SessionWarning from "./components/SessionWarning";

// A wrapper that protects routes from unauthenticated access
type ProtectedRouteProps = { children: JSX.Element };
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const { isAuthenticated } = useAuth();
	return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Main application component: sets up routing & warning dialog
export const App: React.FC = () => (
	<>
		<SessionWarning />
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route
				path="/search"
				element={
					<ProtectedRoute>
						<Search />
					</ProtectedRoute>
				}
			/>
			{/* Redirect any unknown path to login */}
			<Route path="*" element={<Navigate to="/login" replace />} />
		</Routes>
	</>
);
