import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AvailableAmbulance = ({ route }) => {
  const { drivers, mylocation, destination, totaldistance } = route.params; // Destructure drivers from route params
  console.log("Available ambulances:", drivers);
  console.log("UserLocation:", mylocation);
  console.log("DestinationLocation:", destination);
  // let ip = "192.168.218.106";
  let ip = "192.168.18.12";
  const bookAmbulance = async (
    ambulanceId,
    driverId,
    hospitalId,
    distance,
    userLocation,
    destination,
    price,
    ambulanceType
  ) => {
    try {
      const token =
        Platform.OS === "web"
          ? localStorage.getItem("token")
          : await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("No token found, please login again");
      }
      const response = await fetch(`http://${ip}:5000/book-ambulance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ambulanceId,
          driverId,
          hospitalId,
          distance,
          destination,
          userLocation,
          price,
          ambulanceType,
        }),
      });
      if (!response.ok) {
        console.error(`HTTP Error: ${response.status}`);
        throw new Error("Failed to book ambulance");
      }
      const data = await response.json();
      console.log("Ambulance booking response:", data);
      Alert.alert(
        "Booking Requested",
        `Booking successful! ID: ${data.bookingId}, Status: ${data.status}`
      );
    } catch (error) {
      console.error("Error booking ambulance:", error);
      Alert.alert("Error", "Unable to book ambulance. Please try again.");
    }
  };

  const renderDriverCard = ({ item }) => {
    const price =
      item.ambulanceType === "Advance"
        ? totaldistance * 0.1
        : item.ambulanceType === "Basic"
        ? totaldistance * 0.05
        : item.ambulanceType === "Transport"
        ? totaldistance * 0.03
        : 0; // Default to 0 if ambulance type is invalid

    return (
      <View style={styles.card}>
        <Text style={styles.header}>Ambulance Details</Text>
        <Text style={styles.header}>Price: {price.toFixed(2)}</Text>
        <Text style={styles.text}>Name: {item.driverDetails?.fullname}</Text>
        <Text style={styles.text}>
          Phone Number: {item.driverDetails?.phone}
        </Text>
        <Text style={styles.text}>
          Ambulance Number: {item.ambulanceNumber}
        </Text>
        <Text style={styles.text}>Ambulance Type: {item.ambulanceType}</Text>
        <Text style={styles.text}>
          Distance: {item.distance.toFixed(2)} meters
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            bookAmbulance(
              item._id,
              item.driver,
              item.hospital,
              item.distance.toFixed(2),
              mylocation,
              destination,
              price.toFixed(2),
              item.ambulanceType
            )
          }
        >
          <Text style={styles.buttonText}>Book</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={drivers.ambulances}
        keyExtractor={(item) => item._id}
        renderItem={renderDriverCard}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContent: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  card: {
    backgroundColor: "red",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: "white",
  },
  button: {
    marginTop: 16,
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});

export default AvailableAmbulance;
