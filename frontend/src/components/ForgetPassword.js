import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";

import { useNavigation } from "@react-navigation/native";
const ForgotPassword = () => {
  const navigation = useNavigation();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  let ip = "192.168.18.12";
  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  const handleSendOtp = async () => {
    if (!role || !email) {
      setError("Please select role and enter your email");
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(
        `http://${ip}:5000/api/forgot-password`,
        { email, role }
      );
      if (response.status === 404) {
        setError("Email not found");
      }
      if (response.data) {
        setIsOtpSent(true);
        setMessage("OTP sent to your email");
        setError("");
      } else {
        setError("Try later");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError("Error sending OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(`http://${ip}:5000/verify-otp`, {
        email,
        otp,
      });
      setMessage(response.data.message);
      setError("");
      setIsOtpVerified(true);
    } catch (error) {
      setError("Invalid OTP");
      setMessage("");
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await axios.post(
        `http://${ip}:5000/api/change-password`,
        {
          email,
          newPassword,
          role,
        }
      );
      if (response.status === 200) {
        Alert.alert(
          "Password Changed",
          "You can now log in with your new password."
        );
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }
    } catch (error) {
      setError("Error changing password");
      setMessage("");
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Forgot Password</Text>

        {message && <Text style={styles.successMessage}>{message}</Text>}
        {error && <Text style={styles.errorMessage}>{error}</Text>}

        {!isOtpVerified && (
          <View style={styles.row}>
            <Text style={styles.label}>Select Role</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[styles.radioButton, role === "User" && styles.selected]}
                onPress={() => handleRoleChange("User")}
                disabled={isOtpSent}
              >
                <View
                  style={[
                    styles.radioCircle,
                    role === "User" && styles.selectedCircle,
                  ]}
                />
                <Text style={styles.radioText}>User</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  role === "Driver" && styles.selected,
                ]}
                onPress={() => handleRoleChange("Driver")}
                disabled={isOtpSent}
              >
                <View
                  style={[
                    styles.radioCircle,
                    role === "Driver" && styles.selectedCircle,
                  ]}
                />
                <Text style={styles.radioText}>Driver</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!isOtpVerified && (
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!isOtpSent} // Disable email field after OTP is sent
          />
        )}

        {!isOtpSent ? (
          <TouchableOpacity
            style={styles.btn}
            onPress={handleSendOtp}
            disabled={isLoading}
          >
            <Text style={styles.btnText}>Send OTP</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
            />
            {!isOtpVerified && (
              <TouchableOpacity
                style={styles.btn}
                onPress={handleVerifyOtp}
                disabled={isLoading}
              >
                <Text style={styles.btnText}>Verify OTP</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {isOtpVerified && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.btn} onPress={handleChangePassword}>
              <Text style={styles.btnText}>Change Password</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    minHeight: "100vh",
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  btn: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
  },
  successMessage: {
    color: "green",
    textAlign: "center",
    marginBottom: 10,
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
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
  row: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#978E8E",
    marginBottom: 5,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});

export default ForgotPassword;
