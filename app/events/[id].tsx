import { useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";

// 참가자 타입 정의
type Participant = {
  id: string;
  name: string;
  avatarUrl: string;
};

export default function EventDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // 더미 데이터
  const [event] = useState({
    id,
    title: "전통 막걸리 시음회",
    date: "2023년 7월 15일 14:00",
    endDate: "2023년 7월 15일 16:00",
    location: "서울 강남구 테헤란로 123",
    address: "서울특별시 강남구 테헤란로 123 2층 스튜디오",
    description:
      "다양한 전통 막걸리를 시음해보는 모임입니다. 같이 양조에 관심 있으신 분들, 집에서 만든 술을 가져오셔서 함께 나누고 싶으신 분들, 모두 환영합니다. 간단한 안주가 준비되어 있습니다.",
    maxParticipants: 10,
    currentParticipants: 5,
    thumbnailUrl: "https://via.placeholder.com/300x200",
    isHost: true,
    hostName: "홍길동",
    fee: "10,000원",
    participants: [
      { id: "1", name: "홍길동", avatarUrl: "https://via.placeholder.com/50" },
      { id: "2", name: "김철수", avatarUrl: "https://via.placeholder.com/50" },
      { id: "3", name: "이영희", avatarUrl: "https://via.placeholder.com/50" },
      { id: "4", name: "박지민", avatarUrl: "https://via.placeholder.com/50" },
      { id: "5", name: "최동욱", avatarUrl: "https://via.placeholder.com/50" },
    ],
  });

  const [isParticipating, setIsParticipating] = useState(false);

  const handleParticipation = () => {
    // 실제 기능은 구현하지 않고 상태만 변경
    setIsParticipating(!isParticipating);
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
        <Text style={styles.headerTitle}>시음회 상세</Text>
        {event.isHost && (
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={24} color="#5D3F6A" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <Image
          source={{ uri: event.thumbnailUrl }}
          style={styles.eventImage}
          resizeMode="cover"
        />

        <View style={styles.titleSection}>
          <Text style={styles.title}>{event.title}</Text>
          {event.isHost && (
            <View style={styles.hostBadge}>
              <Text style={styles.hostBadgeText}>주최자</Text>
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>주최자:</Text>
            <Text style={styles.infoValue}>{event.hostName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>날짜:</Text>
            <Text style={styles.infoValue}>{event.date}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>종료:</Text>
            <Text style={styles.infoValue}>{event.endDate}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>장소:</Text>
            <Text style={styles.infoValue}>{event.location}</Text>
          </View>

          <View style={styles.addressRow}>
            <Text style={styles.address}>{event.address}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="cash-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>참가비:</Text>
            <Text style={styles.infoValue}>{event.fee}</Text>
          </View>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>설명</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        <View style={styles.participantsSection}>
          <View style={styles.participantsHeader}>
            <Text style={styles.sectionTitle}>참가자</Text>
            <Text style={styles.participantsCount}>
              {event.currentParticipants}/{event.maxParticipants}
            </Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${
                    (event.currentParticipants / event.maxParticipants) * 100
                  }%`,
                },
              ]}
            />
          </View>

          <View style={styles.participantsList}>
            {event.participants.map((participant: Participant) => (
              <View key={participant.id} style={styles.participantItem}>
                <Image
                  source={{ uri: participant.avatarUrl }}
                  style={styles.participantAvatar}
                />
                <Text style={styles.participantName}>{participant.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionsSection}>
          {event.isHost ? (
            <>
              <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>시음회 취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.messageButton}
                onPress={() => router.push("/messages/event/" + event.id)}
              >
                <Text style={styles.messageButtonText}>참가자에게 메시지</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[
                styles.participateButton,
                isParticipating && styles.cancelParticipationButton,
              ]}
              onPress={handleParticipation}
            >
              <Text
                style={[
                  styles.participateButtonText,
                  isParticipating && styles.cancelParticipationText,
                ]}
              >
                {isParticipating ? "참가 취소" : "참가 신청"}
              </Text>
            </TouchableOpacity>
          )}
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
    paddingBottom: 24,
  },
  eventImage: {
    width: "100%",
    height: 200,
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  hostBadge: {
    backgroundColor: "#5D3F6A",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  hostBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  infoSection: {
    padding: 16,
    backgroundColor: "white",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#666",
    marginLeft: 8,
    width: 50,
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  addressRow: {
    marginLeft: 28,
    marginBottom: 10,
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  descriptionSection: {
    padding: 16,
    backgroundColor: "white",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
  },
  participantsSection: {
    padding: 16,
    backgroundColor: "white",
    marginBottom: 8,
  },
  participantsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  participantsCount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5D3F6A",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#EEEEEE",
    borderRadius: 4,
    marginBottom: 16,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#5D3F6A",
    borderRadius: 4,
  },
  participantsList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  participantItem: {
    alignItems: "center",
    width: "20%",
    marginBottom: 16,
  },
  participantAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 4,
  },
  participantName: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
  actionsSection: {
    padding: 16,
    backgroundColor: "white",
    marginTop: 8,
  },
  participateButton: {
    backgroundColor: "#5D3F6A",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  participateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelParticipationButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  cancelParticipationText: {
    color: "#FF6B6B",
  },
  cancelButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  messageButton: {
    backgroundColor: "#5D3F6A",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  messageButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
