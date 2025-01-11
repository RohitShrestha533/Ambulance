import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const History = ({ userId }) => {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // let ip = "172.30.3.131"; // Your backend IP address
  let ip = "192.168.18.12"; // Your backend IP address

  const fetchBookingHistory = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No token found, please login again");

        setLoading(false);
        return;
      }

      const response = await fetch(`http://${ip}:5000/userbookingHistory`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch booking history");
      }
      const data = await response.json();
      setBookingHistory(data);
      // console.log("bb", data);
    } catch (error) {
      console.error("Error fetching booking history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No token found, please login again");
        return;
      }

      const response = await fetch(`http://${ip}:5000/cancelBooking`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel the booking");
      }

      const data = await response.json();
      Alert.alert("Success", data.message);

      fetchBookingHistory();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      Alert.alert("Error", "Failed to cancel booking");
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  const renderBookingCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.header}>Booking Details</Text>
      <Text style={styles.text}>Ambulance Type: {item.ambulanceType}</Text>
      <Text style={styles.text}>
        Ambulance Number: {item.ambulanceId?.ambulanceNumber}
      </Text>
      <Text style={styles.text}>Driver Name: {item.driverId?.fullname}</Text>
      <Text style={styles.text}>Driver Phone: {item.driverId?.phone}</Text>
      <Text style={styles.text}>
        Booking Date: {new Date(item.createdAt).toLocaleString()}
      </Text>
      <Text style={styles.text}>
        Ambulance Distance: {item.distance.toFixed(2)} meters
      </Text>
      <Text style={styles.text}>Price: Rs {item.price}</Text>
      <Text style={styles.text}>Status: {item.bookingstatus}</Text>

      {item.bookingstatus === "pending" && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleCancel(item._id)}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const Separator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      {bookingHistory.length === 0 ? (
        <Text style={styles.noHistoryText}>No booking history found.</Text>
      ) : (
        <FlatList
          data={bookingHistory}
          keyExtractor={(item) => item._id}
          renderItem={renderBookingCard}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={Separator}
        />
      )}
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
  separator: {
    borderBottomWidth: 2,
    borderColor: "#EDEFEE",
    marginVertical: 8,
  },
  noHistoryText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
    color: "gray",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "black",
  },
  card: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  // card: {
  //   padding: 16,
  //   marginBottom: 16,
  //   borderRadius: 8,
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   elevation: 2,
  // },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: "black",
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default History;
