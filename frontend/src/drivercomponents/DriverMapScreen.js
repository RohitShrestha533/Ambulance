import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DriverMapScreen = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noBooking, setNoBooking] = useState(false);
  const ip = "192.168.240.106";

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("drivertoken");
        if (!token) {
          throw new Error("No token found, please login again");
        }

        const response = await fetch(`http://${ip}:5000/pickup`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("Booking API Response:", data);

        if (data.userLocation && data.destination) {
          setUserLocation(data.userLocation);
          setDestination(data.destination);
        } else {
          setNoBooking(true);
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setNoBooking(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (noBooking) {
    return (
      <View style={styles.noBookingContainer}>
        <Text style={styles.noBookingText}>No Booking Available</Text>
      </View>
    );
  }

  const mapHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <style>
      #map { height: 100vh; width: 100vw; }
    </style>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  </head>
  <body>
    <div id="map"></div>
    <script>
      var map = L.map('map').setView([${userLocation.latitude}, ${userLocation.longitude}], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      L.marker([${userLocation.latitude}, ${userLocation.longitude}]).addTo(map)
        .bindPopup('User Location').openPopup();

      L.marker([${destination.latitude}, ${destination.longitude}]).addTo(map)
        .bindPopup('Destination').openPopup();

      var latlngs = [
        [${userLocation.latitude}, ${userLocation.longitude}],
        [${destination.latitude}, ${destination.longitude}]
      ];
      var polyline = L.polyline(latlngs, {color: 'blue'}).addTo(map);
    </script>
  </body>
  </html>
`;

  return (
    <View style={{ flex: 1, height: 400 }}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: mapHtml }}
        style={{ flex: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  noBookingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noBookingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
  },
});

export default DriverMapScreen;
