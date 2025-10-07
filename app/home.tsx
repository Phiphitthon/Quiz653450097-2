import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  const { id, name, email, token } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcome}>ยินดีต้อนรับ 🎉</Text>
      <Text style={styles.username}>{name}</Text>
      <Text style={styles.subtext}>📧 {email}</Text>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() =>
          router.push({
            pathname: "/members",
            params: { token },
          })
        }
      >
        <Text style={styles.linkText}>📚 ดูรายชื่อนักศึกษา</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() =>
          router.push({
            pathname: "/",
            params: { name, token, userId: id },
          })
        }
      >
        <Text style={styles.linkText}>📝 ไปยังหน้าโพสต์</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.logoutText}>ออกจากระบบ</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A2980",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  welcome: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  username: { fontSize: 22, color: "#fff", marginBottom: 5 },
  subtext: { fontSize: 16, color: "#eee", marginBottom: 40, textAlign: "center" },

  linkButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  linkText: { color: "#fff", fontSize: 18, fontWeight: "500" },

  logoutButton: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 30,
    width: "60%",
    alignItems: "center",
  },
  logoutText: { color: "#1A2980", fontSize: 16, fontWeight: "bold" },
});
