import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '@/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateUserDetails: (details: { name?: string; password?: string }) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
  updateUserDetails: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
        };
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // No longer need these methods as Firebase handles user storage

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Auth state listener will handle setting the user state
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile to add the user's name
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // Auth state listener will handle setting the user state
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      // Auth state listener will handle setting the user state
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateUserDetails = async (details: { name?: string; password?: string }) => {
    if (!auth.currentUser) return;
    
    try {
      if (details.name) {
        await updateProfile(auth.currentUser, {
          displayName: details.name
        });
        
        // Update local state to reflect changes immediately
        if (user) {
          setUser({
            ...user,
            name: details.name
          });
        }
      }
      
      // Note: Password updates would require reauthentication
      // This is a simplified version - in a real app, you'd need to implement
      // reauthentication before changing password
    } catch (error) {
      console.error('Update user details error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      signIn, 
      signUp, 
      signOut,
      updateUserDetails
    }}>
      {children}
    </AuthContext.Provider>
  );
};