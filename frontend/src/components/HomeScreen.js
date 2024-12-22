import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import UserProfile from "./UserProfile";

const Tab = createBottomTabNavigator();

// Home Screen
const HomeScreen = () => (
  <ScrollView contentContainerStyle={styles.scrollContainer}>
    <Text style={styles.header}>Welcome to the Home Page</Text>
    {/* {Array.from({ length: 20 }, (_, index) => (
      <View key={index} style={styles.card}>
        <Text>Card {index + 1}</Text>
      </View> */}
    <Map />
  </ScrollView>
);

// Profile Screen
const ProfileScreen = () => (
  <View style={styles.center}>
    <Text style={styles.header}>Profile Page</Text>
  </View>
);

// SOS Button Component
const SOSButton = ({ onPress }) => (
  <TouchableOpacity style={styles.sosButton} onPress={onPress}>
    <Text style={{ color: "white" }}>SOS</Text>
  </TouchableOpacity>
);

const Main = () => {
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
    height: 70,
    position: "absolute",
    bottom: 0,
  },
  sosButton: {
    position: "absolute",
    bottom: 35,
    alignSelf: "center",
    backgroundColor: "red",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    zIndex: 10,
  },
});

export default HomeScreen;
