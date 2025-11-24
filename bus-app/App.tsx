import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './context/AuthContext';
import Welcome from './screens/Welcome';
import UserLogin from './screens/UserLogin';
import UserRegister from './screens/UserRegister';
import DriverLogin from './screens/DriverLogin';
import UserHome from './screens/UserHome';
import DriverHome from './screens/DriverHome';
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

function Navigation() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
        // Authenticated screens
        <>
          {user.role === 'driver' ? (
            <Stack.Screen 
              name="DriverHome" 
              component={DriverHome} 
              options={{ title: 'Driver Dashboard' }}
            />
          ) : (
            <Stack.Screen 
              name="UserHome" 
              component={UserHome} 
              options={{ title: 'Bus Tracker' }}
            />
          )}
        </>
      ) : (
        // Auth screens
        <>
          <Stack.Screen 
            name="Welcome" 
            component={Welcome} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="UserLogin" 
            component={UserLogin} 
            options={{ title: 'User Login' }}
          />
          <Stack.Screen 
            name="UserRegister" 
            component={UserRegister} 
            options={{ title: 'Register' }}
          />
          <Stack.Screen 
            name="DriverLogin" 
            component={DriverLogin} 
            options={{ title: 'Driver Login' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </AuthProvider>
  );
}
