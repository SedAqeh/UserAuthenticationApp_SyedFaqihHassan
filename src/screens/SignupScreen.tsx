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
import { isFilled, isValidEmail, isValidPassword } from "../utils/validation";
import { LinearGradient } from "expo-linear-gradient";
import ScreenWrapper from "../components/ScreenWrapper";

export default function SignupScreen() {
  const { signup } = useContext(AuthContext);
  const navigation = useNavigation<any>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const validate = () => {
    if (!isFilled(name, email, password)) {
      setError("All fields are required");
      return false;
    }
    if (!isValidEmail(email)) {
      setError("Invalid email format");
      return false;
    }
    if (!isValidPassword(password)) {
      setError("Password must be at least 6 characters");
      return false;
    }
    setError("");
    return true;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    const success = await signup(name, email, password);
    setLoading(false);

    if (!success) {
      setError("An account with this email already exists.");
    }
  };

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Sign Up</Text>

      <Input
        label="Name"
        value={name}
        onChangeText={setName}
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
      />

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        returnKeyType="next"
        ref={emailRef}
        onSubmitEditing={() => passwordRef.current?.focus()}
      />

      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        secure
        returnKeyType="done"
        ref={passwordRef}
        onSubmitEditing={handleSignup}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity onPress={handleSignup} disabled={loading}>
        <LinearGradient
          colors={["#10b981", "#059669"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creating account..." : "Signup"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Go to Login</Text>
        </TouchableOpacity>
      </View>
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
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },

  button: {
    backgroundColor: "#10b981",
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
    color: "#10b981",
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
});
