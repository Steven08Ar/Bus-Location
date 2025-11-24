import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function DriverHome() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Dashboard</Text>
      <Text style={styles.subtitle}>Welcome, {user?.name}!</Text>
      <Text style={styles.text}>Email: {user?.email}</Text>
      <Text style={styles.text}>Role: {user?.role}</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shift Management</Text>
        <Text>Start/End shift functionality - coming soon</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Route</Text>
        <Text>Route information - coming soon</Text>
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
