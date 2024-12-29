import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For storing JWT token

const HomeScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const navigation = useNavigation(); // For navigation

  // Check if the user is logged in by verifying JWT token
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); // Retrieve the JWT token
        if (token) {
          setIsLoggedIn(true); // Token exists, user is logged in
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

  // Handle the Book Ambulance action
  const handleBookAmbulance = () => {
    if (isLoggedIn) {
      navigation.navigate("Test"); // Navigate to Map if logged in
    } else {
      navigation.navigate("Login"); // Navigate to Login if not logged in
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome back, !</Text>
        <Text style={styles.subHeaderText}>
          Emergency services are just a tap away.
        </Text>
      </View>

      {/* Grid Section */}
      <View style={styles.grid}>
        <TouchableOpacity style={styles.card} onPress={handleBookAmbulance}>
          <FontAwesome5 name="ambulance" size={50} color="red" />
          <Text style={styles.cardText}>Book Ambulance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="call" size={40} color="red" />
          <Text style={styles.cardText}>Emergency Call</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="business" size={40} color="red" />
          <Text style={styles.cardText}>
            <Text style={{ fontWeight: "bold" }}>Nearby</Text> Hospitals
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="time" size={40} color="red" />
          <Text style={styles.cardText}>Medical History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#E63946",
    padding: 30,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  subHeaderText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 20,
  },
  card: {
    width: "45%",
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
});

export default HomeScreen;
