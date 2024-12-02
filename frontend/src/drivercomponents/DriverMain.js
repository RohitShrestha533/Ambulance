import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview"; // Import WebView to display the map
import DriverProfile from "./DriverProfile";

import AsyncStorage from "@react-native-async-storage/async-storage";
const Tab = createBottomTabNavigator();

const DriverBookingsScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.header}>Welcome to the Page</Text>
    </ScrollView>
  );
};

const SOSButton = ({ onPress }) => (
  <TouchableOpacity style={styles.sosButton} onPress={onPress}>
    <Text style={{ color: "white" }}>SOS</Text>
  </TouchableOpacity>
);

const DriverMain = () => {
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
          component={DriverBookingsScreen}
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
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
            tabBarLabel: "Profile",
          }}
        />
      </Tab.Navigator>

      {/* SOS Button */}
      <SOSButton
        onPress={() => {
          alert("SOS Button Pressed!");
        }}
      />
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
