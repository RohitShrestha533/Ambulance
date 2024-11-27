import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const AdminDashboard = () => {
  const navigation = useNavigation();
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [logpasswordVisible, setLogPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <ImageBackground
          source={require("../../assets/AmbuTrackLogo.png")}
          style={styles.imageBackground}
        >
          <View style={styles.tabContainer}>
            <TouchableOpacity onPress={() => setIsSignUp(false)}>
              <Text style={[styles.tabText, !isSignUp && styles.activeTab]}>
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsSignUp(true)}>
              <Text style={[styles.tabText, isSignUp && styles.activeTab]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
      <View>
        <Text>Welcome back admin</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageBackground: {
    height: 350,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: "#555",
  },

  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#f00",
    color: "#f00",
  },
  formContainer: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#f00",
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
});

export default AdminDashboard;
