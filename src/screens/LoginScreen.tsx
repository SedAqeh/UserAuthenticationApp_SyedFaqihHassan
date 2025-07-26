import React, { useState, useContext, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import Input from "../components/Input";
import { isValidEmail, isFilled } from "../utils/validation";
import { LinearGradient } from "expo-linear-gradient";
import ScreenWrapper from "../components/ScreenWrapper";

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const validate = () => {
    if (!isFilled(email, password)) {
      setError("All fields are required");
      return false;
    }
    if (!isValidEmail(email)) {
      setError("Invalid email format");
      return false;
    }
    setError("");
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (!success) {
      setError("Incorrect email or password");
    }
  };

  return (
    <ScreenWrapper>
      <Text style={styles.title}>User Authentication Demo</Text>

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />

      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        secure
        returnKeyType="done"
        ref={passwordRef}
        onSubmitEditing={handleLogin}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity onPress={handleLogin} disabled={loading}>
        <LinearGradient
          colors={["#3b82f6", "#2563eb"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.row}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.link}>Go to Signup</Text>
        </TouchableOpacity>
      </View>

      <LinearGradient
        colors={["#3b82f6", "#2563eb"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.adminWrapper}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Users")}>
          <Text style={styles.adminText}>Admin</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    marginBottom: 24,
    fontWeight: "bold",
    color: "#FFFFF0",
  },

  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  link: {
    color: "#3b82f6",
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  error: {
    color: "red",
    marginBottom: 12,
  },

  adminWrapper: {
    position: "absolute",
    bottom: 20,
    right: 20,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  adminText: {
    color: "#FFFFF0",
    fontSize: 14,
  },
});
