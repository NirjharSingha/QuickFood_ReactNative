import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import axios, { AxiosError } from 'axios'
import unauthorized from '@/scripts/unauthorized'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { styled } from 'nativewind'
import { ScrollView } from 'react-native-gesture-handler'
import { jwtDecode } from 'jwt-decode'
import Loading from '@/components/Loading'
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { RestaurantCard } from '@/components/cards/RestaurantCard'
import { useGlobal } from '@/contexts/Globals'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledScrollView = styled(ScrollView)

const restaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [showLoading, setShowLoading] = useState(true);
    const router = useRouter();
    const { setCartCount } = useGlobal()
    const { setUnseenNotificationCount } = useGlobal();

    const getRestaurants = async () => {
        const token = await AsyncStorage.getItem("token");
        if (token === null || token === undefined) {
            router.push("/auth/login");
            return;
        }

        const owner = jwtDecode(token).sub;
        try {
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/restaurant/getRestaurantByOwner?owner=${owner}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status == 200) {
                setShowLoading(false);
                setRestaurants(response.data);
                if (response.data.length === 0) {
                    setShowMessage(true);
                }
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount, setUnseenNotificationCount);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getRestaurants();
        }, [])
    );

    return (
        <View>
            {showLoading && <Loading />}
            {!showLoading && showMessage && (
                <StyledView className='flex-row w-full h-full justify-center items-center'>
                    <StyledText className="text-gray-500" style={{ fontSize: 14 }}>
                        No Restaurants Found
                    </StyledText>
                </StyledView>
            )}
            {!showLoading && !showMessage &&
                <StyledScrollView className="w-screen p-3" showsVerticalScrollIndicator={false}>
                    {restaurants.length !== 0 && restaurants.map((restaurant, index) => (
                        <View key={index}>
                            <RestaurantCard restaurant={restaurant} />
                            {index === restaurants.length - 1 && <View className="mb-3" />}
                        </View>
                    ))}
                </StyledScrollView>
            }
        </View>
    )
}

export default restaurants