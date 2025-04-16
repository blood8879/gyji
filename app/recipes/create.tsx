import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Modal,
  Keyboard,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { styled } from "nativewind";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TailwindCSS를 사용하기 위해 컴포넌트를 래핑
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

// 컴포넌트 불러오기
import FormHeader from "../../components/recipe/FormHeader";
import BasicInfo from "../../components/recipe/BasicInfo";
import IngredientsForm from "../../components/recipe/IngredientsForm";
import StepsForm from "../../components/recipe/StepsForm";

// Supabase 함수 및 타입 불러오기
import { saveRecipe, saveIngredients, saveSteps } from "../../lib/supabase";

type IngredientType = {
  id: string;
  name: string;
  amount: string;
  unit: string;
  isCustomUnit: boolean;
};

type StepType = {
  id: string;
  description: string;
  days: string;
};

export default function CreateRecipeScreen() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("막걸리");
  const [isPublic, setIsPublic] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [ingredients, setIngredients] = useState<IngredientType[]>([
    { id: "1", name: "", amount: "", unit: "g", isCustomUnit: false },
  ]);

  const [steps, setSteps] = useState<StepType[]>([
    { id: "1", description: "", days: "" },
  ]);

  const categories = ["막걸리", "맥주", "와인", "기타"];

  const addIngredient = () => {
    const newId = String(ingredients.length + 1);
    setIngredients([
      ...ingredients,
      { id: newId, name: "", amount: "", unit: "g", isCustomUnit: false },
    ]);
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((ing) => ing.id !== id));
    }
  };

  const updateIngredient = (
    id: string,
    field: keyof IngredientType,
    value: any // 타입 에러 수정을 위해 any 타입으로 변경
  ) => {
    setIngredients(
      ingredients.map((ing) =>
        ing.id === id ? { ...ing, [field]: value } : ing
      )
    );
  };

  const addStep = () => {
    const newId = String(steps.length + 1);
    setSteps([...steps, { id: newId, description: "", days: "" }]);
  };

  const removeStep = (id: string) => {
    if (steps.length > 1) {
      setSteps(steps.filter((step) => step.id !== id));
    }
  };

  const updateStep = (id: string, field: keyof StepType, value: string) => {
    setSteps(
      steps.map((step) => (step.id === id ? { ...step, [field]: value } : step))
    );
  };

  const handleSave = async () => {
    try {
      // 폼 유효성 검사
      if (!title.trim()) {
        Alert.alert("알림", "레시피 제목을 입력해주세요.");
        return;
      }

      if (!category) {
        Alert.alert("알림", "카테고리를 선택해주세요.");
        return;
      }

      // 재료 유효성 검사
      const hasEmptyIngredient = ingredients.some((ing) => !ing.name.trim());
      if (hasEmptyIngredient) {
        Alert.alert(
          "알림",
          "비어있는 재료가 있습니다. 모든 재료명을 입력하거나 불필요한 항목을 삭제해주세요."
        );
        return;
      }

      // 단계 유효성 검사
      const hasEmptyStep = steps.some((step) => !step.description.trim());
      if (hasEmptyStep) {
        Alert.alert(
          "알림",
          "비어있는 단계가 있습니다. 모든 단계를 입력하거나 불필요한 항목을 삭제해주세요."
        );
        return;
      }

      // 키보드 닫기
      Keyboard.dismiss();

      // 저장 중 상태로 변경
      setIsSaving(true);

      // 임시 사용자 ID (실제 앱에서는 인증된 사용자 ID를 사용해야 함)
      const userToken = await AsyncStorage.getItem("user-token");
      const userId = userToken || "temp-user-id";

      // 레시피 저장
      const recipeData = {
        title,
        description,
        category,
        is_public: isPublic,
        user_id: userId,
      };

      const savedRecipe = await saveRecipe(recipeData);
      const recipeId = savedRecipe.id;

      // 재료 저장
      const ingredientsData = ingredients.map((ing, index) => ({
        recipe_id: recipeId,
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
      }));

      await saveIngredients(ingredientsData);

      // 단계 저장
      const stepsData = steps.map((step, index) => ({
        recipe_id: recipeId,
        description: step.description,
        days: step.days,
        order: index + 1,
      }));

      await saveSteps(stepsData);

      // 저장 성공 알림
      Alert.alert("성공", "레시피가 저장되었습니다.", [
        {
          text: "확인",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("레시피 저장 오류:", error);
      Alert.alert(
        "오류",
        "레시피 저장 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    Platform.OS === "android"
      ? "border border-gray-200 p-3 text-base rounded-[8px]"
      : "border border-gray-300 rounded-[8px] p-3 bg-gray-50 text-base";

  const multilineInputClass =
    Platform.OS === "android"
      ? "border border-gray-200 p-3 text-base min-h-[80px] rounded-[8px]"
      : "border border-gray-300 rounded-[8px] p-3 bg-gray-50 text-base min-h-[80px]";

  const smallInputClass =
    Platform.OS === "android"
      ? "w-16 border border-gray-200 p-1.5 bg-white text-center mr-1 rounded-[8px]"
      : "w-16 border border-gray-300 rounded-[8px] p-1.5 bg-white text-center mr-1";

  // 재료 입력 필드용 클래스 추가
  const ingredientNameClass =
    Platform.OS === "android"
      ? "flex-2 mr-2 h-12 min-w-[120px] border border-gray-200 p-3 text-base rounded-[8px]"
      : "flex-2 mr-2 h-12 min-w-[120px] border border-gray-300 rounded-[8px] p-3 bg-gray-50 text-base";

  const ingredientAmountClass =
    Platform.OS === "android"
      ? "flex-1 mr-2 w-[80px] h-12 text-center border border-gray-200 p-3 text-base rounded-[8px]"
      : "flex-1 mr-2 w-[80px] h-12 text-center border border-gray-300 rounded-[8px] p-3 bg-gray-50 text-base";

  const ingredientUnitClass =
    Platform.OS === "android"
      ? "flex-1 mr-2 w-[60px] h-12 text-center border border-gray-200 p-3 text-base rounded-[8px]"
      : "flex-1 mr-2 w-[60px] h-12 text-center border border-gray-300 rounded-[8px] p-3 bg-gray-50 text-base";

  const [unitPickerVisible, setUnitPickerVisible] = useState<string | null>(
    null
  );

  // 자주 사용되는 단위 목록과 '직접 입력' 옵션
  const commonUnits = ["g", "kg", "ml", "L", "개", "Tbsp", "tsp", "직접 입력"];

  // 모달 방식으로 단위 선택기 구현을 위한 상태
  const [selectedIngredientId, setSelectedIngredientId] = useState<
    string | null
  >(null);
  const [showUnitModal, setShowUnitModal] = useState(false);

  // 각 재료 입력 필드의 ref를 저장하기 위한 객체
  const customUnitInputRefs = useRef<{
    [key: string]: React.RefObject<TextInput> | null;
  }>({});

  // 단위 선택 처리 함수
  const handleUnitSelection = (unit: string, ingredientId: string) => {
    if (unit === "직접 입력") {
      // 상태 업데이트를 한번에 처리하여 불필요한 렌더링 방지
      setIngredients(
        ingredients.map((ing) =>
          ing.id === ingredientId
            ? { ...ing, isCustomUnit: true, unit: "" }
            : ing
        )
      );
    } else {
      // 단위 선택 시 상태 업데이트를 한번에 처리
      setIngredients(
        ingredients.map((ing) =>
          ing.id === ingredientId ? { ...ing, isCustomUnit: false, unit } : ing
        )
      );
    }
    setShowUnitModal(false);
    setSelectedIngredientId(null);
  };

  // 각 재료마다 ref 생성
  const createInputRef = (id: string) => {
    if (!customUnitInputRefs.current[id]) {
      customUnitInputRefs.current[id] = React.createRef<TextInput>();
    }
    return customUnitInputRefs.current[id];
  };

  // 직접 입력 필드용 커스텀 스타일
  const customUnitInputClass =
    Platform.OS === "android"
      ? "flex-1 mr-2 w-[60px] h-12 text-center border-2 border-emerald-400 p-3 text-base rounded-[8px] bg-white"
      : "flex-1 mr-2 w-[60px] h-12 text-center border-2 border-emerald-400 p-3 bg-white text-base rounded-[8px]";

  // 입력 필드 값 변경 처리 함수 - 별도 분리하여 리렌더링 최소화
  const handleUnitChange = (id: string, value: string) => {
    // 단위 값만 변경하고 isCustomUnit은 유지
    updateIngredient(id, "unit", value);
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-gray-100">
      {/* 헤더 */}
      <FormHeader
        title="레시피 만들기"
        onSave={handleSave}
        isSaving={isSaving}
      />

      {/* 스크롤 영역 */}
      <StyledScrollView className="flex-1 px-4 py-4">
        {/* 기본 정보 */}
        <BasicInfo
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          category={category}
          setCategory={setCategory}
          isPublic={isPublic}
          setIsPublic={setIsPublic}
        />

        {/* 재료 입력 폼 */}
        <IngredientsForm
          ingredients={ingredients}
          setIngredients={setIngredients}
        />

        {/* 단계 입력 폼 */}
        <StepsForm steps={steps} setSteps={setSteps} />
      </StyledScrollView>
    </StyledSafeAreaView>
  );
}
