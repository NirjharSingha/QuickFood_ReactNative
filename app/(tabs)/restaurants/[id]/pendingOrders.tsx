import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import axios, { AxiosError } from 'axios'
import unauthorized from '@/scripts/unauthorized'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { styled } from 'nativewind'
import { ScrollView } from 'react-native-gesture-handler'
import Loading from '@/components/Loading'
import { OrderCard } from '@/components/cards/OrderCard'
import { OrderCardType } from '@/scripts/type'
import { useGlobal } from '@/contexts/Globals'
import OrderDialog from '@/components/Dialogs/OrderDialog'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledScrollView = styled(ScrollView)

const pendingOrders = () => {
    const [pendingOrders, setPendingOrders] = useState<OrderCardType[]>([]);
    const [showMessage, setShowMessage] = useState(false);
    const [showLoading, setShowLoading] = useState(true);
    const { showOrderDialog, setShowOrderDialog, selectedOrder, setCartCount } = useGlobal()
    const router = useRouter();

    useEffect(() => {
        const getPendingOrders = async () => {
            const resId = await AsyncStorage.getItem("YourRestaurant");
            if (resId === null || resId === undefined) {
                return;
            }
            const token = await AsyncStorage.getItem("token");
            try {
                const response = await axios.get(
                    `${process.env.EXPO_PUBLIC_SERVER_URL}/order/getOrderCard?id=${resId}&flag=resPendingOrder`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.status == 200) {
                    setShowLoading(false);
                    setPendingOrders(response.data);
                    if (response.data.length === 0) {
                        setShowMessage(true);
                    }
                }
            } catch (error) {
                const axiosError = error as AxiosError;
                unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount);
            }
        };
        getPendingOrders();
    }, []);

    return (
        <View>
            {showOrderDialog && <OrderDialog selectedOrder={selectedOrder} visible={showOrderDialog} setVisible={setShowOrderDialog} setOrders={setPendingOrders} />}
            {showLoading && <Loading />}
            {!showLoading && showMessage && (
                <StyledView className='flex-row w-full h-full justify-center items-center'>
                    <StyledText className="text-gray-500" style={{ fontSize: 14 }}>
                        No Pending Orders
                    </StyledText>
                </StyledView>
            )}
            {!showLoading && !showMessage &&
                <StyledScrollView className="w-screen p-3" showsVerticalScrollIndicator={false}>
                    {pendingOrders.length !== 0 && pendingOrders.map((order, index) => (
                        <View key={index}>
                            <OrderCard order={order} />
                            {index === pendingOrders.length - 1 && <View className="mb-3" />}
                        </View>
                    ))}
                </StyledScrollView>
            }
        </View>
    )
}

export default pendingOrders