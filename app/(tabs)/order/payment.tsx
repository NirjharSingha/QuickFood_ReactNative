import React, { useEffect, useCallback } from "react";
import { styled } from "nativewind";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet } from "react-native";
import { Colors } from '@/constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from "react";
import { Radio } from "@/components/input/RadioButton";
import { TextInput } from "react-native-paper";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartType } from "@/scripts/type";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView)
const StyledTouchableOpacity = styled(TouchableOpacity);

const DeliveryAddress: React.FC<{ address: string, setAddress: any }> = ({ address, setAddress }) => {
    return (
        <TextInput
            mode="outlined"
            label="Delivery Address"
            placeholder="Enter Delivery Address"
            className="bg-slate-100 h-9"
            style={{ fontSize: 12 }}
            activeOutlineColor='gray'
            textColor={Colors.light.primaryGray}
            value={address}
            onChange={(text) => {
                setAddress(text)
            }}
        />
    );
};

const OrderSummary: React.FC<{ text: string, value: string }> = ({ text, value }) => {
    return (
        <StyledView className="flex-row items-center px-2 overflow-hidden py-[3px]">
            <StyledText className="font-bold text-gray-700">
                {text} :{' '}
            </StyledText>
            <StyledText className="text-gray-700" ellipsizeMode="middle" numberOfLines={1}>
                {value}
            </StyledText>
        </StyledView>
    )
}

