import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const AmbuLocation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  let ip = "192.168.18.12";

  useEffect(() => {
    const fetchLocationAndBooking = async () => {
      // Get User's Current Location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem("token");

      // Fetch Booking Data
      fetch(`http://${ip}:5000/driver/api/ambu`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token here
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("API Response:", data);

          // Check if response is an array or object
          const booking = Array.isArray(data) ? data[0] : data;

          if (
            !booking ||
            booking.bookingstatus === "completed" ||
            !booking.driverId
          ) {
            console.log("No active bookings found");
            return;
          }

          fetch(
            `http://${ip}:5000/driver/api/ambudrivers/${booking.driverId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token here
              },
            }
          )
            .then((res) => {
              if (!res.ok) {
                return res.text().then((text) => {
                  console.error("Error response:", text); // Log the raw response (likely HTML)
                  throw new Error("Error fetching driver data");
                });
              }
              return res.json();
            })
            .then((driver) => {
              console.log("Driver Location:", driver);

              if (driver.latitude && driver.longitude) {
                setDriverLocation({
                  latitude: driver.longitude,
                  longitude: driver.latitude,
                });
              } else {
                console.log("Driver location data is missing");
              }
            })
            .catch((err) => console.error("Error fetching driver data", err));
        })
        .catch((err) => console.error("Error fetching booking data", err));
    };

    fetchLocationAndBooking(); // Call the function
  }, []);

  const mapHTML = ` 
    <!DOCTYPE html>
    <html>
    <head>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <style>
        #map { height: 100vh; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([27.7172, 85.3240], 13); // Default Kathmandu

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        ${
          userLocation
            ? ` 
          var userMarker = L.marker([${userLocation.latitude}, ${userLocation.longitude}])
            .addTo(map)
            .bindPopup('You are here').openPopup();
        `
            : ""
        }

        ${
          driverLocation
            ? ` 
          var driverMarker = L.marker([${driverLocation.latitude}, ${driverLocation.longitude}])
            .addTo(map)
            .bindPopup('Driver Location').openPopup();
        `
            : ""
        }
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView originWhitelist={["*"]} source={{ html: mapHTML }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default AmbuLocation;
