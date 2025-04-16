import { useEffect } from "react";
import { View, Text } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useColorScheme } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { Ionicons } from "@expo/vector-icons";
import { AuthProvider } from "../contexts/AuthContext";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "../lib/supabase";

// 스플래시 스크린 유지
SplashScreen.preventAutoHideAsync();

// URL 리스너 초기화 - OAuthRedirect를 처리하기 위한 함수
const initializeURLListener = () => {
  // URL 이벤트 리스너 등록
  const subscription = Linking.addEventListener("url", async (event) => {
    // URL에서 code 또는 access_token 추출
    const { url } = event;

    if (url.includes("code=")) {
      // 코드 기반 인증의 경우
      try {
        // code 파라미터 추출
        const code = url.split("code=")[1].split("&")[0];
        await supabase.auth.exchangeCodeForSession(code);
      } catch (error) {
        console.error("URL 처리 오류:", error);
      }
    } else if (url.includes("access_token=")) {
      // 토큰 기반 인증의 경우
      try {
        const access_token = url.split("access_token=")[1].split("&")[0];
        const refresh_token = url.split("refresh_token=")[1].split("&")[0];

        await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
      } catch (error) {
        console.error("URL 처리 오류:", error);
      }
    }
  });

  return subscription;
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // 폰트 로딩
  const [fontsLoaded, fontError] = useFonts({
    "Pretendard-Regular": require("../assets/fonts/Pretendard-Regular.ttf"),
    "Pretendard-Medium": require("../assets/fonts/Pretendard-Medium.ttf"),
    "Pretendard-Bold": require("../assets/fonts/Pretendard-Bold.ttf"),
    ...Ionicons.font, // <-- Ionicons 폰트 로드 추가
  });

  useEffect(() => {
    // URL 리스너 초기화
    const subscription = initializeURLListener();

    if (fontsLoaded || fontError) {
      // 폰트 로딩 완료되거나 에러 발생 시 스플래시 스크린 숨김
      SplashScreen.hideAsync();
    }

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      subscription.remove();
    };
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <View style={{ flex: 1 }}>
        {/* 상태바 설정 */}
        <StatusBar style={isDark ? "light" : "dark"} />

        {/* 스택 네비게이션 설정 */}
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: isDark ? "#121212" : "#F8FAFC",
            },
            animation: "slide_from_right",
          }}
        >
          {/* 인증 필요 화면들 */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* 양조일지 화면들 */}
          <Stack.Screen name="journals" options={{ headerShown: false }} />

          {/* 인증 화면들 */}
          <Stack.Screen name="login" options={{ headerShown: false }} />

          <Stack.Screen
            name="adult-verification"
            options={{ headerShown: false }}
            // MVP에서는 성인인증 화면 사용하지 않음. 필요시 다시 활성화
          />
        </Stack>
      </View>
    </AuthProvider>
  );
}
