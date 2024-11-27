import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";

const Map = () => {
  const [hospitalName, setHospitalName] = useState("");
  const [coordinates, setCoordinates] = useState("27.1, 84");
  const [showMap, setShowMap] = useState(false);

  const handleMapMessage = (event) => {
    const { latitude, longitude } = JSON.parse(event.nativeEvent.data);
    setCoordinates(`${latitude}, ${longitude}`);
    setShowMap(false);
  };

  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Leaflet Map</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { height: 100vh; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map').setView([${coordinates.split(",")[0]}, ${
    coordinates.split(",")[1]
  }], 13);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map);

          const marker = L.marker([${coordinates.split(",")[0]}, ${
    coordinates.split(",")[1]
  }]).addTo(map);
          
          map.on('click', function(e) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            marker.setLatLng([lat, lng]);
            window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: lat, longitude: lng }));
          });
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Register Hospital</Text>

      <TextInput
        style={styles.input}
        placeholder="Hospital Name"
        value={hospitalName}
        onChangeText={setHospitalName}
      />

      <TouchableOpacity
        onPress={() => {
          console.log("Setting showMap to true");
          setShowMap(true);
        }}
      >
        <View style={styles.input}>
          <Text>{coordinates}</Text>
        </View>
      </TouchableOpacity>

      {showMap && (
        <WebView
          originWhitelist={["*"]}
          source={{ html: mapHtml }}
          javaScriptEnabled={true}
          onMessage={handleMapMessage}
          style={{ flex: 1, height: "100%", width: "100%" }}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => Alert.alert("Registered", coordinates)}
      >
        <Text style={styles.buttonText}>Register Hospital</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Map;
