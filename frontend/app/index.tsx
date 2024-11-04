import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Image, Text, Animated, TouchableOpacity } from "react-native";
import LottieView from 'lottie-react-native';
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import FavIcon from '@/assets/images/favicon.png';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const index = () => {
    const router = useRouter();
    const StyledView = styled(View);
    const StyledImage = styled(Image);
    const StyledText = styled(Text);
    const translateYValue = useRef(new Animated.Value(200)).current; // Start from below the screen

    useEffect(() => {
        Animated.timing(translateYValue, {
            toValue: 0, // End at its normal position
            duration: 2000, // Animation duration: 2 seconds
            useNativeDriver: true,
        }).start();
    }, [translateYValue]);

    const handleNavigation = async () => {
        const token = await AsyncStorage.getItem("token");
        if (token === null || token === undefined) {
            router.push("/auth/login");
        } else {
            const claims = jwtDecode(token)
            const currentTimeSeconds = Math.floor(Date.now() / 1000);
            const expiryTime = claims.exp
            if (expiryTime === undefined || currentTimeSeconds >= expiryTime) {
                router.push("/auth/login");
            } else {
                router.push("/home");
            }
        }
    }

    return (
        <View style={styles.animationContainer}>
            <TouchableOpacity onPress={handleNavigation} style={{ position: 'absolute', top: 120, right: 20 }}>
                <StyledView className="p-[6px] rounded-full bg-gray-800">
                    <MaterialCommunityIcons name="skip-forward" size={32} color="white" />
                </StyledView>
            </TouchableOpacity>
            <LottieView
                autoPlay
                style={{
                    width: 300,
                    height: 300,
                    backgroundColor: '#eee',
                }}
                source={require('@/assets/animations/splash.json')}
            />
            <Animated.View
                style={{
                    transform: [{ translateY: translateYValue }],
                }}
            >
                <StyledView className="flex-row justify-center items-center mt-[-20px]">
                    <StyledView className="rounded-full mr-3 p-3 bg-orange-50">
                        <StyledImage source={FavIcon} style={{ width: 35, height: 35 }} />
                    </StyledView>
                    <StyledText className="text-gray-700 font-bold" style={{ fontSize: 32 }}>
                        QuickFood
                    </StyledText>
                </StyledView>
            </Animated.View>
        </View>
    )
}

export default index

const styles = StyleSheet.create({
    animationContainer: {
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginTop: -100
    }
});
