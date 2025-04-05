import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Button } from "../components/ui";
import { theme } from "../constants/theme";

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 소셜 로그인 처리 함수
  const handleSocialLogin = async (provider: string) => {
    try {
      setIsLoading(true);

      // TODO: 실제 소셜 인증 로직 구현
      // 예: const { user, error } = await supabase.auth.signInWithProvider(provider);

      // 임시 로그인 로직 (개발용)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`${provider} 로그인 시도`);

      // 로그인 성공 처리
      await AsyncStorage.setItem("user-token", "dummy-token");

      // 바로 메인 화면으로 이동
      router.replace("/(tabs)");
    } catch (error) {
      console.error(`${provider} 로그인 오류:`, error);
      Alert.alert(
        "로그인 실패",
        "로그인 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center", // 수직 중앙 정렬
          }}
        >
          <View className="px-6 py-10">
            {/* 로고 및 헤더 */}
            <View className="items-center mb-10">
              <View className="w-24 h-24 items-center justify-center mb-6 rounded-full overflow-hidden">
                <LinearGradient
                  colors={["#8a4f7d", "#9d6090"]} // 자주색/보라색 계열 (전통주 컨셉)
                  className="absolute w-full h-full"
                />
                <Ionicons name="wine-outline" size={48} color="white" />
              </View>
              <Text className="text-2xl font-bold text-neutral-900 dark:text-white">
                전통주 양조 기록
              </Text>
              <Text className="text-base text-neutral-500 dark:text-neutral-400 text-center mt-2">
                나만의 전통주 레시피를 기록하고 공유하세요
              </Text>
            </View>

            {/* 소셜 로그인 버튼 */}
            <View className="mb-8 space-y-4">
              <Button
                size="lg"
                variant="outline"
                icon="logo-google"
                iconPosition="left"
                style={{
                  borderRadius: 12,
                  borderWidth: 0.5, // 테두리 두께 줄임
                }}
                className="w-full bg-white border-neutral-300 dark:border-neutral-700"
                textStyle={{ color: "#000" }}
                onPress={() => handleSocialLogin("google")}
                disabled={isLoading}
              >
                구글로 시작하기
              </Button>

              <Button
                size="lg"
                style={{
                  backgroundColor: "#FEE500",
                  borderRadius: 12,
                  borderWidth: 0, // 테두리 제거
                }}
                textStyle={{ color: "#000" }}
                className="w-full"
                onPress={() => handleSocialLogin("kakao")}
                disabled={isLoading}
              >
                카카오로 시작하기
              </Button>

              {Platform.OS === "ios" && (
                <Button
                  size="lg"
                  variant="outline"
                  icon="logo-apple"
                  iconPosition="left"
                  style={{
                    borderRadius: 12,
                    backgroundColor: "#000",
                    borderWidth: 0, // 테두리 제거
                  }}
                  className="w-full"
                  onPress={() => handleSocialLogin("apple")}
                  disabled={isLoading}
                >
                  Apple로 시작하기
                </Button>
              )}
            </View>

            {/* 구분선 */}
            <View className="flex-row items-center mb-8">
              <View className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
              <Text className="mx-4 text-neutral-500 dark:text-neutral-400">
                또는
              </Text>
              <View className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
            </View>

            {/* 이메일로 시작하기 버튼 */}
            <Button
              size="lg"
              variant="secondary"
              icon="mail-outline"
              iconPosition="left"
              style={{
                borderRadius: 12,
                borderWidth: 0, // 테두리 제거
              }}
              className="w-full mb-8"
              onPress={() => router.push("/register" as any)}
              disabled={isLoading}
            >
              이메일로 시작하기
            </Button>

            {/* 하단 텍스트 */}
            <View className="flex-row justify-center mt-4">
              <Text className="text-neutral-600 dark:text-neutral-400">
                이미 계정이 있으신가요?
              </Text>
              <TouchableOpacity
                className="ml-1"
                onPress={() => router.push("/register" as any)}
              >
                <Text className="font-semibold text-secondary">로그인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
