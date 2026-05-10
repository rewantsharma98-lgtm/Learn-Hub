import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { userLoggedOut } from "@/features/authSlice";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingRoute,  setPendingRoute]  = useState(null);
  const dispatch = useDispatch();

  const openAuthModal = useCallback((route = null) => {
    setPendingRoute(route);
    setShowAuthModal(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setShowAuthModal(false);
    setPendingRoute(null);
  }, []);

  // Only used as a fallback; prefer useLogoutUserMutation for server-side cookie clearing
  const logout = useCallback(() => {
    dispatch(userLoggedOut());
  }, [dispatch]);

  const value = useMemo(() => ({
    showAuthModal,
    pendingRoute,
    openAuthModal,
    closeAuthModal,
    logout,
  }), [showAuthModal, pendingRoute, openAuthModal, closeAuthModal, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);