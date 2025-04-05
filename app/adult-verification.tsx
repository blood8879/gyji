import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { Button, Input } from "../components/ui";
import { theme } from "../constants/theme";

type CheckItemKey = "service" | "privacy" | "marketing";

export default function AdultVerificationScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [checkedItems, setCheckedItems] = useState({
    service: false,
    privacy: false,
    marketing: false,
  });

  // 애니메이션 값
  const shieldScale = new Animated.Value(1);
  const checkOpacity = new Animated.Value(0);

  // 체크박스 토글 함수
  const toggleCheck = (item: CheckItemKey) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCheckedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  // 인증번호 요청 함수
  const requestVerification = () => {
    if (phoneNumber.length < 10) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // 방패 아이콘 애니메이션
    Animated.sequence([
      Animated.timing(shieldScale, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.bounce,
      }),
      Animated.timing(shieldScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // 체크 표시 페이드인 애니메이션
    Animated.timing(checkOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      delay: 300,
    }).start();
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
          <View className="px-6 py-5">
            {/* 헤더 */}
            <View className="items-center mb-8">
              <Animated.View
                style={{
                  transform: [{ scale: shieldScale }],
                  width: 80,
                  height: 80,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                  borderRadius: 40,
                  overflow: "hidden",
                }}
              >
                <LinearGradient
                  colors={["#8a4f7d", "#9d6090"]} // 자주색/보라색 계열 (전통주 컨셉)
                  className="absolute w-full h-full"
                />
                <Ionicons name="shield-outline" size={36} color="white" />
                <Animated.View
                  style={{
                    position: "absolute",
                    opacity: checkOpacity,
                  }}
                >
                  <Ionicons name="checkmark" size={28} color="white" />
                </Animated.View>
              </Animated.View>

              <Text className="text-2xl font-bold text-neutral-900 dark:text-white pt-4">
                성인인증
              </Text>
              <Text className="text-base text-neutral-500 dark:text-neutral-400 text-center mt-2">
                주류 관련 서비스로 만 19세 이상만 이용 가능합니다
              </Text>
            </View>

            {/* 인증 카드 */}
            <View className="bg-white dark:bg-neutral-800 rounded-xl py-5 shadow-sm mb-5">
              <View className="mb-4 ">
                <Text className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
                  본인 확인을 위한 인증
                </Text>
                <Text className="text-neutral-600 dark:text-neutral-400 text-sm">
                  휴대폰 번호를 통해 본인 확인을 진행합니다.
                </Text>
              </View>

              {/* 전화번호 입력 폼 */}
              <Input
                label="휴대폰 번호"
                placeholder="'-' 없이 입력해주세요"
                keyboardType="phone-pad"
                leftIcon="call-outline"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                inputContainerStyle={{
                  height: 48,
                  paddingHorizontal: 14,
                  alignItems: "center",
                  borderRadius: 8,
                }}
                labelStyle={{ marginBottom: 6 }}
                placeholderTextColor={theme.neutral[400]}
                inputStyle={{
                  fontSize: 15,
                  paddingLeft: 6,
                }}
              />

              {/* 인증번호 받기 버튼 */}
              <Button
                size="lg"
                variant="secondary"
                style={{
                  borderRadius: 12,
                  borderWidth: 0,
                  marginTop: 10,
                  height: 48,
                }}
                className="w-auto"
                onPress={requestVerification}
                disabled={phoneNumber.length < 10}
              >
                인증번호 받기
              </Button>
            </View>

            {/* 이용 약관 동의 */}
            <View className="mb-8 px-0">
              <View className="flex-row items-center mb-3">
                <TouchableOpacity
                  onPress={() => toggleCheck("service")}
                  className="flex-row items-center"
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={
                      checkedItems.service
                        ? "checkmark-circle"
                        : "checkmark-circle-outline"
                    }
                    size={22}
                    color={
                      checkedItems.service
                        ? theme.secondary.DEFAULT
                        : theme.neutral[400]
                    }
                  />
                  <Text className="text-neutral-700 dark:text-neutral-300 ml-2">
                    서비스 이용약관 동의 (필수)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="ml-auto">
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={theme.neutral[400]}
                  />
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center mb-3">
                <TouchableOpacity
                  onPress={() => toggleCheck("privacy")}
                  className="flex-row items-center"
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={
                      checkedItems.privacy
                        ? "checkmark-circle"
                        : "checkmark-circle-outline"
                    }
                    size={22}
                    color={
                      checkedItems.privacy
                        ? theme.secondary.DEFAULT
                        : theme.neutral[400]
                    }
                  />
                  <Text className="text-neutral-700 dark:text-neutral-300 ml-2">
                    개인정보 처리방침 동의 (필수)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="ml-auto">
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={theme.neutral[400]}
                  />
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => toggleCheck("marketing")}
                  className="flex-row items-center"
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={
                      checkedItems.marketing
                        ? "checkmark-circle"
                        : "checkmark-circle-outline"
                    }
                    size={22}
                    color={
                      checkedItems.marketing
                        ? theme.secondary.DEFAULT
                        : theme.neutral[400]
                    }
                  />
                  <Text className="text-neutral-700 dark:text-neutral-300 ml-2">
                    마케팅 정보 수신 동의 (선택)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="ml-auto">
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={theme.neutral[400]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* 하단 안내 문구 */}
            <View className="mt-4">
              <Text className="text-xs text-neutral-500 dark:text-neutral-400 text-center px-0">
                본 인증 절차는 한국인터넷진흥원(KISA)의 지침에 따라{"\n"}
                진행되며, 수집된 개인정보는 인증 목적으로만 사용됩니다.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
