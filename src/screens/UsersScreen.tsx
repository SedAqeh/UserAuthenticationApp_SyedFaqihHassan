import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../components/ScreenWrapper";
import { useNavigation } from "@react-navigation/native";

interface User {
  name: string;
  email: string;
  password: string;
}

export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([]);

  const loadUsers = async () => {
    const usersJson = await AsyncStorage.getItem("users");
    const list = usersJson ? JSON.parse(usersJson) : [];
    setUsers(list);
  };

  const deleteUser = async (email: string) => {
    Alert.alert("Delete User", `Are you sure you want to delete ${email}?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updated = users.filter((u) => u.email !== email);
          await AsyncStorage.setItem("users", JSON.stringify(updated));
          setUsers(updated);
        },
      },
    ]);
  };

  useEffect(() => {
    const unsubscribe = loadUsers();
    return () => {};
  }, []);

  const navigation = useNavigation<any>();

  return (
    <ScreenWrapper>
      <View style={styles.outer}>
        <View style={styles.wrapper}>
          <View style={styles.closeWrapper}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Registered Users</Text>

          <FlatList
            data={users}
            keyExtractor={(item) => item.email}
            scrollEnabled={true}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.userItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.email}>{item.email}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteUser(item.email)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No users found.</Text>
            }
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  email: {
    color: "#555",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    padding: 8,
    borderRadius: 6,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeWrapper: {
    position: "absolute",
    top: 24,
    left: 24,
    zIndex: 10,
  },
  closeText: {
    fontSize: 16,
    color: "#6b7280",
  },

  outer: {
    flex: 1,
    alignItems: "center",
  },

  wrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    paddingTop: 64,
    maxWidth: 400,
    width: "100%",
  },

  listContent: {
    paddingBottom: 24,
  },

  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },

  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 16,
  },
});
