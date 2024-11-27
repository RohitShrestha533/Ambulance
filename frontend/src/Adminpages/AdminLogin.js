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

const AdminLogin = () => {
  const navigation = useNavigation();
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [logpasswordVisible, setLogPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  function AdminLoginHandel() {
    const adminData = {
      email: email,
      password,
    };

    axios
      .post("http://192.168.100.9:5000/adminLogin", adminData)
      .then((response) => {
        if (response.data.status === 200) {
          alert("Login successful");
          navigation.replace("Main");
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert("Something went wrong");
          console.log(error.response.data.message);
        }
      });
  }

  function AdminRegisterHandel() {
    const adminData = {
      email: email,
      phone,
      password,
      confirmpassword,
    };
    axios
      .post("http://192.168.100.9:5000/adminRegister", adminData)
      .then((response) => {
        if (response.data.status === "ok") {
          alert("Admin created successfully");
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          alert(error.response.data.message);
          console.log(error.response.data.message);
        } else {
          alert("Something went wrong");
        }
      });
  }

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

        <View style={styles.formContainer}>
          {isSignUp ? (
            <>
              {/* Sign Up Form */}
              <TextInput
                style={styles.input}
                placeholder="Email*"
                value={email}
                onChangeText={setEmail}
              />

              <TextInput
                style={styles.input}
                value={phone}
                placeholder="Phone number 98********"
                keyboardType="phone-pad"
                onChangeText={setPhone}
              />

              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password*"
                secureTextEntry={!passwordVisible}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
              ></TouchableOpacity>

              <TextInput
                style={styles.input}
                value={confirmpassword}
                onChangeText={setConfirmpassword}
                placeholder="Confirm Password*"
                secureTextEntry={!confirmPasswordVisible}
              />
              <TouchableOpacity
                onPress={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
              ></TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => AdminRegisterHandel()}
              >
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Sign In Form */}
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email*"
              />

              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password*"
                secureTextEntry={!logpasswordVisible}
              />
              <TouchableOpacity
                onPress={() => setLogPasswordVisible(!logpasswordVisible)}
              ></TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => AdminLoginHandel()}
              >
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
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

export default AdminLogin;
