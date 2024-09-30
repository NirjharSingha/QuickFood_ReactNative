import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import { styled } from 'nativewind';
import { Button, Dialog, Portal } from 'react-native-paper';
import { Colors } from '@/constants/Colors';
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import unauthorized from '@/scripts/unauthorized';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { OrderCardType } from '@/scripts/type';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);

interface ComplaintProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    orderId: number;
    setOrders: any;
}

const Complaint: React.FC<ComplaintProps> = ({ visible, setVisible, orderId, setOrders }) => {
    const router = useRouter()
    const [warning, setWarning] = useState("");
    const [input, setInput] = useState("");

    const handler = async (complaint: string) => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.put(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/order/complaint?orderId=${orderId}&complain=${complaint}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                if (complaint !== "") {
                    Toast.show({
                        type: 'success',
                        text1: 'Complaint Submitted',
                        text2: 'We will look into your complaint and improve our services accordingly.',
                        visibilityTime: 4000,
                    })
                } else {
                    Toast.show({
                        type: 'success',
                        text1: 'No Complaint',
                        text2: 'Thank you for your feedback.',
                        visibilityTime: 4000,
                    })
                }
                setOrders((prev: OrderCardType[]) => {
                    const filteredOrderCards = prev.filter((card) => card.id !== orderId);
                    return filteredOrderCards;
                });
                setVisible(false);
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router);
        }
    };

    const hideDialog = () => setVisible(false);

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog} style={{ backgroundColor: 'white', borderRadius: 12 }}>
                <Dialog.Content>
                    <StyledText className='font-bold text-gray-700 mb-2' style={{ fontSize: 18 }}>Complaint</StyledText>
                    <StyledText className='text-red-500 w-full text-center mb-1' style={{ fontSize: 13 }}>{warning}</StyledText>
                    <StyledInput
                        className="border-b-[1px] border-gray-400 mb-4 w-full pl-1 outline-none cursor-pointer bg-white"
                        placeholder={"Write your complaint here"}
                        keyboardType={"default"}
                        value={input}
                        style={{ fontSize: 14 }}
                        onChangeText={(text) => {
                            setInput(text);
                            setWarning("");
                        }}
                    />
                    <StyledText style={{ fontSize: 14, color: Colors.light.primaryGray }}>Your order is successfully delivered to you. Do you have any complaint regarding our services?</StyledText>
                </Dialog.Content>
                <Dialog.Actions style={{ marginTop: -12 }}>
                    <Button onPress={() => handler('')}>No Complain</Button>
                    <Button onPress={async () => {
                        if (input === "") {
                            setWarning("Fill your complaint in the input field!");
                            return;
                        }
                        handler(input);
                    }}>Submit Complain</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal >
    )
}

export default Complaint