import React from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";

const privacyPolicyContent = [
  {
    text: "Last Updated: 2024-08-26",
  },
  {
    text: "Welcome to AmbuTrack. This Privacy Policy outlines how we collect, use, and protect your personal information while using our services.",
  },
  {
    subheading: "1. Data Collection",
    text: "We collect personal information including name, phone number, and location to facilitate ambulance bookings. This information is only used for service purposes.",
  },
  {
    subheading: "2. Data Sharing",
    text: "We share your information with third-party ambulance operators strictly to fulfill your service request. We do not sell or rent your data to third parties.",
  },
  {
    subheading: "3. Security Measures",
    text: "We use encryption and secure servers to protect your personal data. However, no method of transmission over the internet is completely secure.",
  },
  {
    subheading: "4. Your Rights",
    text: "You have the right to access, update, or delete your personal information. Contact us at ambutrack2024@gmail.com for any concerns.",
  },
  {
    subheading: "5. Contact Us",
    text: "For any questions or concerns about this policy, please contact us at:\nEmail: ambutrack2024@gmail.com\nPhone: 9866959525, 9809234720",
  },
];

const DriverPrivacyPolicy = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.heading}>Privacy Policy</Text>
        {privacyPolicyContent.map((section, index) => (
          <View key={index} style={styles.section}>
            {section.subheading && (
              <Text style={styles.subheading}>{section.subheading}</Text>
            )}
            <Text style={styles.text}>{section.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={{ height: 50 }}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 50,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
  },
  subheading: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 5,
    color: "black",
  },
  text: {
    fontSize: 16,
    color: "black",
    lineHeight: 24,
  },
  section: {
    marginBottom: 10,
  },
});

export default DriverPrivacyPolicy;
