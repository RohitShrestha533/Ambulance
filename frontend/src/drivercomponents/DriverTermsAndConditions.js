import React from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";

const DriverTermsAndConditions = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.heading}>Terms and Conditions</Text>
        <Text style={styles.text}>Last Updated: 2019-08-26</Text>
        <Text style={styles.text}>
          Welcome to AmbuTrack, By accessing or using our ambulance booking
          application, you agree to abide by the following Terms and Conditions.
          Please read them carefully.
        </Text>

        <Text style={styles.subheading}>1. Acceptance of Terms</Text>
        <Text style={styles.text}>
          By registering, accessing, or using the AmbuTrack, you agree to these
          Terms and Conditions, our Privacy Policy, and any other policies or
          guidelines provided by AmbuTrack. If you do not agree, you must not
          use our services.
        </Text>

        <Text style={styles.subheading}>2. Eligibility</Text>
        <Text style={styles.text}>
          You must be at least 18 years old or have parental/guardian consent to
          use our services. By using the app, you confirm that the information
          you provide is accurate and truthful.
        </Text>

        <Text style={styles.subheading}>3. Services Provided</Text>
        <Text style={styles.text}>
          AmbuTrack facilitates the booking of ambulance services from
          third-party service providers. We are a platform that connects users
          with ambulance operators and do not operate ambulances directly.
        </Text>

        <Text style={styles.subheading}>4. User Responsibilities</Text>
        <Text style={styles.text}>
          - Provide accurate and up-to-date information when booking an
          ambulance. {"\n"}- Ensure your contact information is correct to
          facilitate communication with service providers. {"\n"}- Treat
          ambulance staff and service providers with respect. {"\n"}- Comply
          with all applicable laws while using the services.
        </Text>

        <Text style={styles.subheading}>5. Booking and Payments</Text>
        <Text style={styles.text}>
          - All bookings must be made through the application. Confirmation of a
          booking is subject to availability. {"\n"}- Payment terms, including
          advance payment or full payment upon service, will be communicated
          during the booking process. {"\n"}- Any applicable fees, including
          cancellation charges, will be disclosed before confirmation of the
          booking.
        </Text>

        <Text style={styles.subheading}>6. Cancellations and Refunds</Text>
        <Text style={styles.text}>
          - Cancellation policies vary based on the service provider. These will
          be displayed at the time of booking. {"\n"}- Refunds, if applicable,
          will be processed as per the provider’s terms.
        </Text>

        <Text style={styles.subheading}>7. Liability Disclaimer</Text>
        <Text style={styles.text}>
          - AmbuTrack acts as a facilitator and is not responsible for the
          quality, timing, or outcomes of services provided by ambulance
          operators. {"\n"}- We are not liable for any delays, accidents, or
          incidents during transportation or at the service location. {"\n"}-
          Users acknowledge that emergencies may impact service availability and
          timelines.
        </Text>

        <Text style={styles.subheading}>8. Contact Information</Text>
        <Text style={styles.text}>
          For any questions or concerns about these terms, please contact us at:
          {"\n"}
          Email: ambutrack2024@gmail.com {"\n"}
          Phone: 9866959525 , 9809234720
        </Text>
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
});

export default DriverTermsAndConditions;
