import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";

const AvailableAmbulance = ({ route }) => {
  const { drivers } = route.params; // Destructure drivers from route params
  console.log("Available ambulances:", drivers);

  const bookAmbulance = (ambulanceNumber) => {
    Alert.alert(
      "Booking Confirmed",
      `You have booked ambulance: ${ambulanceNumber}`
    );
  };

  const renderDriverCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.header}>Ambulance Details</Text>
      <Text style={styles.text}>Ambulance Number: {item.ambulanceNumber}</Text>
      <Text style={styles.text}>Ambulance Type: {item.ambulanceType}</Text>
      <Text style={styles.text}>
        Distance: {item.distance.toFixed(2)} meters
      </Text>
      <Text style={styles.header}>Driver Details</Text>
      <Text style={styles.text}>Name: {item.driverDetails?.fullname}</Text>
      <Text style={styles.text}>Phone Number: {item.driverDetails?.phone}</Text>
      <Text style={styles.text}>
        License Number: {item.driverDetails?.licenseNumber}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => bookAmbulance(item.ambulanceNumber)}
      >
        <Text style={styles.buttonText}>Book</Text>
      </TouchableOpacity>
    </View>
  );

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
