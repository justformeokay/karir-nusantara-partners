import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  api, 
  ApiUser, 
  getStoredToken, 
  getStoredUser, 
  setAuthData, 
  clearAuthData 
} from '@/lib/api';

// Convert API user to frontend User type
export interface User {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  accountStatus: 'active' | 'inactive' | 'pending';
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    isVerified: boolean;
  };
  createdAt: string;
}

const mapApiUserToUser = (apiUser: ApiUser): User => ({
  id: apiUser.id.toString(),
  name: apiUser.name || apiUser.email.split('@')[0],
  email: apiUser.email,
  referralCode: apiUser.referral_code,
  accountStatus: apiUser.account_status,
  bankAccount: apiUser.bank_account ? {
    bankName: apiUser.bank_account.bank_name,
    accountNumber: apiUser.bank_account.account_number,
    accountHolder: apiUser.bank_account.account_holder,
    isVerified: apiUser.bank_account.is_verified,
  } : undefined,
  createdAt: apiUser.created_at,
});

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (user: User) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredToken();
      const storedUser = getStoredUser();
      
      if (token && storedUser) {
        // Validate token by fetching profile
        try {
          const response = await api.getProfile();
          if (response.success && response.data) {
            setUser(mapApiUserToUser(response.data));
          } else {
            // Token is invalid, clear auth data
            clearAuthData();
          }
        } catch {
          clearAuthData();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await api.login(email, password);
      
      if (response.success && response.data) {
        const { access_token, refresh_token, user: apiUser } = response.data;
        setAuthData(access_token, refresh_token, apiUser);
        setUser(mapApiUserToUser(apiUser));
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error?.message || 'Login failed. Please check your credentials.' 
        };
      }
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = useCallback(() => {
    // Call logout API (fire and forget)
    api.logout().catch(() => {});
    clearAuthData();
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const response = await api.getProfile();
      if (response.success && response.data) {
        setUser(mapApiUserToUser(response.data));
      }
    } catch {
      // Silently fail
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
