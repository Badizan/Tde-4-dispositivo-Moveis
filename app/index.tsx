import React, { useEffect, useState } from 'react';
import { View, Text, SectionList, TextInput, Image, TouchableOpacity, StyleSheet, SectionListData } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

interface Country {
  name: {
    common: string;
    official: string;
  };
  capital: string[];
  flags: {
    png: string;
  };
  continents: string[];
  population: number;
  area: number;
  latlng: [number, number];
  currencies: {
    [key: string]: {
      name: string;
    };
  };
  languages: {
    [key: string]: string;
  };
}

interface Section {
  title: string;
  data: Country[];
}

export default function App() {
  const [countries, setCountries] = useState<Section[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Section[]>([]);
  const [search, setSearch] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    axios.get<Country[]>('https://restcountries.com/v3.1/all')
      .then(response => {
        const groupedByContinent = groupByContinent(response.data);
        setCountries(groupedByContinent);
        setFilteredCountries(groupedByContinent);
      })
      .catch(error => console.error(error));
  }, []);

  const groupByContinent = (countries: Country[]): Section[] => {
    const continents: { [key: string]: Country[] } = {};
    countries.forEach(country => {
      const continent = country.continents[0];
      if (!continents[continent]) {
        continents[continent] = [];
      }
      continents[continent].push(country);
    });

    return Object.keys(continents).map(continent => ({
      title: continent,
      data: continents[continent]
    }));
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text === '') {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.map(section => ({
        ...section,
        data: section.data.filter(country => 
          country.name.common.toLowerCase().includes(text.toLowerCase())
        )
      }));
      setFilteredCountries(filtered);
    }
  };

  const renderCountry = ({ item }: { item: Country }) => (
    <TouchableOpacity 
      style={styles.countryContainer}
      onPress={() => router.push({
        pathname: '/countryDetails',
        params: { country: JSON.stringify(item) }
      })}
    >
      <Image source={{ uri: item.flags.png }} style={styles.flag} />
      <View>
        <Text style={styles.countryName}>{item.name.common}</Text>
        <Text style={styles.capital}>{item.capital?.[0]}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={search}
        placeholder="Search for a country"
        onChangeText={handleSearch}
        placeholderTextColor="#888"
      />
      <SectionList
        sections={filteredCountries}
        keyExtractor={(item, index) => item.name.common + index}
        renderItem={renderCountry}
        renderSectionHeader={({ section }: { section: SectionListData<Country> }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#f4f4f4',
  },
  searchInput: { 
    height: 40, 
    borderColor: '#ddd', 
    borderWidth: 1, 
    borderRadius: 8, 
    paddingLeft: 10, 
    marginBottom: 20,
    backgroundColor: '#fff',
    color: '#333',
  },
  sectionHeader: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginVertical: 10, 
    color: '#333',
  },
  countryContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 10, 
    marginVertical: 6, 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  flag: { 
    width: 50, 
    height: 30, 
    marginRight: 15, 
    borderRadius: 4, 
    borderWidth: 1, 
    borderColor: '#ddd',
  },
  countryName: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#333',
  },
  capital: { 
    fontSize: 14, 
    color: '#666',
  },
});
