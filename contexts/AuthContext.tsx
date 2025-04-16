import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  signInWithGoogle,
  signInWithKakao,
  signOut as supabaseSignOut,
  getCurrentUser,
  getCurrentSession,
} from "../lib/supabase";
import { User, Session } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithGoogleAuth: () => Promise<void>;
  signInWithKakaoAuth: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  signInWithGoogleAuth: async () => {},
  signInWithKakaoAuth: async () => {},
  signOut: async () => {},
  refreshSession: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 로그인 상태 체크
  const refreshSession = async () => {
    try {
      setIsLoading(true);

      // 세션 가져오기
      const currentSession = await getCurrentSession();
      setSession(currentSession);

      // 사용자 정보 가져오기
      if (currentSession) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("사용자 상태 확인 오류:", error);
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로그인 상태 확인
  useEffect(() => {
    refreshSession();
  }, []);

  // 구글 로그인
  const signInWithGoogleAuth = async () => {
    try {
      setIsLoading(true);

      // 구글 로그인 실행
      const authResponse = await signInWithGoogle();

      // 세션 확인 및 사용자 정보 가져오기
      await refreshSession();

      return;
    } catch (error) {
      console.error("구글 로그인 오류:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 카카오 로그인
  const signInWithKakaoAuth = async () => {
    try {
      setIsLoading(true);

      // 카카오 로그인 실행
      const authResponse = await signInWithKakao();

      // 세션 확인 및 사용자 정보 가져오기
      await refreshSession();

      return;
    } catch (error) {
      console.error("카카오 로그인 오류:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃
  const signOutUser = async () => {
    try {
      setIsLoading(true);
      await supabaseSignOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("로그아웃 오류:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!session,
        signInWithGoogleAuth,
        signInWithKakaoAuth,
        signOut: signOutUser,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
