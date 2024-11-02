import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { styled } from 'nativewind'
import Delivery from '@/assets/images/deliveryHeader.jpg'
import axios, { AxiosError } from 'axios'
import { jwtDecode } from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { OrderDetailsType, OrderTableType, MenuItemType } from '@/scripts/type'
import { Colors } from '@/constants/Colors'
import { MaterialIcons } from '@expo/vector-icons'
import Stepper from '@/components/Stepper'
import Loading from '@/components/Loading'
import unauthorized from '@/scripts/unauthorized'
import Toast from 'react-native-toast-message'
import { useGlobal } from '@/contexts/Globals'
import { OrderTable } from '@/components/Table'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { AlertDialog } from '@/components/Dialogs/AlertDialog'
import LottieView from 'lottie-react-native'

const StyledView = styled(View)
const StyledText = styled(Text)

const Line: React.FC<{ title: string, value: string }> = ({ title, value }) => {
    return (
        <StyledView className={`overflow-x-hidden mt-2 flex-1`}>
            <StyledText className="pl-1 font-bold mb-[6px] mr-3 text-gray-700" style={{ fontSize: 18 }}>
                {title}
            </StyledText>
            <StyledText className={`mb-2 border-2 border-gray-200 pl-2 pt-[3px] pb-[2px] rounded-md`} style={{ fontSize: 16 }}>
                {value}
            </StyledText>
        </StyledView>
    )
}

