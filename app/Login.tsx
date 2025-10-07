import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const API_KEY = "679939d97c61adc1e9f87bc428d4fe882525b2fe7ca856153358302a698fa49b";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("https://cis.kku.ac.th/api/classroom/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("API response:", data); // 🔍 ดูใน Terminal

      const token = data.data.token;
      const name = `${data.data.firstname} ${data.data.lastname}`;
      const id = data.data._id;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userName", name);
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("userId", id);

      Alert.alert("เข้าสู่ระบบสำเร็จ", `สวัสดีคุณ ${name}`);
      router.push("/members");
    
  } catch (error) {
    Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    console.log("Fetch error:", error);
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>เข้าสู่ระบบ CIS</Text>

      <TextInput
        style={styles.input}
        placeholder="อีเมลนักศึกษา (เช่น student@kkumail.com)"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="รหัสผ่าน"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: "#9ca3af" }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 20,
  },
  input: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderColor: "#cbd5e1",
    borderWidth: 1,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
