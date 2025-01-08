import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DriverHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // Added error state

  // Set your IP address
  // let ip = "192.168.18.12";
  let ip = "172.30.3.131";

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
        // console.log("tko ", token);
        const response = await axios.get(
          `http://${ip}:5000/api/getAllBookings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        // console.log("a", response.data);
        if (response.status !== 200) {
          throw new Error("Failed to fetch bookings");
        }
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Failed to load bookings. Please try again.");
        console.error(error);
      }
    };

    fetchBookings();
  }, []);

  const renderBookingItem = ({ item }) => {
    if (!item) return null;

    const { _id, price, bookingstatus } = item;

    return (
      <View style={styles.bookingItem}>
        <Text style={styles.bookingTitle}>Booking ID: {_id}</Text>
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
      ) : error ? (
        <Text>{error}</Text>
      ) : bookings.length === 0 ? (
        <Text>No bookings available</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id.toString()}
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
