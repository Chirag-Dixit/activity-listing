import React, { useState } from 'react';
import { Provider as PaperProvider, IconButton } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ActivitiesScreen from './src/screens/ActivitiesScreen';
import { FiltersProvider } from './src/contexts/FiltersContext';
import { lightTheme, darkTheme } from './src/theme/theme';
import { View } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <PaperProvider theme={isDark ? darkTheme : lightTheme}>
      <FiltersProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Activities" component={ActivitiesScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </FiltersProvider>
      {/* simple floating toggle (web/mobile friendly) */}
      <View style={{ position: 'absolute', right: 12, bottom: 12 }}>
        <IconButton icon={isDark ? 'weather-sunny' : 'weather-night'} size={28} onPress={() => setIsDark(!isDark)} />
      </View>
    </PaperProvider>
  );
}
