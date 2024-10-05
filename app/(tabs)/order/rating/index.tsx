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
import { useGlobal } from '@/contexts/Globals'
import { OrderCard } from '@/components/cards/OrderCard'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledScrollView = styled(ScrollView)

const index = () => {
    const [orderCards, setOrderCards] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [showLoading, setShowLoading] = useState(true);
    const router = useRouter();
    const { setCartCount } = useGlobal()

    const getOrderCards = async () => {
        const token = await AsyncStorage.getItem("token");
        if (token === null || token === undefined) {
            router.push("/auth/login");
            return;
        }
        const userId = jwtDecode(token).sub;
        try {
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/order/getOrderCard?id=${userId}&flag=rating`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status == 200) {
                setShowLoading(false);
                setOrderCards(response.data);
                if (response.data.length === 0) {
                    setShowMessage(true);
                }
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getOrderCards();
        }, [])
    );

    return (
        <View>
            {showLoading && <Loading />}
            {!showLoading && showMessage && (
                <StyledView className='flex-row w-full h-full justify-center items-center'>
                    <StyledText className="text-gray-500" style={{ fontSize: 14 }}>
                        No Orders To Give Rating
                    </StyledText>
                </StyledView>
            )}
            {!showLoading && !showMessage &&
                <StyledScrollView className="w-screen p-3" showsVerticalScrollIndicator={false}>
                    {orderCards.length !== 0 && orderCards.map((orderCard, index) => (
                        <View key={index}>
                            <OrderCard order={orderCard} />
                            {index === orderCards.length - 1 && <View className="mb-3" />}
                        </View>
                    ))}
                </StyledScrollView>
            }
        </View>
    )
}

export default index