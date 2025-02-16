import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  let ip = "192.168.18.12";
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          setIsLoggedIn(true);
          fetchUserData(token);
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

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`http://${ip}:5000/UserData`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(data);
      setUserData(data); // Set the fetched user data to state
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };
  const nearhospital = () => {
    navigation.navigate("Nearhospital");
  };
  const userhistory = () => {
    navigation.navigate("History");
  };
  const handleBookAmbulance = () => {
    if (isLoggedIn) {
      navigation.navigate("Test");
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Welcome {userData?.user?.fullname || "!"} !
        </Text>
        <Text style={styles.subHeaderText}>
          Emergency services are just a tap away.
        </Text>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity style={styles.card} onPress={handleBookAmbulance}>
          <FontAwesome5 name="ambulance" size={50} color="red" />
          <Text style={styles.cardText}>Book Ambulance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => alert("calling")}>
          <Ionicons name="call" size={40} color="red" />
          <Text style={styles.cardText}>Emergency Call</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={nearhospital}>
          <Ionicons name="business" size={40} color="red" />
          <Text style={styles.cardText}>
            <Text style={{ fontWeight: "bold" }}>Nearby</Text> Hospitals
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={userhistory}>
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