const delivery = () => {
    const [showLoading, setShowLoading] = useState(true);
    const [showMessage, setShowMessage] = useState(false);
    const [stepper, setStepper] = useState(-1)
    const [orderDetails, setOrderDetails] = useState<OrderDetailsType>(null)
    const [tableData, setTableData] = useState<OrderTableType[]>([]);
    const [showAlert, setShowAlert] = useState(false);
    const [orderId, setOrderId] = useState(-1)
    const [showAnimation, setShowAnimation] = useState(false);
    const router = useRouter()
    const { setCartCount } = useGlobal()
    const { setUnseenNotificationCount } = useGlobal();

    useEffect(() => {
        const getDeliveryData = async () => {
            const token = await AsyncStorage.getItem("token");
            if (token === null || token === undefined) {
                router.push("/auth/login");
                return;
            }
            const riderId = jwtDecode(token).sub;

            try {
                const response = await axios.get(
                    `${process.env.EXPO_PUBLIC_SERVER_URL}/order/deliveryOfRider?riderId=${riderId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.status == 200) {
                    if (response.data.orderId === null) {
                        setShowMessage(true);
                        setShowLoading(false);
                    } else {
                        const { orderId } = response.data;
                        setOrderId(orderId);

                        const res = await axios.get(
                            `${process.env.EXPO_PUBLIC_SERVER_URL}/order/getOrderDataPage?orderId=${orderId}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        if (res.status === 200) {
                            setOrderDetails(res.data);
                            let data: OrderTableType[] = [];
                            res.data.menuItems.forEach((item: MenuItemType) => {
                                data.push({
                                    id: item.menuId,
                                    name: item.menuName,
                                    price: item.price,
                                    image: item.image,
                                    quantity: item.quantity
                                });
                            });

                            setTableData(data);
                            let timeStamps = [
                                res.data.orderPlaced,
                                res.data.deliveryTaken,
                                res.data.userNotified,
                                res.data.deliveryCompleted,
                            ];

                            let step = 0;
                            for (let i = 1; i < timeStamps.length; i++) {
                                if (timeStamps[i] !== null) {
                                    step++;
                                }
                            }

                            setStepper(step);
                            setShowLoading(false);
                        }
                    }
                }
            } catch (error) {
                const axiosError = error as AxiosError;
                if (axiosError.response) {
                    const { status } = axiosError.response;
                    if (status === 401) {
                        unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount, setUnseenNotificationCount);
                    }
                    if (status === 404) {
                        setShowMessage(true);
                        setShowLoading(false);
                    }
                }
            }
        };

        getDeliveryData();
    }, []);

    const cancelHandler = () => {
        setShowAlert(false);
    }

    const continueHandler = async () => {
        if (orderId === -1) {
            return;
        }

        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.put(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/order/updateStatus?orderId=${orderId}&status=${stepper}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status == 200) {
                setShowAlert(false);

                if (response.data === "Status updated") {
                    if (stepper < 2) {
                        setStepper((prev) => prev + 1);
                        setShowAnimation(true);
                        setTimeout(() => {
                            setShowAnimation(false);
                        }, 3000);
                    } else {
                        setShowAnimation(true);
                        setTimeout(() => {
                            setShowAnimation(false);
                            Toast.show({
                                type: 'success',
                                text1: 'Delivery',
                                text2: 'The order has been delivered successfully',
                                visibilityTime: 4000,
                            })
                        }, 3000);
                    }
                } else if (response.data === "Cancelled order") {
                    Toast.show({
                        type: 'error',
                        text1: 'Cancelled order',
                        text2: 'The order has already been cancelled',
                        visibilityTime: 4000,
                    })
                }
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount, setUnseenNotificationCount);
        }
    }

    return (
        <View>
            {showLoading && !showMessage && !showAnimation && <Loading />}
            {showMessage && !showLoading && !showAnimation && (
                <StyledView className='flex-row w-full h-full justify-center items-center'>
                    <StyledText className="text-gray-500" style={{ fontSize: 14 }}>
                        No Orders To Deliver
                    </StyledText>
                </StyledView>
            )}
            {showAnimation && !showLoading && !showMessage && (
                <View style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView
                        autoPlay
                        style={{
                            width: 90,
                            height: 90
                        }}
                        source={require('@/assets/animations/tick.json')}
                    />
                </View>
            )}
            {!showLoading && !showMessage && !showAnimation && (
                <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
                    <AlertDialog visible={showAlert} setVisible={setShowAlert} title='Order Status' message='Once the status is updated it cannot be rolled back. Are you sure to continue?' continueHandler={continueHandler} cancelHandler={cancelHandler} flag={true} />
                    <StyledView className=" bg-[#374151] px-3 py-2">
                        <StyledView className="flex-row items-center mb-2">
                            <StyledView className="rounded-full mr-[6px] border-[1px] border-solid border-white p-1 bg-yellow-50">
                                <Image source={Delivery} style={{ width: 27, height: 27, borderRadius: 10 }} />
                            </StyledView>
                            <StyledText className="text-lg text-white font-bold">
                                Your Delivery
                            </StyledText>
                        </StyledView>
                        <StyledView className='flex-row'>
                            <StyledView className='w-[8px] h-[8px] rounded-full bg-white mr-1 mt-[5.5px]' />
                            <StyledText className='text-white' style={{ fontSize: 13 }}>Get the details of the order you have to deliver.</StyledText>
                        </StyledView>
                        <StyledView className='flex-row'>
                            <StyledView className='w-[8px] h-[8px] rounded-full bg-white mr-1 mt-[5.5px]' />
                            <StyledText className='text-white' style={{ fontSize: 13 }}>Update the status of the order accordingly to notify the customer about the delivery.</StyledText>
                        </StyledView>
                    </StyledView>
                    <StyledView className="flex-row justify-center items-center min-w-full mt-1">
                        <MaterialIcons name="delivery-dining" size={38} color={Colors.light.primaryGray} />
                        <StyledText className="font-bold text-gray-700 ml-1 mb-[2px]" style={{ fontSize: 24 }}>
                            Delivery
                        </StyledText>
                    </StyledView>
                    <StyledView className='p-[6px] pt-0'>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={{ marginBottom: -10, marginTop: 5, width: 484 }}>
                                <Stepper step={stepper} />
                            </View>
                        </ScrollView>
                        <Line title='Customer :' value={orderDetails ? orderDetails.customerName : ''} />
                        <Line title='Restaurant :' value={orderDetails ? orderDetails.restaurantName : ''} />
                        <Line title='Price :' value={orderDetails ? orderDetails.price.toFixed(0) : ''} />
                        <Line title='Delivery Charge :' value={orderDetails ? orderDetails.deliveryFee.toFixed(0) : ''} />
                        <Line title='Total Bill :' value={orderDetails ? (orderDetails.price + orderDetails.deliveryFee).toFixed(0) : ''} />
                        <Line title='Payment :' value={orderDetails ? (orderDetails.paymentMethod === 'COD' ? 'Cash On Delivery' : 'Done') : ''} />
                        <Line title='Delivery Address :' value={orderDetails ? orderDetails.deliveryAddress : ''} />
                        <Line title='Delivery Time :' value={'30 minutes'} />
                    </StyledView>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={{ marginBottom: 10, marginTop: 10, paddingLeft: 6, width: 500 }}>
                            <OrderTable data={tableData} />
                        </View>
                    </ScrollView>
                    <TouchableOpacity style={{ paddingHorizontal: 10, marginTop: -8, marginBottom: 10 }} onPress={() => setShowAlert(true)}>
                        <StyledView className='flex-row bg-slate-800 py-1 items-center justify-center rounded-full my-[2px]'>
                            <StyledText className='text-white font-bold text-base mr-2 mb-[2px]'>Mark the next state</StyledText>
                            <FontAwesome6 name='arrow-right-long' size={18} color="white" />
                        </StyledView>
                    </TouchableOpacity>
                </ScrollView>
            )}
        </View>
    )
}

export default delivery