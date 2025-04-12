import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function CreateEventScreen() {
  const router = useRouter();

  // 상태 관리
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(new Date().getTime() + 2 * 60 * 60 * 1000)
  ); // 기본 2시간 후
  const [maxParticipants, setMaxParticipants] = useState("10");
  const [fee, setFee] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [image, setImage] = useState<string | null>(null);

  // DateTimePicker 관련 상태 제거
  const [dateInput, setDateInput] = useState(formatDate(date));
  const [timeInput, setTimeInput] = useState(formatTime(date));
  const [endDateInput, setEndDateInput] = useState(formatDate(endDate));
  const [endTimeInput, setEndTimeInput] = useState(formatTime(endDate));

  // 날짜 형식화 함수
  function formatDate(date: Date): string {
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  }

  // 시간 형식화 함수
  function formatTime(date: Date): string {
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }

  // 날짜 입력 처리 함수
  const handleDateChange = (value: string, isEndDate: boolean = false) => {
    if (isEndDate) {
      setEndDateInput(value);
    } else {
      setDateInput(value);
    }
  };

  // 시간 입력 처리 함수
  const handleTimeChange = (value: string, isEndDate: boolean = false) => {
    if (isEndDate) {
      setEndTimeInput(value);
    } else {
      setTimeInput(value);
    }
  };

  // 이미지 선택 처리
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 저장 처리
  const handleSave = () => {
    // 실제 저장 기능은 구현하지 않고 라우터만 작동
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>시음회 만들기</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveText}>저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.imageSection}>
          {image ? (
            <Image source={{ uri: image }} style={styles.thumbnail} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={50} color="#CCC" />
              <Text style={styles.imagePlaceholderText}>대표 이미지</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={pickImage}
          >
            <Text style={styles.imagePickerText}>
              {image ? "이미지 변경" : "이미지 선택"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>제목</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="시음회 제목을 입력하세요"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>설명</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="시음회에 대한 설명을 작성해주세요"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>날짜 및 시간</Text>
            <View style={styles.dateTimeContainer}>
              <View style={styles.dateInputContainer}>
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <TextInput
                  style={styles.dateTimeInput}
                  value={dateInput}
                  onChangeText={(value) => handleDateChange(value)}
                  placeholder="YYYY년 MM월 DD일"
                />
              </View>

              <View style={styles.dateInputContainer}>
                <Ionicons name="time-outline" size={20} color="#666" />
                <TextInput
                  style={styles.dateTimeInput}
                  value={timeInput}
                  onChangeText={(value) => handleTimeChange(value)}
                  placeholder="HH:MM"
                />
              </View>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>종료 시간</Text>
            <View style={styles.dateTimeContainer}>
              <View style={styles.dateInputContainer}>
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <TextInput
                  style={styles.dateTimeInput}
                  value={endDateInput}
                  onChangeText={(value) => handleDateChange(value, true)}
                  placeholder="YYYY년 MM월 DD일"
                />
              </View>

              <View style={styles.dateInputContainer}>
                <Ionicons name="time-outline" size={20} color="#666" />
                <TextInput
                  style={styles.dateTimeInput}
                  value={endTimeInput}
                  onChangeText={(value) => handleTimeChange(value, true)}
                  placeholder="HH:MM"
                />
              </View>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>장소</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="시음회 장소 이름 (예: 한강공원, 커뮤니티 센터)"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>주소</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="상세 주소를 입력하세요"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>최대 참가 인원</Text>
            <TextInput
              style={[styles.input, styles.numberInput]}
              value={maxParticipants}
              onChangeText={setMaxParticipants}
              placeholder="10"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>참가비</Text>
            <View style={styles.feeInputContainer}>
              <TextInput
                style={[styles.input, styles.feeInput]}
                value={fee}
                onChangeText={setFee}
                placeholder="0"
                keyboardType="numeric"
              />
              <Text style={styles.feeUnit}>원</Text>
            </View>
            <Text style={styles.helperText}>무료인 경우 비워두세요</Text>
          </View>

          <View style={styles.formGroup}>
            <View style={styles.toggleRow}>
              <Text style={styles.label}>공개 설정</Text>
              <Switch
                value={isPublic}
                onValueChange={setIsPublic}
                trackColor={{ false: "#D1D1D1", true: "#CABCDA" }}
                thumbColor={isPublic ? "#10b981" : "#F4F3F4"}
              />
            </View>
            <Text style={styles.helperText}>
              {isPublic
                ? "누구나 검색하고 참여 신청할 수 있습니다"
                : "초대한 사람만 참여할 수 있습니다"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  saveButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#10b981",
    borderRadius: 6,
  },
  saveText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  imageSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  thumbnail: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: "100%",
    height: 180,
    backgroundColor: "#F1F1F1",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    borderStyle: "dashed",
  },
  imagePlaceholderText: {
    marginTop: 10,
    color: "#999",
    fontSize: 16,
  },
  imagePickerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#10b981",
    borderRadius: 6,
  },
  imagePickerText: {
    color: "white",
    fontWeight: "500",
    fontSize: 14,
  },
  formSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flex: 0.48,
    backgroundColor: "#FAFAFA",
  },
  dateTimeInput: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  numberInput: {
    width: "30%",
    textAlign: "center",
  },
  feeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  feeInput: {
    width: "50%",
  },
  feeUnit: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  helperText: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
