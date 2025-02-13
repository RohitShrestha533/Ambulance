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
import * as Location from "expo-location";
const DriverScreen = () => {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // let ip = "172.30.3.131";
  let ip = "192.168.18.12";

  const fetchBookingHistory = async () => {
    try {
      const token = await AsyncStorage.getItem("drivertoken");
      if (!token) {
        Alert.alert("Error", "No token found, please login again");
        setLoading(false);
        return;
      }

      const response = await fetch(`http://${ip}:5000/driverbookingHistory`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch booking history");
      }
      const data = await response.json();
      setBookingHistory(data);
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
      const token = await AsyncStorage.getItem("drivertoken");
      if (!token) {
        Alert.alert("Error", "No token found, please login again");
        return;
      }

      const response = await fetch(`http://${ip}:5000/drivercancelBooking`, {
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
  const handleConfirm = async (bookingId, msg) => {
    try {
      const token = await AsyncStorage.getItem("drivertoken");
      if (!token) {
        Alert.alert("Error", "No token found, please login again");
        return;
      }

      const response = await fetch(`http://${ip}:5000/confirmBooking`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId, msg }),
      });

      if (!response.ok) {
        throw new Error("Failed to confirm the booking");
      }

      const data = await response.json();
      Alert.alert("Success", data.message);

      fetchBookingHistory();
    } catch (error) {
      console.error("Error confirming booking:", error);
      Alert.alert("Error", "Failed to confirm booking");
    }
  };
  const handleComplete = async (bookingId, msg) => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        try {
          const location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;
          try {
            const token = await AsyncStorage.getItem("drivertoken");
            if (!token) {
              Alert.alert("Error", "No token found, please login again");
              return;
            }
            console.log(latitude, longitude);
            const response = await fetch(`http://${ip}:5000/completeBooking`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ bookingId, msg, latitude, longitude }),
            });

            if (!response.ok) {
              throw new Error("Failed to confirm the booking");
            }

            const data = await response.json();
            Alert.alert("Success", data.message);

            fetchBookingHistory();
          } catch (error) {
            console.error("Error confirming booking:", error);
            Alert.alert("Error", "Failed to confirm booking");
          }
        } catch (error) {
          Alert.alert("Error", "Failed to fetch location.");
          console.error("Location Error:", error);
        }
      } else {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to book an ambulance."
        );
      }
    };

    await requestLocationPermission();
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
      <Text style={styles.text}>User Name: {item.userId?.fullname}</Text>
      <Text style={styles.text}>User Phone: {item.userId?.phone}</Text>
      <Text style={styles.text}>
        Booking Date: {new Date(item.createdAt).toLocaleString()}
      </Text>
      <Text style={styles.text}>
        Distance: {item.distance.toFixed(2)} meters
      </Text>
      <Text style={styles.text}>Price: Rs {item.price}</Text>
      {/* <Text style={styles.text}>Price: Rs {item.price.toFixed(2)}</Text> */}
      <Text style={styles.text}>Status: {item.bookingstatus}</Text>

      {item.bookingstatus === "confirmed" && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => handleConfirm(item._id, "picked")}
        >
          <Text style={styles.ButtonText}>Picked Up ?</Text>
        </TouchableOpacity>
      )}
      {item.bookingstatus === "picked" && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => handleComplete(item._id, "completed")}
        >
          <Text style={styles.ButtonText}>Completed ?</Text>
        </TouchableOpacity>
      )}
      {item.bookingstatus === "pending" && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => handleConfirm(item._id, "confirmed")}
        >
          <Text style={styles.ButtonText}>Confirm</Text>
        </TouchableOpacity>
      )}
      {item.bookingstatus === "pending" && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleCancel(item._id)}
        >
          <Text style={styles.ButtonText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const Separator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to the Page</Text>
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
    marginBottom: 90,
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
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
    color: "black",
  },
  card: {
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
    color: "black",
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
    alignItems: "center",
  },
  confirmButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    alignItems: "center",
  },
  ButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DriverScreen;
