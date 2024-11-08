import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { styled } from 'nativewind'
import Delivery from '@/assets/images/deliveryHeader.jpg'
import axios, { AxiosError } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import Loading from '@/components/Loading'
import unauthorized from '@/scripts/unauthorized'
import Toast from 'react-native-toast-message'
import { useGlobal } from '@/contexts/Globals'
import { AdminTable } from '@/components/Table'
import { useFocusEffect } from '@react-navigation/native'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledScrollView = styled(ScrollView)

const index = () => {
    const [riders, setRiders] = useState<{ id: string, name: string, image: string }[]>([]);
    const { setCartCount } = useGlobal();
    const [showLoading, setShowLoading] = useState(true);
    const router = useRouter();
    const { setUnseenNotificationCount } = useGlobal();

    const getAllRiders = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/user/getAllRiders`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status == 200) {
                setRiders(response.data);
                setShowLoading(false);
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount, setUnseenNotificationCount);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getAllRiders();
        }, [])
    );

    return (
        <View>
            {showLoading && <Loading />}
            {!showLoading && (
                <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
                    <StyledView className=" bg-[#374151] px-3 py-2">
                        <StyledView className="flex-row items-center mb-2">
                            <StyledView className="rounded-full mr-[6px] border-[1px] border-solid border-white p-1 bg-yellow-50">
                                <Image source={Delivery} style={{ width: 27, height: 27, borderRadius: 10 }} />
                            </StyledView>
                            <StyledText className="text-lg text-white font-bold">
                                All Riders
                            </StyledText>
                        </StyledView>
                        <StyledView className='flex-row'>
                            <StyledView className='w-[8px] h-[8px] rounded-full bg-white mr-1 mt-[5.5px]' />
                            <StyledText className='text-white' style={{ fontSize: 13 }}>All the riders registered on the app are listed below.</StyledText>
                        </StyledView>
                        <StyledView className='flex-row'>
                            <StyledView className='w-[8px] h-[8px] rounded-full bg-white mr-1 mt-[5.5px]' />
                            <StyledText className='text-white' style={{ fontSize: 13 }}>Click on the analytics button of the rider to see the performance analytics of the rider.</StyledText>
                        </StyledView>
                    </StyledView>
                    <StyledScrollView horizontal showsHorizontalScrollIndicator={false} className='p-[6px] pr-0'>
                        <AdminTable data={riders} />
                    </StyledScrollView>
                </ScrollView>
            )}
        </View>
    )
}

export default index