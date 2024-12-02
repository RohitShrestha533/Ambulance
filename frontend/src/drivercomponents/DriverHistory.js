import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DriverHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Set your IP address
  let ip = "192.168.100.9";

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token =
          Platform.OS === "web"
            ? localStorage.getItem("drivertoken")
            : await AsyncStorage.getItem("drivertoken");

        if (!token) {
          throw new Error("No token found, please login again");
        }

        const response = await axios.get(
          `http://${ip}:5000/api/getAllBookings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch bookings");
        }

        setBookings(response.data);
      } catch (error) {
        console.error("Error during fetching bookings: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const renderBookingItem = ({ item }) => {
    if (!item) return null;

    const {
      userlocation,
      destinationlocation,
      _id, // Use _id here
      price,
      bookingstatus,
    } = item;

    return (
      <View style={styles.bookingItem}>
        <Text style={styles.bookingTitle}>Booking ID: {_id}</Text>
        {/* <Text>
          User Location:{" "}
          {`Longitude: ${userlocation.coordinates[0]}, Latitude: ${userlocation.coordinates[1]}`}
        </Text>
        <Text>
          Destination Location:{" "}
          {`Longitude: ${destinationlocation.coordinates[0]}, Latitude: ${destinationlocation.coordinates[1]}`}
        </Text> */}
        <Text>Status: {bookingstatus}</Text>
        <Text>Price: ${price}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Driver Bookings</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : bookings.length === 0 ? (
        <Text>No bookings available</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id.toString()} // Use a unique key for each item
          renderItem={renderBookingItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
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

export default DriverHistory;
