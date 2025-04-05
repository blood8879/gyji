import { useEffect } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";

// 스플래시 화면 유지
SplashScreen.preventAutoHideAsync();

export default function Index() {
  useEffect(() => {
    // 앱 초기화 및 라우팅 로직
    const initialize = async () => {
      try {
        // 성인인증 여부 확인 로직 제거됨

        // 스플래시 화면 숨기기
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error("초기화 오류:", error);
        // 오류가 발생해도 스플래시 화면은 숨김
        await SplashScreen.hideAsync();
      }
    };

    initialize();
  }, []);

  // 로그인 화면으로 리다이렉트 (성인인증 로직 제거)
  return <Redirect href="/login" />;
}
