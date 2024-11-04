import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";
import axios, { AxiosError } from 'axios';
import { useRouter, useLocalSearchParams, usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';
import Loading from '@/components/Loading';
import { styled } from 'nativewind';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ModernDatePicker from '@/components/input/DatePicker';
import unauthorized from '@/scripts/unauthorized';
import Toast from 'react-native-toast-message';
import { useGlobal } from '@/contexts/Globals';
import { SwitchInput } from '@/components/input/Switch';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledScrollView = styled(ScrollView)

export const RestaurantAnalytics: React.FC<{ id: string }> = ({ id }) => {
    const [topSoldItems, setTopSoldItems] = useState<{ value: number, text: string }[]>([]);
    const [topSoldLabels, setTopSoldLabels] = useState<string[]>([]);
    const [weeklySales, setWeeklySales] = useState<{ value: number, label: string }[]>([]);
    const [monthlySales, setMonthlySales] = useState<{ value: number, label: string }[]>([]);
    const [topReviewedItems, setTopReviewedItems] = useState<{ value: number, label: string }[]>([]);
    const [pendingOrders, setPendingOrders] = useState<{ value: number, label: string }[]>([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date(Date.now()).toISOString())
    const { setCartCount } = useGlobal();
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [flags, setFlags] = useState<boolean[]>([false, false, false, false, false]);
    const router = useRouter();
    const pathname = usePathname()
    const { setUnseenNotificationCount } = useGlobal();

    const weeklySale = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/restaurant/getWeeklyRestaurantSale?timestampString=${selectedDate}&restaurantId=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                const data = response.data;
                const temp: { value: number, label: string }[] = []
                data.map((item: { first: string, second: number }) => {
                    temp.push({ value: item.second, label: item.first.substring(0, 3) });
                });
                setWeeklySales(temp);
                setFlags((prev) => prev.map((flag, index) => index === 0 ? true : flag));
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount, setUnseenNotificationCount);
        }
    };

    const getTopSoldItems = async () => {
        if (pathname.includes('/admin')) {
            setFlags((prev) => prev.map((flag, index) => index === 1 ? true : flag));
            return;
        }

        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/restaurant/getTopSoldItems?restaurantId=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                const data = response.data;
                const temp: { value: number, text: string }[] = []
                const tempLabels: string[] = []
                data.map((item: { first: string, second: number }) => {
                    temp.push({ value: item.second, text: item.second.toFixed(1) });
                    tempLabels.push(item.first);
                });
                setTopSoldItems(temp);
                setTopSoldLabels(tempLabels);
                setFlags((prev) => prev.map((flag, index) => index === 1 ? true : flag));
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount, setUnseenNotificationCount);
        }
    };

    const monthlySale = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/restaurant/getMonthlyRestaurantSale?restaurantId=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                const data = response.data;
                const temp: { value: number, label: string }[] = []
                data.map((item: { first: string, second: number }) => {
                    temp.push({ value: item.second, label: item.first.substring(0, 3) });
                });
                setMonthlySales(temp);
                setFlags((prev) => prev.map((flag, index) => index === 2 ? true : flag));
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount, setUnseenNotificationCount);
        }
    };

    const getTopReviewedItems = async () => {
        if (pathname.includes('/admin')) {
            setFlags((prev) => prev.map((flag, index) => index === 3 ? true : flag));
            return;
        }

        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/restaurant/getTopReviewedItems?restaurantId=${id}&flag=${isSwitchOn ? 'best' : 'worst'}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                const data = response.data;
                const temp: { value: number, label: string }[] = data.map((item: { first: string, second: number }) => ({
                    value: item.second,
                    label: item.first,
                }));
                setTopReviewedItems(temp);
                setFlags((prev) => prev.map((flag, index) => index === 3 ? true : flag));
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount, setUnseenNotificationCount);
        }
    };

    const pendingOrderFetch = async () => {
        if (pathname.includes('/admin')) {
            setFlags((prev) => prev.map((flag, index) => index === 4 ? true : flag));
            return;
        }

        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/restaurant/getPendingOrdersToday?restaurantId=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                const data = response.data;
                const temp: { value: number, label: string }[] = data.map((item: { first: string, second: number }) => ({
                    value: item.second,
                    label: item.first,
                }));
                setPendingOrders(temp);
                setFlags((prev) => prev.map((flag, index) => index === 4 ? true : flag));
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount, setUnseenNotificationCount);
        }
    };

    useEffect(() => {
        if (id !== '') {
            getTopSoldItems();
            monthlySale();
            pendingOrderFetch();
        }
    }, [id])

    useEffect(() => {
        if (id !== '') {
            weeklySale();
        }
    }, [selectedDate, id])

    useEffect(() => {
        if (id !== '') {
            getTopReviewedItems();
        }
    }, [isSwitchOn, id])

    return (
        <View>
            {flags.includes(false) && <Loading />}
            {!flags.includes(false) &&
                <StyledScrollView className="w-screen p-3" showsVerticalScrollIndicator={false}>
                    <ModernDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} isDatePickerVisible={isDatePickerVisible} setDatePickerVisibility={setDatePickerVisibility} />
                    <StyledView className='w-full flex-row items-center py-[6px] px-[10px] shadow-sm shadow-gray-400 rounded-md bg-slate-200 mb-5'>
                        <StyledView className='w-7 h-7 flex-row justify-center items-center rounded-full bg-slate-400'>
                            <FontAwesome5 name='dollar-sign' size={18} color={Colors.light.primaryGray} />
                        </StyledView>
                        <StyledText className='text-gray-700 font-bold ml-2' style={{ fontSize: 16 }}>
                            Weekly Sales
                        </StyledText>
                        <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={{ marginLeft: 'auto' }} >
                            <FontAwesome5 name='calendar-alt' size={24} color={Colors.light.primaryGray} />
                        </TouchableOpacity>
                    </StyledView>
                    <LineChart data={weeklySales} areaChart noOfSections={6} height={240} />
                    <StyledView className='w-full flex-row items-center py-[6px] px-[10px] shadow-sm shadow-gray-400 rounded-md bg-slate-200 mt-5 mb-5'>
                        <StyledView className='w-7 h-7 flex-row justify-center items-center rounded-full bg-slate-400'>
                            <FontAwesome5 name='dollar-sign' size={18} color={Colors.light.primaryGray} />
                        </StyledView>
                        <StyledText className='text-gray-700 font-bold ml-2' style={{ fontSize: 16 }}>
                            Monthly Sales
                        </StyledText>
                    </StyledView>
                    <LineChart data={monthlySales} areaChart noOfSections={6} height={240} />
                    {topSoldItems.length > 0 && !pathname.includes('/admin') &&
                        <View>
                            <StyledView className='w-full flex-row items-center py-[6px] px-[10px] shadow-sm shadow-gray-400 rounded-md bg-slate-200 mt-5 mb-5'>
                                <StyledView className='w-7 h-7 flex-row justify-center items-center rounded-full bg-slate-400'>
                                    <MaterialCommunityIcons name='brightness-percent' size={18} color={Colors.light.primaryGray} />
                                </StyledView>
                                <StyledText className='text-gray-700 font-bold ml-2' style={{ fontSize: 16 }}>
                                    Top Sold Items
                                </StyledText>
                            </StyledView>
                            <StyledView className='flex-1 justify-center items-center mb-5'>
                                <PieChart data={topSoldItems} showText={true} donut radius={135} innerRadius={50} fontWeight='bold' textSize={12} />
                                <StyledView className="flex-row justify-center items-center mt-2 w-full flex-wrap">
                                    {topSoldItems.map((item, index) => (
                                        <StyledText key={index} className="text-gray-700 font-bold mx-2" style={{ fontSize: 12 }}>
                                            {topSoldLabels[index] + '-' + item.value.toFixed(1) + '%'}
                                        </StyledText>
                                    ))}
                                </StyledView>
                            </StyledView>
                        </View>
                    }
                    {topReviewedItems.length > 0 && !pathname.includes('/admin') &&
                        <View>
                            <StyledView className='w-full flex-row items-center py-[6px] px-[10px] shadow-sm shadow-gray-400 rounded-md bg-slate-200 mb-5'>
                                <StyledView className='w-7 h-7 flex-row justify-center items-center rounded-full bg-slate-400'>
                                    <AntDesign name="star" size={18} color={Colors.light.primaryGray} />
                                </StyledView>
                                <StyledText className='text-gray-700 font-bold ml-2' style={{ fontSize: 16 }}>
                                    Top Rated Items
                                </StyledText>
                                <StyledView className='ml-auto flex-row justify-center items-center'>
                                    <StyledText className={`${!isSwitchOn ? "text-gray-700" : "text-gray-400"}`} style={{ fontSize: 11 }}>
                                        Worst
                                    </StyledText>
                                    <SwitchInput isSwitchOn={isSwitchOn} setIsSwitchOn={setIsSwitchOn} />
                                    <StyledText className={`${isSwitchOn ? "text-gray-700" : "text-gray-400"}`} style={{ fontSize: 11 }}>
                                        Best
                                    </StyledText>
                                </StyledView>
                            </StyledView>
                            <BarChart noOfSections={6} data={topReviewedItems} height={240} maxValue={5} spacing={40} />
                        </View>
                    }
                    {pendingOrders.length > 0 && !pathname.includes('/admin') &&
                        <View>
                            <StyledView className='w-full flex-row items-center py-[6px] px-[10px] shadow-sm shadow-gray-400 rounded-md bg-slate-200 mt-5 mb-5'>
                                <StyledView className='w-7 h-7 flex-row justify-center items-center rounded-full bg-slate-400'>
                                    <MaterialIcons name='pending' size={18} color={Colors.light.primaryGray} />
                                </StyledView>
                                <StyledText className='text-gray-700 font-bold ml-2' style={{ fontSize: 16 }}>
                                    Pending Order Status
                                </StyledText>
                            </StyledView>
                            <BarChart noOfSections={6} data={pendingOrders} height={240} spacing={100} />
                        </View>
                    }
                    <StyledView className='mb-6' />
                </StyledScrollView>
            }
        </View>
    )
}

const analytics = () => {
    const { id } = useLocalSearchParams() as { id?: string };
    return <RestaurantAnalytics id={id as string} />
}

export default analytics