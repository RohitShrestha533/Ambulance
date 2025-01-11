import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
const Driverpasswordchange = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState(null);
  const [newpassword, setNewpassword] = useState("");
  const [confirmnewpassword, setConfirmewpassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");

  // let ip = "172.30.3.131";
  let ip = "192.168.18.12";

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        console.log("Fetching driver data...");
        const token =
          Platform.OS === "web"
            ? localStorage.getItem("drivertoken")
            : await AsyncStorage.getItem("drivertoken");

        if (!token) {
          throw new Error("No token found, please login again");
        }

        const response = await axios.get(`http://${ip}:5000/driverData`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const data = response.data.driver;

        setFullname(data.fullname || "");
        setEmail(data.email || "");
      } catch (error) {
        console.error("Error fetching driver data:", error);
      }
    };

    fetchDriverData();
  }, []);

  const UpdateUserPassword = async () => {
    if (!password || !newpassword || !confirmnewpassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (newpassword !== confirmnewpassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("drivertoken");
      if (!token) {
        Alert.alert("Error", "No token found, please login again");
        return;
      }
      let role = "driver";

      const response = await axios.post(
        `http://${ip}:5000/driver/UpdateUserPassword`,
        { password, newpassword, confirmnewpassword, role, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "Password updated successfully!");
        setPassword(""); // Clear fields
        setNewpassword("");
        setConfirmewpassword("");
        navigation.navigate("DriverMain");
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to update password"
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "An error occurred while updating data"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Icon name={"person"} size={50} color="white" />
          </View>
          <Text style={styles.profileTitle}>{fullname || "Profile"}</Text>
        </View>

        {/* User Details */}
        <View style={styles.row}>
          <Text style={styles.label}>Current Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your current password"
            secureTextEntry
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            value={newpassword}
            onChangeText={setNewpassword}
            placeholder="Enter your new password"
            secureTextEntry
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Confirm New Password</Text>
          <TextInput
            style={styles.input}
            value={confirmnewpassword}
            onChangeText={setConfirmewpassword}
            placeholder="Confirm your new password"
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.btn} onPress={UpdateUserPassword}>
          <Text style={styles.saveButtonText}>Change Password</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollViewContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#D3D3D3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3D3838",
  },
  row: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#978E8E",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#A8A5A5",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: "#3D3838",
  },
  btn: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#A8A5A5",
    marginRight: 10,
  },
  selectedCircle: {
    backgroundColor: "red",
    borderColor: "red",
  },
  radioText: {
    fontSize: 16,
    color: "#3D3838",
  },
});

export default Driverpasswordchange;
