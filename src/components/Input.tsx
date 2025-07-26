import React, { useState, forwardRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  secure?: boolean;
}

const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, secure, ...props }, ref) => {
    const [hide, setHide] = useState(secure ?? false);

    const [focused, setFocused] = useState(false);

    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>

        <View
          style={[
            styles.inputWrapper,
            { borderColor: focused ? "#3b82f6" : "#ddd", borderWidth: 1.5 },
          ]}
        >
          <TextInput
            ref={ref}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={[styles.input, { flex: 1 }]}
            secureTextEntry={hide}
            placeholder={label}
            returnKeyType={props.returnKeyType}
            onSubmitEditing={props.onSubmitEditing}
            {...props}
          />

          {secure && (
            <TouchableOpacity onPress={() => setHide(!hide)}>
              <Icon name={hide ? "eye-off" : "eye"} size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    fontSize: 16,
  },
  error: {
    color: "red",
    marginTop: 4,
    fontSize: 13,
  },
});

export default Input;
