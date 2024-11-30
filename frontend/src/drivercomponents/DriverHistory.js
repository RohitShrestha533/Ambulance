import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DriverHistory = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>History Information</Text>
      <Text style={styles.info}>Name: </Text>
      <Text style={styles.info}>Email: driver@example.com</Text>
      <Text style={styles.info}>Phone: +123456789</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default DriverHistory;
