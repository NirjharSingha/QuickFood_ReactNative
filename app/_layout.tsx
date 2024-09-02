import { Stack } from "expo-router/stack";
import React from "react";
import { StatusBar, View, Platform, StyleSheet, ActivityIndicator } from "react-native";
import { NativeWindStyleSheet } from "nativewind";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function Layout() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      // Assume token is stored in AsyncStorage
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        setIsLoggedIn(true);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (isLoggedIn) {
        router.push("/");
      } else {
        router.push("/auth/login");
      }
    }
  }, [loading, isLoggedIn]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="rgba(214,197,183,0.8)"
      />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Adjust for Android
  },
});