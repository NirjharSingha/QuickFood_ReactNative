import { styled } from 'nativewind';
import * as React from 'react';
import { ScrollView, Image, Text as Text1, View } from 'react-native';
import { DataTable } from 'react-native-paper';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { router, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import unauthorized from '@/scripts/unauthorized';
import Toast from 'react-native-toast-message';
import { MenuType, OrderDetailsType } from '@/scripts/type';

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
}

const OrderDialog: React.FC<OrderDialogProps> = ({ selectedOrder = 1, visible, setVisible }) => {
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [orderDetails, setOrderDetails] = useState<OrderDetailsType>({});
    const [orderStatus, setOrderStatus] = useState(-1);

    const [items] = React.useState([
        {
            key: 1,
            name: 'Cupcake',
            calories: 356,
            fat: 16,
        },
        {
            key: 2,
            name: 'Eclair',
            calories: 262,
            fat: 16,
        },
        {
            key: 3,
            name: 'Frozen yogurt',
            calories: 159,
            fat: 6,
        },
        {
            key: 4,
            name: 'Gingerbread',
            calories: 305,
            fat: 3.7,
        },
    ]);

    const hideDialog = () => setVisible(false);
    const [tableData, setTableData] = useState<DataType[]>([]);
    const [tableQuantity, setTableQuantity] = useState<number[]>([]);

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
                let quantity: number[] = [];
                response.data.menuItems.forEach((item: MenuItemType) => {
                    data.push({
                        id: item.menuId,
                        name: item.menuName,
                        price: item.price,
                        image: item.image,
                    });
                    quantity.push(item.quantity);
                });
                setTableData(data);
                setTableQuantity(quantity);

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
            <Dialog visible={visible} onDismiss={hideDialog} style={{ backgroundColor: 'white', borderRadius: 12, marginHorizontal: 4 }}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                    <ScrollView showsVerticalScrollIndicator={false}>




                        <StyledView className="w-full h-[210px] p-1 shadow-md border-gray-300 border-[0.1px] shadow-gray-300 rounded-xl gap-3 mb-3 justify-between items-center" style={{ flexDirection: 'row', alignItems: 'center', width: 450 }}>
                            <StyledImage
                                source={require("@/assets/images/dialogImage.jpeg")}
                                alt="logo"
                                className={`my-auto rounded-lg`}
                                resizeMode='contain'
                            />
                            <StyledView className="h-full flex-col justify-center w-full overflow-hidden">
                                <StyledText className={`font-bold text-gray-700 mb-1`}>
                                    {pathname.includes("/restaurants") ? `Customer: ${orderDetails.customerName ? orderDetails.customerName : ""}`
                                        : `Restaurant: ${orderDetails.restaurantName ? orderDetails.restaurantName : ""}`}
                                </StyledText>
                                <StyledText className={`font-bold text-gray-700 mb-1`}>
                                    Rider: {orderDetails.riderName ? orderDetails.riderName : ""}
                                </StyledText>
                                <StyledText className={`text-gray-700 mb-1`}>
                                    Payment: {orderDetails.paymentMethod === "COD" ? "COD" : "Done"}
                                </StyledText>
                                <StyledText className={`text-gray-700 mb-1`}>
                                    Order placed:{" "}
                                    {new Date(orderDetails.orderPlaced).toLocaleTimeString()}
                                </StyledText>
                            </StyledView>
                        </StyledView>






                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title textStyle={{ color: 'gray', fontWeight: 'bold' }}>Dessert</DataTable.Title>
                                <DataTable.Title numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>Calories</DataTable.Title>
                                <DataTable.Title numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>Fat</DataTable.Title>
                            </DataTable.Header>

                            {items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}
                            {items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}{items.map((item) => (
                                <DataTable.Row key={item.key}>
                                    <DataTable.Cell textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.calories}</DataTable.Cell>
                                    <DataTable.Cell numeric textStyle={{ color: 'gray', fontWeight: 'bold' }}>{item.fat}</DataTable.Cell>
                                </DataTable.Row>
                            ))}
                        </DataTable>
                    </ScrollView>
                </ScrollView>
            </Dialog>
        </Portal>
    );
};

export default OrderDialog;