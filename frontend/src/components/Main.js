import React, { useEffect, useState } from "react";
import { View, Alert, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./HomeScreen";
import UserProfile from "./UserProfile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import axios from "axios";
const Tab = createBottomTabNavigator();

const SOSButton = ({ onPress }) => (
  <TouchableOpacity style={styles.sosButton} onPress={onPress}>
    <Text style={{ color: "white" }}>SOS</Text>
  </TouchableOpacity>
);
// let ip = "192.168.4.106";
let ip = "192.168.18.12";
const bookAmbulance = async () => {
  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      try {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        try {
          const token = await AsyncStorage.getItem("token");
          if (!token) {
            Alert.alert("Error", "No token found. Please login again.");
            return;
          }

          console.log("Sending request to drivers-nearby ");
          const response = await axios.post(
            `http://${ip}:5000/sosbook`,
            { latitude, longitude },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.status === 200) {
            Alert.alert("Success", "Ambulance booked successfully!");
          } else {
            Alert.alert("Error", "Failed to book ambulance. Try again.");
          }
        } catch (error) {
          Alert.alert("Error", "Failed to book ambulance.");
          console.error("Booking Error:", error);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch location.");
        console.error("Location Error:", error);
      }
    } else {
      Alert.alert(
        "Permission Denied",
        "Location permission is required to book an ambulance."
      );
    }
  };

  await requestLocationPermission();
};

const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking login status", error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);
  const handleProfileTabPress = () => {
    if (isLoggedIn) {
      navigation.navigate("UserProfile");
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
            tabBarLabel: "Home",
          }}
        />

        <Tab.Screen
          name="Profile"
          component={UserProfile}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              handleProfileTabPress();
            },
          }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
            tabBarLabel: "Profile",
          }}
        />
      </Tab.Navigator>
      <SOSButton
        onPress={() => {
          if (isLoggedIn) {
            Alert.alert(
              "Booking",
              "SOS Button Pressed! Are you sure for Booking Ambulance?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "OK",
                  onPress: () => {
                    bookAmbulance();
                  },
                },
              ]
            );
          } else {
            navigation.navigate("Login");
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sosButton: {
    position: "absolute",
    bottom: 45,
    alignSelf: "center",
    backgroundColor: "red",
    width: 70,
    height: 70,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    zIndex: 10,
  },
  tabBar: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    height: 90,
    paddingTop: 10,
    position: "absolute",
    bottom: 0,
  },
});

export default Main;
