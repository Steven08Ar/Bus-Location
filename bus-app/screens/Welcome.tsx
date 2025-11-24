import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

type Props = {
  navigation: NavigationProp<any>;
};

export default function Welcome({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Bus Tracker</Text>
      <Text style={styles.subtitle}>Please select an option</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="User Login" onPress={() => navigation.navigate('UserLogin')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="User Register" onPress={() => navigation.navigate('UserRegister')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Driver Login" onPress={() => navigation.navigate('DriverLogin')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    color: '#666',
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 15,
  },
});
