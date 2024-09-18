import { Stack } from "expo-router/stack";
import React from "react";
import { StatusBar, View, Platform, StyleSheet } from "react-native";
import { NativeWindStyleSheet } from "nativewind";
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import MenuContextProvider from "@/contexts/Menu";

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function Layout() {
  return (
    <PaperProvider>
      <MenuContextProvider>
        <View style={styles.container}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="rgba(214,197,183,0.8)"
          />
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
            <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <Toast />
        </View>
      </MenuContextProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Adjust for Android
  }
});
