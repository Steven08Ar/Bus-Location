import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function UserHome() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bus Tracker</Text>
      <Text style={styles.subtitle}>Welcome, {user?.name}!</Text>
      <Text style={styles.text}>User ID: {user?.id || 'N/A'}</Text>
      <Text style={styles.text}>Email: {user?.email}</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Track Buses</Text>
        <Text>Real-time bus tracking - coming soon</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Travel History</Text>
        <Text>Your travel history - coming soon</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My QR Code</Text>
        <Text>QR code display - coming soon</Text>
      </View>
      
      <Button title="Logout" onPress={logout} color="#d9534f" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
  },
  section: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
