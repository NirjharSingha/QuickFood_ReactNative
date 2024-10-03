import { styled } from 'nativewind';
import * as React from 'react';
import { ScrollView, Image, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import unauthorized from '@/scripts/unauthorized';
import Toast from 'react-native-toast-message';
import Loading from '@/components/Loading';
import { OrderTable as Table } from '@/components/Table';
import { CartType, MenuType } from '@/scripts/type';
import { OrderTableType } from '@/scripts/type';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';
import { useGlobal } from '@/contexts/Globals';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

const cart = () => {
    const [showLoading, setShowLoading] = useState(false);
    const router = useRouter();
    const [tableData, setTableData] = useState<OrderTableType[]>([]);
    const [total, setTotal] = useState(0);
    const [restaurantName, setRestaurantName] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const { setCartCount } = useGlobal();

    const getCart = async () => {
        let temp = await AsyncStorage.getItem("cart");
        if (!temp) {
            setShowMessage(true);
            return;
        }

        let cart: CartType = JSON.parse(temp);
        if (cart) {
            const selectedMenu = cart.selectedMenu;
            setCartCount(selectedMenu.length);
            if (selectedMenu && selectedMenu.length !== 0) {
                let ids: number[] = [];
                let tempQuantity: number[] = [];
                selectedMenu.forEach((menu) => {
                    ids.push(menu.selectedMenuId);
                    tempQuantity.push(menu.selectedMenuQuantity);
                });

                const token = await AsyncStorage.getItem("token");
                try {
                    setShowLoading(true);
                    const response = await axios.get(
                        `${process.env.EXPO_PUBLIC_SERVER_URL}/menu/getCartMenu?menuIds=${ids}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    if (response.status === 200) {
                        setShowLoading(false);
                        if (response.data.length === 0) {
                            setShowMessage(true);
                        } else {
                            setShowMessage(false);
                            const data: MenuType[] = response.data;
                            let tempTableData: OrderTableType[] = [];
                            let tempTotal = 0;
                            data.forEach((menu: MenuType, index: number) => {
                                tempTableData.push({
                                    id: menu.id,
                                    name: menu.name,
                                    price: menu.price,
                                    image: menu.image,
                                    quantity: tempQuantity[index],
                                });
                                tempTotal += menu.price * tempQuantity[index];
                            });
                            setTotal(tempTotal);
                            setTableData(tempTableData);
                            cart = { ...cart, total: tempTotal };
                            await AsyncStorage.setItem("cart", JSON.stringify(cart));
                        }
                    }
                } catch (error) {
                    const axiosError = error as AxiosError;
                    unauthorized(axiosError, Toast, AsyncStorage, router);
                }

                const selectedRes = cart.restaurantId;
                try {
                    const response = await axios.get(
                        `${process.env.EXPO_PUBLIC_SERVER_URL}/restaurant/getRestaurantName?resId=${selectedRes}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    if (response.status === 200) {
                        setRestaurantName(response.data);
                        setShowLoading(false);
                    }
                } catch (error) {
                    const axiosError = error as AxiosError;
                    unauthorized(axiosError, Toast, AsyncStorage, router);
                }
            } else {
                setShowMessage(true);
                setShowLoading(false);
            }
        } else {
            setShowMessage(true);
            setShowLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getCart();
        }, [])
    );

    const clearCart = async () => {
        await AsyncStorage.removeItem("cart");
        setCartCount(0);
        setShowMessage(true);
    }

    return (
        <View>
            {showLoading && <Loading />}
            {!showLoading && showMessage && (
                <StyledView className='flex-row w-full h-full justify-center items-center'>
                    <StyledText className="text-gray-500" style={{ fontSize: 14, paddingBottom: 24.5 }}>
                        No Items In Cart
                    </StyledText>
                </StyledView>
            )}
            {!showLoading && !showMessage &&
                <SafeAreaView style={{ height: '100%', paddingTop: 6 }}>
                    <StyledView className='flex-row justify-center items-center gap-3 mb-1'>
                        <FontAwesome5 name="shopping-cart" size={38} color={Colors.light.primaryGray} style={{ textAlign: 'center' }} />
                        <StyledText style={styles.title}>Cart</StyledText>
                    </StyledView>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 6, paddingRight: 0 }}>
                            <StyledView className="w-full h-[210px] p-1 pt-0 shadow-md rounded-xl gap-3 mb-3 mt-[-20px] justify-between items-center" style={{ flexDirection: 'row', alignItems: 'center', width: 500 }}>
                                <StyledImage
                                    source={require("@/assets/images/dialogImage.jpeg")}

                                    alt="logo"
                                    className={`ml-2 rounded-lg`}
                                    resizeMode='contain'
                                />
                                <StyledView className="h-full flex-col justify-center w-full overflow-hidden">
                                    <StyledText className={`font-bold text-gray-700 mb-1`} style={{ fontSize: 18 }}>
                                        Restaurant : {restaurantName}
                                    </StyledText>
                                    <StyledText className={`text-gray-700 mb-1`}>
                                        Food Cost: {total.toFixed(0)}
                                    </StyledText>
                                    <StyledText className={`text-gray-700 mb-1`}>
                                        Delivery Charge: {(total * 0.1).toFixed(0)}
                                    </StyledText>
                                    <StyledText className={`text-gray-700 mb-1`}>
                                        Total: {(total * 1.1).toFixed(0)}
                                    </StyledText>
                                    <StyledText className={`text-gray-700 mb-1`}>
                                        Delivery Time : 30 minutes
                                    </StyledText>
                                    <TouchableOpacity style={{ padding: 6 }} onPress={clearCart}>
                                        <StyledView className='w-[150px] bg-slate-500 py-[2px] rounded-[3px] my-[2px]' style={{ marginLeft: -4 }}>
                                            <StyledText className='text-white font-bold text-center' style={{ fontSize: 14 }}>Clear Cart</StyledText>
                                        </StyledView>
                                    </TouchableOpacity>
                                </StyledView>
                            </StyledView>
                            <Table data={tableData} />
                        </ScrollView>
                    </ScrollView>
                    <TouchableOpacity style={{ padding: 6 }} onPress={() => router.push('/order/payment')}>
                        <StyledView className='flex-row bg-blue-500 py-[6px] items-center justify-center rounded-md my-[2px]'>
                            <StyledText className='text-white font-bold ml-2 text-base'>Go for Payment</StyledText>
                        </StyledView>
                    </TouchableOpacity>
                </SafeAreaView>
            }
        </View>
    )
}

export default cart

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        color: Colors.light.primaryGray,
        fontSize: 26,
        fontWeight: 'bold',
    },
})