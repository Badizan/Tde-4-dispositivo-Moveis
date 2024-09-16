import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

interface Country {
  name: {
    common: string;
    official: string;
  };
  capital?: string[]; 
  flags: {
    png: string;
  };
  continents: string[];
  population?: number;
  area?: number;
  latlng?: [number, number];
  currencies?: {
    [key: string]: {
      name: string;
    };
  };
  languages?: {
    [key: string]: string;
  };
}

export default function CountryDetails() {
  const { country } = useLocalSearchParams();
  const countryDetails: Country = JSON.parse(country as string);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: countryDetails.flags.png }} style={styles.flag} />
      <Text style={styles.name}>{countryDetails.name.common}</Text>
      <Text style={styles.officialName}>Official Name: {countryDetails.name.official}</Text>

      {countryDetails.capital ? (
        <View style={styles.detailRow}>
          <Text style={styles.label}>Capital:</Text>
          <Text style={styles.value}>{countryDetails.capital[0]}</Text>
        </View>
      ) : (
        <View style={styles.detailRow}>
          <Text style={styles.label}>Capital:</Text>
          <Text style={styles.value}>N/A</Text>
        </View>
      )}

      {countryDetails.population ? (
        <View style={styles.detailRow}>
          <Text style={styles.label}>Population:</Text>
          <Text style={styles.value}>{countryDetails.population.toLocaleString()}</Text>
        </View>
      ) : (
        <View style={styles.detailRow}>
          <Text style={styles.label}>Population:</Text>
          <Text style={styles.value}>N/A</Text>
        </View>
      )}

      {countryDetails.area ? (
        <View style={styles.detailRow}>
          <Text style={styles.label}>Area:</Text>
          <Text style={styles.value}>{countryDetails.area.toLocaleString()} km²</Text>
        </View>
      ) : (
        <View style={styles.detailRow}>
          <Text style={styles.label}>Area:</Text>
          <Text style={styles.value}>N/A</Text>
        </View>
      )}

      <View style={styles.detailRow}>
        <Text style={styles.label}>Continent:</Text>
        <Text style={styles.value}>{countryDetails.continents[0]}</Text>
      </View>

      {countryDetails.currencies ? (
        <View style={styles.detailRow}>
          <Text style={styles.label}>Currency:</Text>
          <Text style={styles.value}>
            {Object.values(countryDetails.currencies).map(currency => currency.name).join(', ')}
          </Text>
        </View>
      ) : (
        <View style={styles.detailRow}>
          <Text style={styles.label}>Currency:</Text>
          <Text style={styles.value}>N/A</Text>
        </View>
      )}

      {countryDetails.languages ? (
        <View style={styles.detailRow}>
          <Text style={styles.label}>Languages:</Text>
          <Text style={styles.value}>
            {Object.values(countryDetails.languages).join(', ')}
          </Text>
        </View>
      ) : (
        <View style={styles.detailRow}>
          <Text style={styles.label}>Languages:</Text>
          <Text style={styles.value}>N/A</Text>
        </View>
      )}

      {countryDetails.latlng ? (
        <View style={styles.detailRow}>
          <Text style={styles.label}>Coordinates:</Text>
          <Text style={styles.value}>
            {countryDetails.latlng[0]}, {countryDetails.latlng[1]}
          </Text>
        </View>
      ) : (
        <View style={styles.detailRow}>
          <Text style={styles.label}>Coordinates:</Text>
          <Text style={styles.value}>N/A</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 16, 
    backgroundColor: '#fff', 
    alignItems: 'center',
  },
  flag: { 
    width: 200, 
    height: 120, 
    borderRadius: 8, 
    marginBottom: 20,
  },
  name: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: '#333',
  },
  officialName: { 
    fontSize: 18, 
    fontStyle: 'italic', 
    marginBottom: 20, 
    color: '#666',
  },
  detailRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    paddingVertical: 8, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee',
  },
  label: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#444',
  },
  value: { 
    fontSize: 16, 
    color: '#666',
  },
});
