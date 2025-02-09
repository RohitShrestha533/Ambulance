import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import WebView from "react-native-webview";
import axios from "axios";

const Hi = () => {
  const [placeName, setPlaceName] = useState("");
  const [coordinates, setCoordinates] = useState(null);

  const getCoordinates = async (placeName) => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        placeName
      )}&format=json`;
      const response = await axios.get(url);

      if (response.data.length > 0) {
        const { lat, lon, display_name } = response.data[0];
        console.log(`Location Found: ${display_name}`);
        console.log(`Latitude: ${lat}, Longitude: ${lon}`);
        return { lat, lon, displayName: display_name };
      } else {
        console.error("Location not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      return null;
    }
  };

  const handleSearch = async () => {
    const coords = await getCoordinates(placeName);
    if (coords) {
      setCoordinates(coords);
      setRegion({
        latitude: parseFloat(coords.lat),
        longitude: parseFloat(coords.lon),
        latitudeDelta: 0.0922, // You can adjust these for zoom level
        longitudeDelta: 0.0421,
      });
    }
  };

  const generateMapHTML = (lat, lng) => `<!DOCTYPE html>
  <html>
    <head>
      <title>Leaflet Map with Search</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; height: 100vh; }
        #map { height: 100%; width: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = L.map('map').setView([${lat}, ${lng}], 13); // Set map to the given coordinates
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
  
        let marker = L.marker([${lat}, ${lng}]).addTo(map); // Initial marker at the given coordinates
  
        // Function to update the marker on the map
        function updateMarker(lat, lng) {
          marker.setLatLng([lat, lng]);
          map.setView([lat, lng], 15);
        }
  
        // Click on the map to update coordinates
        map.on('click', function(e) {
          const lat = e.latlng.lat;
          const lng = e.latlng.lng;
          updateMarker(lat, lng);
          window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: lat, longitude: lng }));
        });
      </script>
    </body>
  </html>`;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter place name"
        value={placeName}
        onChangeText={setPlaceName}
      />
      <Button title="Get Location" onPress={handleSearch} />

      {coordinates && (
        <WebView
          style={styles.map}
          originWhitelist={["*"]}
          source={{ html: generateMapHTML(coordinates.lat, coordinates.lon) }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  map: {
    marginTop: 20,
    width: "100%",
    height: 400,
  },
});

export default Hi;
