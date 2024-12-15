import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { fetchWeatherData } from "../../service/fetchWeatherData";


export default function explore({ route }) {
  const [weatherData, setWeatherData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [city, setCity] = useState("Prague");
  const [searchInput, setSearchInput] = useState("");

  const loadWeatherData = async (searchCity) => {
    try {
      const data = await fetchWeatherData(searchCity || city);
      setWeatherData(data);
      setErrorMessage(null);
    } catch (error) {
      setWeatherData(null);
      setErrorMessage("City not found. Please try again.");
    }
  };

  useEffect(() => {
    loadWeatherData();
  }, []);

  const handleSearch = () => {
    if (searchInput.trim() !== "") {
      setCity(searchInput);
      loadWeatherData(searchInput);
      setSearchInput("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://images.pexels.com/photos/1921336/pexels-photo-1921336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        }}
        style={styles.imageBackground}
      >
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search city"
            placeholderTextColor="#ddd"
            value={searchInput}
            onChangeText={(text) => setSearchInput(text)}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {weatherData ? (
          <>
            <Text style={styles.countryText}>{weatherData.country}</Text>
            <Text style={styles.cityText}>{weatherData.city}</Text>

            <View style={styles.weatherContainer}>
              <View style={styles.weatherBox}>
                <Text style={styles.weatherLabel}>Feels Like</Text>
                <Text style={styles.weatherValue}>
                  {weatherData.feelsLike}°
                </Text>
              </View>
              <View style={styles.weatherBox}>
                <Text style={styles.weatherLabel}>Temperature</Text>
                                <Text style={styles.weatherValue}>
                                  {weatherData.temp}°
                                </Text>
              </View>
              <View style={styles.weatherBox}>
                <Text style={styles.weatherLabel}>Humidity</Text>
                <Text style={styles.weatherValue}>
                  {weatherData.humidity}%
                </Text>
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
  searchContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 50,
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#fff",
    fontSize: 16,
  },
  searchButton: {
    // backgroundColor: "rgba(255, 255, 255, 0.6)",
    padding: 10,
    borderRadius: 20,
  },
  searchButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  countryText: {
    fontSize: 20,
    color: "#fff",
    textTransform: "uppercase",
    marginTop: 100,
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
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 30,
    width: "90%",
  },
  timeText: {
    fontSize: 18,
    color: "#fff",
  },
  errorText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});
