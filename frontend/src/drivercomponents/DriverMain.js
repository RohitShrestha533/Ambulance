import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import DriverProfile from "./DriverProfile";
import DriverScreen from "./DriverScreen";
const Tab = createBottomTabNavigator();
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
const DriverMain = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  // const ip = "172.30.3.131"; // Set your server's IP address
  const ip = "192.168.240.106"; // Set your server's IP address

  const getCurrentLocation = async () => {
    try {
      console.log("Requesting location permission...");
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        alert("Permission to access location was denied");
        console.log("Location permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      console.log("Location fetched:", location.coords);

      // Update location state
      setLocation(location.coords);
      updateLocationInDB();
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };
  const updateLocationInDB = async () => {
    if (!location) {
      console.log("no location");
      return;
    }
    console.log(
      "Updating location to server:",
      location.latitude,
      location.longitude
    );

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("drivertoken");
      if (!token) {
        throw new Error("No token found, please login again");
      }
      console.log("ho", location.latitude, location.longitude);
      const response = await axios.post(
        `http://${ip}:5000/updateDriverLocation`,
        {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Location updated successfully!");
      }
    } catch (error) {
      console.error("Error updating location:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("drivertoken");
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
  }, []);
  const handleProfileTabPress = () => {
    if (isLoggedIn) {
      navigation.navigate("DriverProfile");
    } else {
      navigation.navigate("Login"); // Redirect to login if not logged in
    }
  };

  useEffect(() => {
    getCurrentLocation();

    const interval = setInterval(() => {
      console.log("Fetching location...");
      getCurrentLocation(); // Fetch new location every minute
    }, 60000);

    return () => clearInterval(interval);
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tab.Screen
          name="DriverHome"
          component={DriverScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
            tabBarLabel: "Home",
          }}
        />
        <Tab.Screen
          name="DriverProfile"
          component={DriverProfile}
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
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    marginBottom: 100,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
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
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  bookingItem: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default DriverMain;
