import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Image, Text, Animated } from "react-native";
import LottieView from 'lottie-react-native';
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import FavIcon from '@/assets/images/favicon.png';

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

    useEffect(() => {
        setTimeout(() => {
            router.push("/auth/login");
        }, 4000);
    }, []);


    return (
        <View style={styles.animationContainer}>
            <LottieView
                autoPlay
                style={{
                    width: 200,
                    height: 200,
                    backgroundColor: '#eee',
                }}
                source={require('@/assets/animations/splash.json')}
            />
            <Animated.View
                style={{
                    transform: [{ translateY: translateYValue }],
                }}
            >
                <StyledView className="flex-row justify-center items-center mt-[-40px] animate-">
                    <StyledView className="rounded-full mr-3 border-2 border-solid border-gray-400 p-3 bg-gray-200">
                        <StyledImage source={FavIcon} style={{ width: 45, height: 45 }} />
                    </StyledView>
                    <StyledText className="text-gray-700 font-bold" style={{ fontSize: 35 }}>
                        QuickFood
                    </StyledText>
                </StyledView></Animated.View>
        </View>
    )
}

export default index

const styles = StyleSheet.create({
    animationContainer: {
        backgroundColor: '#FFF7ED',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginTop: -80
    }
});
