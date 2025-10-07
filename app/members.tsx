import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

type Student = {
  _id?: string;
  firstname: string;
  lastname: string;
  email: string;
  type: string;
};

export default function StudentsByYearScreen() {
  const { token } = useLocalSearchParams();
  const [year, setYear] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const API_KEY =
    "679939d97c61adc1e9f87bc428d4fe882525b2fe7ca856153358302a698fa49b";

  const fetchByYear = async () => {
    if (!year.trim()) {
      Alert.alert("กรุณากรอกปีการศึกษา");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://cis.kku.ac.th/api/classroom/class/${year}`,
        {
          headers: {
            Accept: "application/json",
            "x-api-key": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log("🎓 Data:", data);

      if (!res.ok) {
        throw new Error(data.message || "โหลดข้อมูลไม่สำเร็จ");
      }

      setStudents(data.data || []);
    } catch (err: any) {
      console.error("Error:", err);
      Alert.alert("เกิดข้อผิดพลาด", err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.input}
        placeholder="เช่น 2565"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={year}
        onChangeText={setYear}
      />
      <TouchableOpacity style={styles.button} onPress={fetchByYear}>
        <Text style={styles.buttonText}>ค้นหา</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <ActivityIndicator size="large" color="#fff" style={{ marginVertical: 20 }} />
      )}
      <FlatList
        data={students}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>
              {item.firstname} {item.lastname}
            </Text>
            <Text style={styles.email}>📧 {item.email}</Text>
            <Text style={styles.role}>🎓 {item.type}</Text>
          </View>
        )}
        ListHeaderComponent={renderHeader}
        stickyHeaderIndices={[0]} // 🔹 ทำให้ search bar อยู่ด้านบนตลอดเวลา
        ListEmptyComponent={
          !loading ? <Text style={styles.emptyText}>ไม่มีข้อมูลนักศึกษา</Text> : null
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A2980",
  },
  searchContainer: {
    backgroundColor: "#1A2980",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#1A2980",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 8,
  },
  name: { color: "#fff", fontSize: 18, fontWeight: "600" },
  email: { color: "#ddd", fontSize: 14, marginTop: 3 },
  role: { color: "#aee", fontSize: 13, marginTop: 5 },
  emptyText: {
    color: "#fff",
    fontSize: 16,
    fontStyle: "italic",
    marginTop: 20,
    textAlign: "center",
  },
});
