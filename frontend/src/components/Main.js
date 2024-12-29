import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./HomeScreen";
import UserProfile from "./UserProfile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const SOSButton = ({ onPress }) => (
  <TouchableOpacity style={styles.sosButton} onPress={onPress}>
    <Text style={{ color: "white" }}>SOS</Text>
  </TouchableOpacity>
);
const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          setIsLoggedIn(true); // If token exists, the user is logged in
        } else {
          setIsLoggedIn(false); // No token, user is not logged in
        }
      } catch (error) {
        console.error("Error checking login status", error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  // Handle Profile tab click, check login status
  const handleProfileTabPress = () => {
    if (isLoggedIn) {
      navigation.navigate("UserProfile");
    } else {
      navigation.navigate("Login"); // Redirect to login if not logged in
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
              e.preventDefault(); // Prevent default tab press behavior
              handleProfileTabPress(); // Check login status before navigating
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
          alert("SOS Button Pressed!");
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
