import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ImageBackground,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For mobile

const Login = () => {
  const navigation = useNavigation();
  const [isSignUp, setIsSignUp] = useState(true);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [logpasswordVisible, setLogPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  let ip = "192.168.18.12";
  // let ip = "172.30.2.208";

  async function UserLoginHandel() {
    if (!role) {
      alert("Please select a role before signing in.");
      return;
    }
    if (!["user", "driver"].includes(role)) {
      alert("Invalid role selected.");
      return;
    }
    const userData = {
      email,
      password,
      role,
    };

    try {
      let response;
      if (role === "user") {
        response = await axios.post(`http://${ip}:5000/userLogin`, userData);
      } else {
        response = await axios.post(`http://${ip}:5000/driverLogin`, userData);
      }
      const { status, message, token, fullName } = response.data;

      if (status === 200) {
        alert("Login successful");

        console.log("Token:", token);

        if (role === "user") {
          if (Platform.OS === "web") {
            localStorage.setItem("token", token);
          } else {
            await AsyncStorage.setItem("token", token);
          }
          navigation.reset({
            index: 0,
            routes: [{ name: "Main" }], // Main is the screen you want to navigate to
            // routes: [{ name: "Main" }],
          });
        } else {
          if (Platform.OS === "web") {
            localStorage.setItem("drivertoken", token);
          } else {
            await AsyncStorage.setItem("drivertoken", token);
          }
          navigation.reset({
            index: 0,
            routes: [{ name: "DriverMain" }],
          });
        }
      } else {
        alert(message);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong");
        console.error("Error:", error);
      }
    }
  }

  function UserRegisterHandel() {
    const userData = {
      email: email,
      phone,
      password,
      confirmpassword,
    };
    axios
      .post(`http://${ip}:5000/userRegister`, userData)
      .then((response) => {
        if (response.data.status === "ok") {
          alert("User created successfully");
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
              onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            ></TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => UserRegisterHandel()}
            >
              <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => {
                navigation.navigate("RegisterHospital");
              }}
            >
              <Text style={styles.register}>Register for Hospital</Text>
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

            <Picker
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Role" value="" />
              <Picker.Item label="User" value="user" />
              <Picker.Item label="Driver" value="driver" />
            </Picker>
            {/* Login Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => UserLoginHandel()}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => {
                navigation.navigate("RegisterHospital");
              }}
            >
              <Text style={styles.register}>Register for Hospital</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
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
  register: {
    textDecorationLine: "underline",
    fontSize: 16,
    color: "blue",
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
  picker: {
    width: "100%",
    marginBottom: 2,
    overflow: "hidden",
    marginTop: -10,
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

export default Login;
