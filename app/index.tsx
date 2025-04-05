import { Redirect } from "expo-router";
import LoginScreen from "./screens/Login";
import AdultVerificationScreen from "./adult-verification";
export default function Index() {
  // 여기서는 로그인 화면을 바로 표시
  // 추후 인증 상태 확인 로직 추가 가능
  // return <LoginScreen />;
  // return <AdultVerificationScreen />;
  return <Redirect href="/(tabs)/journals/create" />;
}
