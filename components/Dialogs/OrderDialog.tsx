import { styled } from 'nativewind';
import * as React from 'react';
import { ScrollView, Image, View, TouchableOpacity } from 'react-native';
import { Dialog, Portal, Text } from 'react-native-paper';
import { router, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import unauthorized from '@/scripts/unauthorized';
import Toast from 'react-native-toast-message';
import { OrderCardType, OrderDetailsType } from '@/scripts/type';
import Stepper from '../Stepper';
import Loading from '../Loading';
import { useGlobal } from '@/contexts/Globals';
import { AlertDialog } from '@/components/Dialogs/AlertDialog';
import Complaint from './Complaint';
import { OrderTable as Table } from '../Table';
import { OrderTableType } from '@/scripts/type';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

interface OrderDialogProps {
    selectedOrder: number;
    visible: boolean;
    setVisible: (visible: boolean) => void;
    setOrders?: any;
}

type MenuItemType = {
    menuId: number
    menuName: string,
    price: number,
    image: string,
    quantity: number
}

const OrderDialog: React.FC<OrderDialogProps> = ({ visible, setVisible, setOrders }) => {
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [orderDetails, setOrderDetails] = useState<OrderDetailsType>(null);
    const [orderStatus, setOrderStatus] = useState(-1);
    const [tableData, setTableData] = useState<OrderTableType[]>([]);
    const { selectedOrder, setSelectedOrder, setCartCount } = useGlobal()
    const [showAlert, setShowAlert] = useState(false);
    const [cancelMessage, setCancelMessage] = useState("");
    const [showComplaint, setShowComplaint] = useState(false);

    const hideDialog = () => {
        setSelectedOrder(0)
        setVisible(false);
    }

    const getOrderDetails = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/order/getOrderDataPage?orderId=${selectedOrder}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                setOrderDetails(response.data);
                let data: OrderTableType[] = [];
                response.data.menuItems.forEach((item: MenuItemType) => {
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
                    response.data.orderPlaced,
                    response.data.deliveryTaken,
                    response.data.userNotified,
                    response.data.deliveryCompleted,
                ];

                let step = 0;
                for (let i = 1; i < timeStamps.length; i++) {
                    if (timeStamps[i] !== null) {
                        step++;
                    }
                }

                setOrderStatus(step);
                setLoading(false);
            }
        } catch (error) {
            setVisible(false)
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount);
        }
    };

    useEffect(() => {
        if (selectedOrder !== 0) {
            getOrderDetails();
        }
    }, [selectedOrder]);

    const markAsPrepared = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.put(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/order/markAsPrepared?orderId=${selectedOrder}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                if (response.data === "Cancelled order") {
                    setOrders((prev: OrderCardType[]) => prev.filter((order) => order.id !== selectedOrder));
                    Toast.show({
                        type: 'error',
                        text1: 'Cancelled order',
                        text2: 'The order has already been cancelled',
                        visibilityTime: 4000,
                    })
                    setVisible(false);
                } else {
                    setOrderDetails((prev) => {
                        if (prev) {
                            return { ...prev, isPrepared: true };
                        }
                        return prev;
                    });
                }
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount);
        }
    };

    const continueHandler = async () => {
        if (cancelMessage.includes("cannot cancel")) {
            return;
        }

        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.put(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/order/cancelOrder`,
                {
                    first: selectedOrder,
                    second: cancelMessage.includes("already passed"),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Order cancelled',
                    text2: 'The order has been cancelled',
                    visibilityTime: 4000,
                })
                setOrders((prev: OrderCardType[]) => {
                    const filteredOrderCards = prev.filter(
                        (card) => card.id !== selectedOrder
                    );
                    return filteredOrderCards;
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount);
        }
    }

    const isRefundable = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/order/isRefundable?orderId=${selectedOrder}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                if (response.data == 1) {
                    setCancelMessage(
                        "The delivery time is already passed. As you already paid the bill, you will get refund if you cancel the order now. Press continue to cancel the order."
                    );

                } else if (response.data == 2) {
                    setCancelMessage(
                        "The delivery time is already passed. As you choose Cash On Delivery, you don't need to pay if you cancel the order now. Press continue to cancel the order."
                    );
                } else if (response.data == 3) {
                    setCancelMessage(
                        "The delivery time is not passed yet. If you cancel the order now, you will not get refund. Press continue to cancel the order."
                    );
                } else if (response.data == 4) {
                    setCancelMessage(
                        "The delivery time is not passed yet. As you choose Cash On Delivery, you cannot cancel the order now."
                    );
                }
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount);
        }
    };

    const handleAction = async () => {
        if (orderStatus < 3) {
            isRefundable()
            setShowAlert(true);
        } else {
            setShowComplaint(true)
        }
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog} style={{ backgroundColor: 'white', borderRadius: 8, marginHorizontal: 4, marginVertical: 80, paddingLeft: 6, paddingBottom: 8 }}>
                <AlertDialog visible={showAlert} setVisible={setShowAlert} title='Cancel Order' message={cancelMessage} cancelHandler={() => setShowAlert(false)} continueHandler={continueHandler} flag={!cancelMessage.includes("cannot cancel")} />
                <Complaint visible={showComplaint} setVisible={setShowComplaint} orderId={selectedOrder} setOrders={setOrders} />
                {loading && <Loading />}
                {!loading &&
                    <View style={{ paddingTop: 8 }}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <ScrollView showsVerticalScrollIndicator={false} style={{ paddingTop: 16 }}>
                                {pathname.startsWith('/order') && <Stepper step={orderStatus} />}
                                <StyledView className="w-full h-[210px] p-1 pt-0 shadow-md rounded-xl gap-3 mb-3 mt-[-20px] justify-between items-center" style={{ flexDirection: 'row', alignItems: 'center', width: 500 }}>
                                    <StyledImage
                                        source={require("@/assets/images/dialogImage.jpeg")}
                                        alt="logo"
                                        className={`ml-2 rounded-lg`}
                                        resizeMode='contain'
                                    />
                                    {orderDetails !== null &&
                                        <StyledView className="h-full flex-col justify-center w-full overflow-hidden">
                                            <StyledText className={`font-bold text-gray-700 mb-1`} style={{ fontSize: 16 }}>
                                                {pathname.includes("/restaurants") ? `Customer: ${orderDetails.customerName ? orderDetails.customerName : ""}`
                                                    : `Restaurant: ${orderDetails.restaurantName ? orderDetails.restaurantName : ""}`}
                                            </StyledText>
                                            <StyledText className={`font-bold text-gray-700 mb-3`} style={{ fontSize: 16 }}>
                                                Rider: {orderDetails.riderName ? orderDetails.riderName : ""}
                                            </StyledText>
                                            <StyledText className={`text-gray-700 mb-1`}>
                                                Food Cost: {orderDetails.price.toFixed(0)}
                                            </StyledText>
                                            <StyledText className={`text-gray-700 mb-1`}>
                                                Delivery Charge: {orderDetails.deliveryFee.toFixed(0)}
                                            </StyledText>
                                            <StyledText className={`text-gray-700 mb-1`}>
                                                Total: {parseInt(orderDetails.price.toFixed(0)) + parseInt(orderDetails.deliveryFee.toFixed(0))}
                                            </StyledText>
                                        </StyledView>
                                    }
                                </StyledView>
                                <Table data={tableData} />
                                {pathname.startsWith('/restaurants') &&
                                    <TouchableOpacity style={{ padding: 6, marginBottom: 8, marginRight: 6, opacity: orderDetails?.isPrepared ? 0.5 : 1 }} disabled={orderDetails?.isPrepared} onPress={markAsPrepared}>
                                        <StyledView className='flex-row bg-blue-500 py-[4px] items-center justify-center rounded-md mb-1'>
                                            <StyledText className='text-white font-bold text-base'>{orderDetails?.isPrepared ? 'Marked as Prepared' : 'Mark as Prepared'}</StyledText>
                                        </StyledView>
                                    </TouchableOpacity>
                                }
                                {pathname.startsWith("/order/status") && (
                                    <StyledView className="p-1 mt-1 mb-2" style={{ marginRight: 6 }}>
                                        <StyledText className="font-bold mb-3 text-gray-700 text-center" style={{ fontSize: 18 }}>
                                            {orderStatus < 3 ? 'Order is not completed yet!' : 'Order completed successfully!'}
                                        </StyledText>
                                        <TouchableOpacity onPress={handleAction}>
                                            <StyledView className='flex-row bg-blue-500 py-[4px] items-center justify-center rounded-md mb-1'>
                                                <StyledText className='text-white font-bold text-base'>{orderStatus < 3 ? 'Do you want to cancel?' : 'Do you want to complain?'}</StyledText>
                                            </StyledView>
                                        </TouchableOpacity>
                                    </StyledView>
                                )}
                            </ScrollView>
                        </ScrollView>
                    </View>
                }
            </Dialog>
        </Portal>
    );
};

export default OrderDialog;