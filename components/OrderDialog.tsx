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
import { OrderDetailsType } from '@/scripts/type';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

interface OrderDialogProps {
    selectedOrder: number;
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

type MenuItemType = {
    menuId: number
    menuName: string,
    price: number,
    image: string,
    quantity: number
}

type DataType = {
    id: number
    name: string
    price: number
    image: string
    quantity: number
}

const Table = ({ data }: { data: DataType[] }) => {
    return (
        <StyledView className='mr-[6px] mb-[20px]'>
            <StyledText className="font-bold py-[5px] text-center text-white mb-1 bg-slate-500 rounded-t-lg" style={{ fontSize: 18 }}>
                Ordered Items
            </StyledText>
            <StyledView className='flex-row w-full justify-between items-center px-2'>
                <StyledView className='gap-2'>
                    <StyledText className='font-bold text-slate-500 py-1' style={{ fontSize: 15 }}>
                        Image
                    </StyledText>
                    {data.map((item) => (
                        <StyledImage
                            key={item.id}
                            source={item.image ? { uri: `data:image/jpeg;base64,${item.image}` } : require("@/assets/images/Menu.jpg")}
                            alt="logo"
                            className="rounded-lg w-[50px] h-[38px]"
                            resizeMode="cover"
                        />
                    ))}
                </StyledView>
                <StyledView className='gap-2'>
                    <StyledText className='font-bold text-slate-500 py-1' style={{ fontSize: 15 }}>
                        Name
                    </StyledText>
                    {data.map((item) => (
                        <StyledView key={item.id} className='h-[38px] flex-row items-center'>
                            <StyledText className="text-gray-700 mb-1" ellipsizeMode='tail' style={{ maxWidth: 240 }}>
                                {item.name}
                            </StyledText>
                        </StyledView>
                    ))}
                </StyledView>
                <StyledView className='gap-2'>
                    <StyledText className='font-bold text-slate-500 py-1'>
                        Price
                    </StyledText>
                    {data.map((item) => (
                        <StyledView key={item.id} className='h-[38px] flex-row items-center' >
                            <StyledText className="text-gray-700 mb-1">
                                {item.price}
                            </StyledText>
                        </StyledView>
                    ))}
                </StyledView>
                <StyledView className='gap-2'>
                    <StyledText className='font-bold text-slate-500 py-1' style={{ fontSize: 15 }}>
                        Quantity
                    </StyledText>
                    {data.map((item) => (
                        <StyledView key={item.id} className='h-[38px] flex-row items-center justify-end pr-1'>
                            <StyledText className="text-gray-700 mb-1">
                                {item.quantity}
                            </StyledText>
                        </StyledView>
                    ))}
                </StyledView>
            </StyledView>
        </StyledView >
    );
}

const OrderDialog: React.FC<OrderDialogProps> = ({ selectedOrder = 1, visible, setVisible }) => {
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [orderDetails, setOrderDetails] = useState<OrderDetailsType>(null);
    const [orderStatus, setOrderStatus] = useState(-1);

    const hideDialog = () => setVisible(false);
    const [tableData, setTableData] = useState<DataType[]>([]);

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
                let data: DataType[] = [];
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
            unauthorized(axiosError, Toast, AsyncStorage, router);
        }
    };

    useEffect(() => {
        if (selectedOrder !== 0) {
            getOrderDetails();
        }
    }, [selectedOrder]);

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog} style={{ backgroundColor: 'white', borderRadius: 8, marginHorizontal: 4, marginVertical: 80, paddingLeft: 6, paddingBottom: 8 }}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                    <ScrollView showsVerticalScrollIndicator={false}>
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
                    </ScrollView>
                </ScrollView>
                <TouchableOpacity style={{ padding: 6, marginBottom: 6, marginRight: 4 }}>
                    <StyledView className='flex-row bg-blue-500 py-[4px] items-center justify-center rounded-md mb-1'>
                        <StyledText className='text-white font-bold text-base'>Mark as Prepared</StyledText>
                    </StyledView>
                </TouchableOpacity>
            </Dialog>
        </Portal>
    );
};

export default OrderDialog;