import React, { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications"; // Import Notifications
import { SafeAreaView, Text, StyleSheet, View, ImageBackground } from "react-native";
import { fetchWeatherData } from "../../service/fetchWeatherData";

export default function HomeScreen() {
  const [weatherData, setWeatherData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch weather data based on city
  const loadWeatherData = async (city) => {
    try {
      const data = await fetchWeatherData(city);
      setWeatherData(data);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    const fetchLocationAndAddress = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMessage("Permission to access location was denied.");
          setLoading(false);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        if (reverseGeocode.length > 0) {
          const { city } = reverseGeocode[0];
          loadWeatherData(city); // Load weather data for the city
        } else {
          setErrorMessage("Unable to fetch address.");
        }
      } catch (error) {
        setErrorMessage("An error occurred while fetching location.");
      } finally {
        setLoading(false);
      }
    };

    // Notification listener to reload weather data when notification is received
    const notificationListener = Notifications.addNotificationReceivedListener(() => {
      fetchLocationAndAddress(); // Refetch weather and location data
    });

    fetchLocationAndAddress(); // Fetch initial weather data

    // Set interval to fetch weather data every 15 minutes (15 minutes in milliseconds)
    const interval = 15 * 60 * 1000; // 15 minutes in milliseconds
    const intervalId = setInterval(fetchLocationAndAddress, interval);

    // Cleanup interval and notification listener on component unmount
    return () => {
      clearInterval(intervalId);
      notificationListener.remove();
    };
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Fetching location...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://images.pexels.com/photos/1921336/pexels-photo-1921336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        }}
        style={styles.imageBackground}
      >
        {weatherData ? (
          <>
            <Text style={styles.countryText}>{weatherData.country}</Text>
            <Text style={styles.cityText}>{weatherData.city}</Text>

            <View style={styles.weatherContainer}>
              <View style={styles.weatherBox}>
                <Text style={styles.weatherLabel}>Feels Like</Text>
                <Text style={styles.weatherValue}>{weatherData.feelsLike}°</Text>
              </View>
              <View style={styles.weatherBox}>
                <Text style={styles.weatherLabel}>Temperature</Text>
                <Text style={styles.weatherValue}>{weatherData.temp}°</Text>
              </View>
              <View style={styles.weatherBox}>
                <Text style={styles.weatherLabel}>Humidity</Text>
                <Text style={styles.weatherValue}>{weatherData.humidity}%</Text>
              </View>
            </View>
          </>
        ) : (
          <Text style={styles.errorText}>
            {errorMessage || "Loading weather data..."}
          </Text>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(216, 164, 164, 0.57)",
  },
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  countryText: {
    fontSize: 20,
    color: "#fff",
    textTransform: "uppercase",
  },
  cityText: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  weatherContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    padding: 20,
    width: "90%",
  },
  weatherBox: {
    alignItems: "center",
  },
  weatherLabel: {
    fontSize: 14,
    color: "#fff",
  },
  weatherValue: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    color: "#fff",
    fontSize: 18,
  },
});
