import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Modal,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { styled } from "nativewind";
import React from "react";

// TailwindCSS를 사용하기 위해 컴포넌트를 래핑
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

type Ingredient = {
  id: string;
  name: string;
  amount: string;
  unit: string;
  isCustomUnit: boolean;
};

type Step = {
  id: string;
  description: string;
  days: string;
};

export default function CreateRecipeScreen() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("막걸리"); // 기본값으로 막걸리 설정
  const [isPublic, setIsPublic] = useState(true);

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: "1", name: "", amount: "", unit: "g", isCustomUnit: false },
  ]);

  const [steps, setSteps] = useState<Step[]>([
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
    field: keyof Ingredient,
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

  const updateStep = (id: string, field: keyof Step, value: string) => {
    setSteps(
      steps.map((step) => (step.id === id ? { ...step, [field]: value } : step))
    );
  };

  const handleSave = () => {
    // 저장 기능 구현 없이 라우터만 작동
    router.back();
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
      <StyledView className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <StyledTouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#333" />
        </StyledTouchableOpacity>
        <StyledText className="text-lg font-bold text-gray-800">
          레시피 만들기
        </StyledText>
        <StyledTouchableOpacity
          onPress={handleSave}
          className="py-1.5 px-3 bg-emerald-500 rounded-[12px]"
        >
          <StyledText className="text-white font-semibold">저장</StyledText>
        </StyledTouchableOpacity>
      </StyledView>

      <StyledScrollView className="flex-1 px-4 py-4">
        <StyledView className="mb-4 bg-white rounded-xl p-4 shadow-sm">
          <StyledText className="text-lg font-bold text-gray-800 mb-4">
            기본 정보
          </StyledText>

          <StyledView className="mb-4">
            <StyledText className="text-base font-medium text-gray-600 mb-2">
              제목
            </StyledText>
            <StyledTextInput
              className={inputClass}
              value={title}
              onChangeText={setTitle}
              placeholder="레시피 제목을 입력하세요"
            />
          </StyledView>

          <StyledView className="mb-4">
            <StyledText className="text-base font-medium text-gray-600 mb-2">
              소개
            </StyledText>
            <StyledTextInput
              className={multilineInputClass}
              value={description}
              onChangeText={setDescription}
              placeholder="레시피에 대한 간단한 소개를 입력하세요"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </StyledView>

          <StyledView className="mb-4">
            <StyledText className="text-base font-medium text-gray-600 mb-2">
              카테고리
            </StyledText>
            <StyledView className="flex-row flex-wrap">
              {categories.map((cat) => (
                <StyledTouchableOpacity
                  key={cat}
                  className={`border rounded-full py-2 px-3.5 mr-2 mb-2 ${
                    category === cat
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-gray-300 bg-gray-50"
                  }`}
                  onPress={() => setCategory(cat)}
                >
                  <StyledText
                    className={`text-sm ${
                      category === cat ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {cat}
                  </StyledText>
                </StyledTouchableOpacity>
              ))}
            </StyledView>
          </StyledView>

          <StyledView className="mb-4">
            <StyledText className="text-base font-medium text-gray-600 mb-2">
              공개 설정
            </StyledText>
            <StyledView className="flex-row border border-gray-200 rounded-[8px] overflow-hidden">
              <StyledTouchableOpacity
                className={`flex-1 py-3 items-center ${
                  isPublic ? "bg-emerald-500" : "bg-white"
                }`}
                onPress={() => setIsPublic(true)}
              >
                <StyledText
                  className={`font-medium ${
                    isPublic ? "text-white" : "text-gray-600"
                  }`}
                >
                  공개
                </StyledText>
              </StyledTouchableOpacity>
              <StyledTouchableOpacity
                className={`flex-1 py-3 items-center ${
                  !isPublic ? "bg-emerald-500" : "bg-gray-50"
                }`}
                onPress={() => setIsPublic(false)}
              >
                <StyledText
                  className={`font-medium ${
                    !isPublic ? "text-white" : "text-gray-600"
                  }`}
                >
                  비공개
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>
        </StyledView>

        <StyledView className="mb-4 bg-white rounded-xl p-4 shadow-sm">
          <StyledText className="text-lg font-bold text-gray-800 mb-4">
            재료
          </StyledText>
          {ingredients.map((ingredient, index) => (
            <StyledView
              key={ingredient.id}
              className="flex-row items-center mb-3"
            >
              <StyledTextInput
                className={ingredientNameClass}
                value={ingredient.name}
                onChangeText={(value) =>
                  updateIngredient(ingredient.id, "name", value)
                }
                placeholder="재료명"
              />
              <StyledTextInput
                className={ingredientAmountClass}
                value={ingredient.amount}
                onChangeText={(value) =>
                  updateIngredient(ingredient.id, "amount", value)
                }
                placeholder="양"
                keyboardType="numeric"
              />
              {ingredient.isCustomUnit ? (
                <StyledTextInput
                  ref={createInputRef(ingredient.id)}
                  className={customUnitInputClass}
                  value={ingredient.unit}
                  onChangeText={(value) =>
                    handleUnitChange(ingredient.id, value)
                  }
                  placeholder="직접 입력"
                  // 입력 안정성을 위해 더 많은 props 추가
                  blurOnSubmit={false}
                  returnKeyType="done"
                  selectTextOnFocus={false}
                />
              ) : (
                <StyledTouchableOpacity
                  className={`${ingredientUnitClass} justify-center items-center flex-row`}
                  onPress={() => {
                    setSelectedIngredientId(ingredient.id);
                    setShowUnitModal(true);
                  }}
                >
                  <StyledText className="text-gray-700">
                    {ingredient.unit || "단위"}
                  </StyledText>
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    color="#666"
                    style={{ marginLeft: 2 }}
                  />
                </StyledTouchableOpacity>
              )}
              <StyledTouchableOpacity
                className="p-1"
                onPress={() => removeIngredient(ingredient.id)}
                disabled={ingredients.length === 1}
              >
                <Ionicons
                  name="close-circle"
                  size={24}
                  color={ingredients.length === 1 ? "#ccc" : "#ff6b6b"}
                />
              </StyledTouchableOpacity>
            </StyledView>
          ))}
          <StyledTouchableOpacity
            className="flex-row items-center justify-center p-3 border border-dashed border-gray-300 rounded-lg mt-2"
            onPress={addIngredient}
          >
            <Ionicons name="add-circle" size={20} color="#10b981" />
            <StyledText className="ml-2 text-emerald-600 font-medium">
              재료 추가
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        <StyledView className="mb-4 bg-white rounded-xl p-4 shadow-sm">
          <StyledText className="text-lg font-bold text-gray-800 mb-4">
            양조 단계
          </StyledText>
          {steps.map((step, index) => (
            <StyledView
              key={step.id}
              className="mb-4 p-3 border border-gray-200 rounded-[8px] bg-white"
            >
              <StyledView className="flex-row justify-between items-center mb-2">
                <StyledText className="text-base font-bold text-emerald-600">
                  단계 {index + 1}
                </StyledText>
                <StyledTouchableOpacity
                  className="p-1"
                  onPress={() => removeStep(step.id)}
                  disabled={steps.length === 1}
                >
                  <Ionicons
                    name="close-circle"
                    size={24}
                    color={steps.length === 1 ? "#ccc" : "#ff6b6b"}
                  />
                </StyledTouchableOpacity>
              </StyledView>
              <StyledTextInput
                className={
                  multilineInputClass.replace("bg-gray-50", "bg-white") +
                  " mb-2"
                }
                value={step.description}
                onChangeText={(value) =>
                  updateStep(step.id, "description", value)
                }
                placeholder="단계에 대한 설명을 입력하세요"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              <StyledView className="flex-row items-center mt-2">
                <StyledText className="text-sm text-gray-600 mr-2">
                  소요 일수
                </StyledText>
                <StyledTextInput
                  className={smallInputClass}
                  value={step.days}
                  onChangeText={(value) => updateStep(step.id, "days", value)}
                  placeholder="일수"
                  keyboardType="numeric"
                />
                <StyledText className="text-sm text-gray-600">일</StyledText>
              </StyledView>
            </StyledView>
          ))}
          <StyledTouchableOpacity
            className="flex-row items-center justify-center p-3 border border-dashed border-gray-300 rounded-lg mt-2"
            onPress={addStep}
          >
            <Ionicons name="add-circle" size={20} color="#10b981" />
            <StyledText className="ml-2 text-emerald-600 font-medium">
              단계 추가
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledScrollView>

      {/* 단위 선택 모달 */}
      <Modal
        visible={showUnitModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowUnitModal(false);
          setSelectedIngredientId(null);
        }}
      >
        <StyledView className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <StyledView className="bg-white rounded-lg p-4 w-[250px] shadow-xl">
            <StyledText className="text-lg font-bold text-gray-800 mb-3 text-center">
              단위 선택
            </StyledText>
            {commonUnits.map((unit) => (
              <StyledTouchableOpacity
                key={unit}
                className="py-3 px-4 border-b border-gray-100"
                onPress={() => {
                  if (selectedIngredientId) {
                    handleUnitSelection(unit, selectedIngredientId);
                  }
                }}
              >
                <StyledText className="text-center text-gray-700">
                  {unit}
                </StyledText>
              </StyledTouchableOpacity>
            ))}
            <StyledTouchableOpacity
              className="mt-3 py-2 px-4 bg-gray-200 rounded-lg"
              onPress={() => {
                setShowUnitModal(false);
                setSelectedIngredientId(null);
              }}
            >
              <StyledText className="text-center text-gray-700">
                취소
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </Modal>
    </StyledSafeAreaView>
  );
}
