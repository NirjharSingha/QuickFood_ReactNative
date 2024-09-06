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
                    <StyledView className="rounded-full mr-3 border-2 border-solid border-gray-400 p-[10px] bg-gray-200">
                        <StyledImage source={FavIcon} style={{ width: 37, height: 37 }} />
                    </StyledView>
                    <StyledText className="text-gray-700 font-bold" style={{ fontSize: 32 }}>
                        QuickFood
                    </StyledText>
                </StyledView></Animated.View>
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
