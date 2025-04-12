import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

// 더미 데이터 타입
type StageLog = {
  id: number;
  title: string;
  date: string;
  description: string;
  temperature: string;
  humidity: string;
  images: string[];
  completed: boolean;
};

export default function JournalDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // 더미 데이터
  const [journal] = useState({
    id: id,
    title: "첫 번째 막걸리 양조",
    recipe: "전통 막걸리",
    startDate: "2023년 6월 1일",
    status: "진행 중",
    progress: 60,
    stages: [
      {
        id: 1,
        title: "재료 준비",
        date: "2023년 6월 1일",
        description: "쌀 1kg을 깨끗이 씻어 물에 6시간 불렸습니다.",
        temperature: "25°C",
        humidity: "60%",
        images: ["https://via.placeholder.com/150"],
        completed: true,
      },
      {
        id: 2,
        title: "고두밥 만들기",
        date: "2023년 6월 2일",
        description:
          "불린 쌀을 찜기에 넣고 30분간 쪘습니다. 고슬고슬한 질감이 되었습니다.",
        temperature: "28°C",
        humidity: "65%",
        images: [
          "https://via.placeholder.com/150",
          "https://via.placeholder.com/150",
        ],
        completed: true,
      },
      {
        id: 3,
        title: "누룩 섞기",
        date: "2023년 6월 3일",
        description: "고두밥이 식은 후 누룩을 섞고 발효통에 넣었습니다.",
        temperature: "26°C",
        humidity: "63%",
        images: ["https://via.placeholder.com/150"],
        completed: true,
      },
      {
        id: 4,
        title: "1차 발효",
        date: "2023년 6월 5일",
        description:
          "발효가 시작되었습니다. 거품이 조금씩 생기기 시작했습니다.",
        temperature: "24°C",
        humidity: "70%",
        images: ["https://via.placeholder.com/150"],
        completed: false,
      },
      {
        id: 5,
        title: "2차 발효",
        date: "",
        description: "",
        temperature: "",
        humidity: "",
        images: [],
        completed: false,
      },
    ],
  });

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
        <Text style={styles.headerTitle}>양조일지</Text>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={24} color="#5D3F6A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.titleSection}>
          <Text style={styles.title}>{journal.title}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>레시피:</Text>
            <Text style={styles.infoValue}>{journal.recipe}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>시작일:</Text>
            <Text style={styles.infoValue}>{journal.startDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>상태:</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{journal.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>진행도</Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, { width: `${journal.progress}%` }]}
            />
          </View>
          <Text style={styles.progressText}>{journal.progress}%</Text>
        </View>

        <View style={styles.stagesSection}>
          <Text style={styles.sectionTitle}>양조 단계</Text>

          {journal.stages.map((stage: StageLog) => (
            <View
              key={stage.id}
              style={[
                styles.stageCard,
                stage.completed ? styles.completedStage : styles.pendingStage,
              ]}
            >
              <View style={styles.stageHeader}>
                <View style={styles.stageNumberContainer}>
                  <Text style={styles.stageNumber}>{stage.id}</Text>
                </View>
                <Text style={styles.stageTitle}>{stage.title}</Text>
                {stage.completed && (
                  <View style={styles.completedBadge}>
                    <Ionicons name="checkmark" size={16} color="white" />
                  </View>
                )}
              </View>

              {stage.completed ? (
                <View style={styles.stageContent}>
                  <View style={styles.stageInfoRow}>
                    <Text style={styles.stageInfoLabel}>날짜:</Text>
                    <Text style={styles.stageInfoValue}>{stage.date}</Text>
                  </View>

                  <Text style={styles.stageDescription}>
                    {stage.description}
                  </Text>

                  <View style={styles.environmentInfo}>
                    <View style={styles.environmentItem}>
                      <Ionicons
                        name="thermometer-outline"
                        size={18}
                        color="#666"
                      />
                      <Text style={styles.environmentText}>
                        {stage.temperature}
                      </Text>
                    </View>
                    <View style={styles.environmentItem}>
                      <Ionicons name="water-outline" size={18} color="#666" />
                      <Text style={styles.environmentText}>
                        {stage.humidity}
                      </Text>
                    </View>
                  </View>

                  {stage.images.length > 0 && (
                    <ScrollView
                      horizontal
                      style={styles.imagesScrollView}
                      showsHorizontalScrollIndicator={false}
                    >
                      {stage.images.map((image, index) => (
                        <Image
                          key={index}
                          source={{ uri: image }}
                          style={styles.stageImage}
                        />
                      ))}
                    </ScrollView>
                  )}
                </View>
              ) : (
                <View style={styles.pendingStageContent}>
                  <Text style={styles.pendingText}>
                    {stage.id === 4 ? "진행 중..." : "대기 중..."}
                  </Text>
                  {stage.id === 4 && (
                    <TouchableOpacity
                      style={styles.updateButton}
                      onPress={() =>
                        router.push(`/journals/update/${stage.id}`)
                      }
                    >
                      <Text style={styles.updateButtonText}>기록 업데이트</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          ))}
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
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  editButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  titleSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#666",
    width: 70,
  },
  infoValue: {
    fontSize: 15,
    color: "#333",
  },
  statusBadge: {
    backgroundColor: "#5D3F6A",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  progressSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: "#EEEEEE",
    borderRadius: 6,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#5D3F6A",
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#5D3F6A",
    textAlign: "right",
  },
  stagesSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  stageCard: {
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  completedStage: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  pendingStage: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
  },
  stageHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 12,
  },
  stageNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#5D3F6A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stageNumber: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  stageTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  completedBadge: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  stageContent: {
    padding: 16,
    backgroundColor: "white",
  },
  stageInfoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  stageInfoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    width: 60,
  },
  stageInfoValue: {
    fontSize: 14,
    color: "#333",
  },
  stageDescription: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 12,
  },
  environmentInfo: {
    flexDirection: "row",
    marginBottom: 12,
  },
  environmentItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  environmentText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  imagesScrollView: {
    marginTop: 8,
  },
  stageImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
  },
  pendingStageContent: {
    padding: 16,
    backgroundColor: "white",
    alignItems: "center",
  },
  pendingText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 12,
  },
  updateButton: {
    backgroundColor: "#5D3F6A",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  updateButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 14,
  },
});