const Payment = () => {
    const [paymentMethod, setPaymentMethod] = useState("first");
    const tipAmounts_1: number[] = [0, 10, 20];
    const tipAmounts_2: number[] = [30, 40, 50];
    const [tipIndex, setTipIndex] = useState(0);
    const [address, setAddress] = useState('')
    const [foodCost, setFoodCost] = useState(0);

    useEffect(() => {
        if (paymentMethod === 'second') {
            setTipIndex(0)
        }
    }, [paymentMethod])

    const handleFoodCost = async () => {
        let temp = await AsyncStorage.getItem("cart");
        if (!temp) return

        const cart: CartType = JSON.parse(temp);
        console.log(cart);

        if (cart && cart.total) {
            setFoodCost(cart.total);
        }
    }

    useFocusEffect(
        useCallback(() => {
            handleFoodCost();
        }, [])
    );

    const getRiderTip = () => {
        if (tipIndex > 2) return tipAmounts_2[tipIndex - 3]
        return tipAmounts_1[tipIndex]
    }

    return (
        <SafeAreaView style={{ height: '100%' }}>
            <StyledScrollView className={`bg-slate-100 w-full p-[6px]`} showsVerticalScrollIndicator={false} style={{ zIndex: 1, height: '100%' }}>
                <StyledView className="w-full h-full">
                    <StyledView className='flex-row justify-center items-center gap-3 mb-1'>
                        <MaterialIcons name="payments" size={38} color={Colors.light.primaryGray} style={{ textAlign: 'center' }} />
                        <StyledText style={styles.title}>Payment</StyledText>
                    </StyledView>
                    <StyledView className="border-2 border-gray-200 shadow rounded-md w-full pt-1 pb-1 mb-4 mt-1">
                        <StyledText className="font-bold pl-2 pr-2 mb-1 text-gray-700" style={{ fontSize: 18 }}>
                            Payment Method:
                        </StyledText>
                        <StyledView className="h-[1.5px] w-full bg-gray-200 mb-1" />
                        <StyledView className="min-w-full mr-auto flex-row">
                            <Radio checked={paymentMethod} setChecked={setPaymentMethod} text1="Online" text2="Cash On Delivery" />
                        </StyledView>
                    </StyledView>
                    <StyledView className="border-2 border-gray-200 shadow rounded-md w-full pt-1 pb-1 mb-4">
                        <StyledText className="font-bold pl-2 pr-2 mb-1 text-gray-700" style={{ fontSize: 18 }}>
                            Tip Your Rider:
                        </StyledText>
                        <StyledView className="h-[1.5px] w-full bg-gray-200 mb-1" />
                        <StyledText className="pl-2 pr-2 py-[2px]">
                            100% of the tip goes to your rider. We don't deduct anything from it. (Only applicable for online payment)
                        </StyledText>
                        <StyledView className="flex-row items-center justify-between px-2">
                            {tipAmounts_1.map((tipAmount, index) => (
                                <StyledTouchableOpacity
                                    className={`rounded-[4px] w-[70px] flex-row justify-center items-center p-1 mb-1 mt-[6px] ${tipIndex === index ? "bg-slate-400" : `bg-slate-200`}`}
                                    key={index}
                                    disabled={paymentMethod === 'second' || tipIndex === index}
                                    onPress={() => {
                                        if (paymentMethod === 'first') {
                                            setTipIndex(index)
                                        }
                                    }}
                                >
                                    <StyledText className="font-bold text-gray-700" style={{ fontSize: 12 }}>
                                        {tipAmount === 0 ? "Not Now" : tipAmount}
                                    </StyledText>
                                </StyledTouchableOpacity>
                            ))}
                        </StyledView>
                        <StyledView className="flex-row items-center justify-between px-2">
                            {tipAmounts_2.map((tipAmount, index) => (
                                <StyledTouchableOpacity
                                    className={`rounded-[4px] w-[70px] flex-row justify-center items-center p-1 mt-1 mb-[6px] ${tipIndex === index + 3 ? "bg-slate-400" : `bg-slate-200`}`}
                                    key={index}
                                    disabled={paymentMethod === 'second' || tipIndex === index + 3}
                                    onPress={() => {
                                        if (paymentMethod === 'first') {
                                            setTipIndex(index + 3)
                                        }
                                    }}
                                >
                                    <StyledText className="font-bold text-gray-700" style={{ fontSize: 12 }}>
                                        {tipAmount}
                                    </StyledText>
                                </StyledTouchableOpacity>
                            ))}
                        </StyledView>
                    </StyledView>
                    <StyledView className="border-2 border-gray-200 shadow rounded-md w-full pt-1 pb-1 mb-4">
                        <StyledText className="font-bold pl-2 pr-2 mb-1 text-gray-700" style={{ fontSize: 18 }}>
                            Delivert Address:
                        </StyledText>
                        <StyledView className="h-[1.5px] w-full bg-gray-200 mb-1" />
                        <StyledText className="pl-2 pr-2 py-[2px]">
                            Please fill the delivery address here.
                        </StyledText>
                        <StyledView className="px-2 my-[6px]">
                            <DeliveryAddress address={address} setAddress={setAddress} />
                        </StyledView>
                    </StyledView>
                    <StyledView className="border-2 border-gray-200 shadow rounded-md w-full pt-1 pb-1 mb-4">
                        <StyledText className="font-bold pl-2 pr-2 mb-1 text-gray-700" style={{ fontSize: 18 }}>
                            Order Summary:
                        </StyledText>
                        <StyledView className="h-[1.5px] w-full bg-gray-200 mb-1" />
                        <OrderSummary text="Food Cost" value={`${foodCost} Tk`} />
                        <OrderSummary text="Delivery Charge" value={`${(foodCost * 0.1).toFixed(0)} Tk`} />
                        <OrderSummary text="Rider Tip" value={`${tipIndex === 0 ? 'No Tip' : `${getRiderTip()} Tk`}`} />
                        <OrderSummary text="Total" value={`${(parseFloat((foodCost * 1.1).toFixed(0)) + getRiderTip())} Tk`} />
                        <OrderSummary text="Payment" value={paymentMethod === 'first' ? 'Online' : 'Cash On Delivery'} />
                    </StyledView>
                </StyledView>
            </StyledScrollView>
            <TouchableOpacity style={{ padding: 6 }}>
                <StyledView className='flex-row bg-blue-500 py-[6px] items-center justify-center rounded-md my-[2px]'>
                    <StyledText className='text-white font-bold ml-2 text-base'>Confirm order</StyledText>
                </StyledView>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default Payment;

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        color: Colors.light.primaryGray,
        fontSize: 26,
        fontWeight: 'bold',
    },
})