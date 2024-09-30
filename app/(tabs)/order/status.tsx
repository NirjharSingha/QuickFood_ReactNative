import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import Loading from '@/components/Loading'
import restaurants from '../restaurants'
import { styled } from 'nativewind'
import { ScrollView } from 'react-native-gesture-handler'
import { OrderCard } from '@/components/cards/OrderCard'
import { useGlobal } from '@/contexts/Globals'
import { OrderCardType } from '@/scripts/type'
import OrderDialog from '@/components/OrderDialog'
import AsyncStorage from '@react-native-async-storage/async-storage'
import unauthorized from '@/scripts/unauthorized'
import { useRouter } from 'expo-router'
import { jwtDecode } from 'jwt-decode'
import axios, { AxiosError } from 'axios'
import Toast from 'react-native-toast-message'

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView)

const status = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [showLoading, setShowLoading] = useState(true);
    const [orders, setOrders] = useState<OrderCardType[]>([]);
    const { showOrderDialog, selectedOrder, setShowOrderDialog } = useGlobal()
    const router = useRouter();

    useEffect(() => {
        const getOrderCards = async () => {
            const token = await AsyncStorage.getItem("token");
            if (token === null || token === undefined) {
                router.push("/auth/login");
                return;
            }
            const userId = jwtDecode(token).sub;
            try {
                const response = await axios.get(
                    `${process.env.EXPO_PUBLIC_SERVER_URL}/order/getOrderCard?id=${userId}&flag=userPendingOrder`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.status == 200) {
                    setShowLoading(false);
                    setOrders(response.data);
                    if (response.data.length === 0) {
                        setShowMessage(true);
                    }
                }
            } catch (error) {
                const axiosError = error as AxiosError;
                unauthorized(axiosError, Toast, AsyncStorage, router);
            }
        };
        getOrderCards();
    }, []);

    return (
        <View>
            {showOrderDialog && <OrderDialog selectedOrder={selectedOrder} visible={showOrderDialog} setVisible={setShowOrderDialog} setOrders={setOrders} />}
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
                    {orders.length !== 0 && orders.map((order, index) => (
                        <View key={index}>
                            <OrderCard order={order} />
                            {index === orders.length - 1 && <View className="mb-3" />}
                        </View>
                    ))}
                </StyledScrollView>
            }
        </View>
    )
}

export default status