import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import * as Linking from "expo-linking";

// Expo WebBrowser 세션 초기화
WebBrowser.maybeCompleteAuthSession();

// URL 스킴을 사용한 리디렉션 URI 생성
const redirectUri = makeRedirectUri({
  scheme: "myapp", // app.json의 scheme과 일치해야 함
});

// Supabase 클라이언트 생성
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL as string,
  process.env.EXPO_PUBLIC_SUPABASE_KEY as string,
  {
    auth: {
      storage: AsyncStorage as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// 구글 로그인 - 웹 브라우저를 사용한 OAuth 흐름
export const signInWithGoogle = async () => {
  try {
    // URL 가져오기
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUri,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;
    if (!data?.url) throw new Error("No auth URL provided");

    // 브라우저로 URL 열기
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

    // 결과 처리
    if (result.type === "success") {
      // 세션 갱신 (URL에서 세션 정보를 추출하고 적용)
      const { url } = result;
      if (url) {
        await supabase.auth.setSession({
          access_token: url.split("access_token=")[1].split("&")[0],
          refresh_token: url.split("refresh_token=")[1].split("&")[0],
        });
      }
    }

    // 세션 반환
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    return sessionData;
  } catch (error) {
    console.error("Google OAuth 오류:", error);
    throw error;
  }
};

// 카카오 로그인 - 웹 브라우저를 사용한 OAuth 흐름
export const signInWithKakao = async () => {
  try {
    // URL 가져오기
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      // options: {
      //   redirectTo: redirectUri,
      //   skipBrowserRedirect: true,
      // },
    });

    if (error) throw error;
    if (!data?.url) throw new Error("No auth URL provided");

    // 브라우저로 URL 열기
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

    // 결과 처리
    if (result.type === "success") {
      // 세션 갱신 (URL에서 세션 정보를 추출하고 적용)
      const { url } = result;
      if (url) {
        // 쿼리 파라미터에서 코드 추출
        const code = url.includes("code=")
          ? url.split("code=")[1].split("&")[0]
          : null;

        if (code) {
          // 코드를 사용하여 세션 설정
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        }
      }
    }

    // 세션 반환
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    return sessionData;
  } catch (error) {
    console.error("Kakao OAuth 오류:", error);
    throw error;
  }
};

// 로그아웃
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// 현재 세션 가져오기
export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

// 현재 사용자 가져오기
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};

// Recipe 타입 정의
export type Recipe = {
  id?: string;
  title: string;
  description: string;
  category: string;
  is_public: boolean;
  user_id: string;
  created_at?: string;
  updated_at?: string;
};

// Ingredient 타입 정의
export type Ingredient = {
  id?: string;
  recipe_id: string;
  name: string;
  amount: string;
  unit: string;
  created_at?: string;
};

// Step 타입 정의
export type Step = {
  id?: string;
  recipe_id: string;
  description: string;
  days: string;
  order: number;
  created_at?: string;
};

// 레시피 저장 함수
export async function saveRecipe(recipe: Recipe) {
  const { data, error } = await supabase
    .from("recipes")
    .insert([recipe])
    .select();

  if (error) {
    throw error;
  }

  return data?.[0];
}

// 레시피 재료 저장 함수
export async function saveIngredients(
  ingredients: Omit<Ingredient, "id" | "created_at">[]
) {
  const { data, error } = await supabase
    .from("ingredients")
    .insert(ingredients)
    .select();

  if (error) {
    throw error;
  }

  return data;
}

// 레시피 단계 저장 함수
export async function saveSteps(steps: Omit<Step, "id" | "created_at">[]) {
  const { data, error } = await supabase.from("steps").insert(steps).select();

  if (error) {
    throw error;
  }

  return data;
}
