import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { router, useRouter } from 'expo-router'
import axios, { AxiosError } from 'axios'
import unauthorized from '@/scripts/unauthorized'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { styled } from 'nativewind'
import { ScrollView } from 'react-native-gesture-handler'
import Loading from '@/components/Loading'
import { OrderCardType } from '@/scripts/type'
import OrderDialog from '@/components/OrderDialog'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledImage = styled(Image)
const StyledScrollView = styled(ScrollView)

interface OrderCardProps {
    order: OrderCardType;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const handlePress = () => {
        setVisible(true);
    }

    return (
        <StyledView className={`w-full max-w-[280px] mx-auto rounded-lg shadow-md bg-base-100 border-2 border-gray-200 bg-white pb-[6px] mb-3`}>
            <StyledImage
                source={order.restaurantPic ? { uri: `data:image/jpeg;base64,${order.restaurantPic}` } : require("@/assets/images/Restaurant.jpeg")}
                alt="logo"
                className="bg-red-100 w-full h-[170px] rounded-tl-lg rounded-tr-lg border-b-2 border-b-gray-200"
            />
            <StyledText className="font-bold text-gray-700 mt-2 pl-3 pr-3" style={{ fontSize: 18 }}>
                {order.restaurantName}
            </StyledText>
            <StyledText className="text-gray-600 mt-[2px] pl-3 pr-3" style={{ fontSize: 14 }}>
                Total : {order.price} Tk
            </StyledText>
            <StyledText className="text-gray-600 mt-[2px] pl-3 pr-3" style={{ fontSize: 14 }}>
                Payment : {order.paymentMethod === "COD" ? "COD" : "Done"}
            </StyledText>
            <StyledText className="text-gray-600 mt-[2px] pl-3 pr-3" style={{ fontSize: 14 }}>
                Date : {new Date(order.timestamp).toLocaleString()}
            </StyledText>
            <TouchableOpacity style={{ padding: 3, marginTop: 4, marginHorizontal: 4 }} onPress={handlePress}>
                <StyledView className='flex-row bg-blue-500 py-[3px] items-center justify-center rounded-md'>
                    <StyledText className='text-white font-bold text-base' style={{ fontSize: 13 }}>Show Details</StyledText>
                </StyledView>
            </TouchableOpacity>
            {visible && <OrderDialog selectedOrder={order.id} visible={visible} setVisible={setVisible} />}
        </StyledView>
    );
};

const pendingOrders = () => {
    const [pendingOrders, setPendingOrders] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [showLoading, setShowLoading] = useState(true);

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
                unauthorized(axiosError, Toast, AsyncStorage, router);
            }
        };
        getPendingOrders();
    }, []);

    return (
        <View>
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