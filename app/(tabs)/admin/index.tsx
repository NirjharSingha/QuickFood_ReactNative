import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";
import axios, { AxiosError } from 'axios';
import { useRouter } from 'expo-router';
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
import { deliverData, stackData } from '@/scripts/type';
import { StackData } from '@/components/StackData';

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledScrollView = styled(ScrollView)

const dashboard = () => {
    const [weeklySales, setWeeklySales] = useState<{ value: number, label: string }[]>([]);
    const [monthlySales, setMonthlySales] = useState<{ value: number, label: string }[]>([]);

    const [topSellingRestaurants, setTopSellingRestaurants] = useState<{ value: number, text: string }[]>([]);
    const [topSellingLabels, setTopSellingLabels] = useState<string[]>([]);
    const [topReviewedRestaurants, setTopReviewedRestaurants] = useState<{ value: number, label: string }[]>([]);

    const [weeklyDeliveries, setWeeklyDeliveries] = useState<stackData[]>([])
    const [monthlyDeliveries, setMonthlyDeliveries] = useState<stackData[]>([]);

    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
    const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date(Date.now()).toISOString())
    const [selectedDate2, setSelectedDate2] = useState(new Date(Date.now()).toISOString())
    const { setCartCount } = useGlobal();
    const [flags, setFlags] = useState<boolean[]>([false, false, false, false, false, false]);
    const router = useRouter();


    const weeklySale = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/admin/getWeeklySale?timestampString=${selectedDate}`,
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
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount);
        }
    };

    const monthlySale = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/admin/getMonthlySale`,
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
                setFlags((prev) => prev.map((flag, index) => index === 1 ? true : flag));
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount);
        }
    };

    const getTopSellingRestaurants = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/admin/salePerRestaurant`,
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

                setTopSellingRestaurants(temp);
                setTopSellingLabels(tempLabels);

                setFlags((prev) => prev.map((flag, index) => index === 2 ? true : flag));
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount);
        }
    };

    const getTopReviewedRestaurants = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/admin/topReviewedRestaurants?flag=${isSwitchOn ? 'best' : 'worst'}`,
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
                setTopReviewedRestaurants(temp);
                setFlags((prev) => prev.map((flag, index) => index === 3 ? true : flag));
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount);
        }
    };

    const weeklyDelivery = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/admin/weeklyDeliveryStatus?timestampString=${selectedDate2}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                const data = response.data;
                const temp: stackData[] = []
                data.map((item: deliverData) => {
                    temp.push({
                        stacks: [
                            { value: item.successDeliveries, color: 'green' },
                            { value: item.lateDeliveries, color: 'blue' },
                            { value: item.complaintDeliveries, color: 'purple' },
                            { value: item.bothIssues, color: 'red' }
                        ],
                        label: item.name.substring(0, 3)
                    });
                });
                setWeeklyDeliveries(temp);
                setFlags((prev) => prev.map((flag, index) => index === 4 ? true : flag));
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount);
        }
    };

    const monthlyDelivery = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/admin/monthlyDeliveryStatus`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                const data = response.data;
                const temp: stackData[] = []
                data.map((item: deliverData) => {
                    temp.push({
                        stacks: [
                            { value: item.successDeliveries, color: 'green' },
                            { value: item.lateDeliveries, color: 'blue' },
                            { value: item.complaintDeliveries, color: 'purple' },
                            { value: item.bothIssues, color: 'red' }
                        ],
                        label: item.name.substring(0, 3)
                    });
                });
                setMonthlyDeliveries(temp);
                setFlags((prev) => prev.map((flag, index) => index === 5 ? true : flag));
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount);
        }
    };

    useEffect(() => {
        monthlySale();
        monthlyDelivery();
        getTopSellingRestaurants();
    }, [])

    useEffect(() => {
        weeklySale();
    }, [selectedDate])

    useEffect(() => {
        weeklyDelivery();
    }, [selectedDate2])

    useEffect(() => {
        getTopReviewedRestaurants();
    }, [isSwitchOn])

    return (
        <View>
            {flags.includes(false) && <Loading />}
            {!flags.includes(false) &&
                <StyledScrollView className="w-screen p-3" showsVerticalScrollIndicator={false}>
                    <ModernDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} isDatePickerVisible={isDatePickerVisible} setDatePickerVisibility={setDatePickerVisibility} />
                    <ModernDatePicker selectedDate={selectedDate2} setSelectedDate={setSelectedDate2} isDatePickerVisible={isDatePickerVisible2} setDatePickerVisibility={setDatePickerVisibility2} />
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
                    {topSellingRestaurants.length > 0 &&
                        <View>
                            <StyledView className='w-full flex-row items-center py-[6px] px-[10px] shadow-sm shadow-gray-400 rounded-md bg-slate-200 mt-5 mb-5'>
                                <StyledView className='w-7 h-7 flex-row justify-center items-center rounded-full bg-slate-400'>
                                    <MaterialCommunityIcons name='brightness-percent' size={18} color={Colors.light.primaryGray} />
                                </StyledView>
                                <StyledText className='text-gray-700 font-bold ml-2' style={{ fontSize: 16 }}>
                                    Top Selling Restaurants
                                </StyledText>
                            </StyledView>
                            <StyledView className='flex-1 justify-center items-center'>
                                <PieChart data={topSellingRestaurants} donut radius={135} innerRadius={50} fontWeight='bold' textSize={12} />
                                <StyledView className="flex-row justify-center items-center mt-2 w-full flex-wrap">
                                    {topSellingRestaurants.map((item, index) => (
                                        <StyledText key={index} className="text-gray-700 font-bold mx-2" style={{ fontSize: 12 }}>
                                            {topSellingLabels[index] + '-' + item.value.toFixed(1)}
                                        </StyledText>
                                    ))}
                                </StyledView>
                            </StyledView>
                        </View>
                    }
                    {topReviewedRestaurants.length > 0 &&
                        <View>
                            <StyledView className='w-full flex-row items-center py-[6px] px-[10px] shadow-sm shadow-gray-400 rounded-md bg-slate-200 mt-5 mb-5'>
                                <StyledView className='w-7 h-7 flex-row justify-center items-center rounded-full bg-slate-400'>
                                    <AntDesign name="star" size={18} color={Colors.light.primaryGray} />
                                </StyledView>
                                <StyledText className='text-gray-700 font-bold ml-2' style={{ fontSize: 16 }}>
                                    Top Rated Restaurants
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
                            <BarChart noOfSections={6} data={topReviewedRestaurants} height={240} maxValue={5} spacing={40} />
                        </View>
                    }
                    <StyledView className='w-full flex-row items-center py-[6px] px-[10px] shadow-sm shadow-gray-400 rounded-md bg-slate-200 mt-5 mb-5'>
                        <StyledView className='w-7 h-7 flex-row justify-center items-center rounded-full bg-slate-400'>
                            <MaterialIcons name="delivery-dining" size={18} color={Colors.light.primaryGray} />
                        </StyledView>
                        <StyledText className='text-gray-700 font-bold ml-2' style={{ fontSize: 16 }}>
                            Weekly Deliveries
                        </StyledText>
                        <TouchableOpacity onPress={() => setDatePickerVisibility2(true)} style={{ marginLeft: 'auto' }} >
                            <FontAwesome5 name='calendar-alt' size={24} color={Colors.light.primaryGray} />
                        </TouchableOpacity>
                    </StyledView>
                    <BarChart noOfSections={4} stackData={weeklyDeliveries} height={240} spacing={40} />
                    <StackData />
                    <StyledView className='w-full flex-row items-center py-[6px] px-[10px] shadow-sm shadow-gray-400 rounded-md bg-slate-200 mt-5 mb-5'>
                        <StyledView className='w-7 h-7 flex-row justify-center items-center rounded-full bg-slate-400'>
                            <MaterialIcons name="delivery-dining" size={18} color={Colors.light.primaryGray} />
                        </StyledView>
                        <StyledText className='text-gray-700 font-bold ml-2' style={{ fontSize: 16 }}>
                            Monthly Deliveries
                        </StyledText>
                    </StyledView>
                    <BarChart noOfSections={8} stackData={monthlyDeliveries} height={240} spacing={40} />
                    <StackData />
                    <StyledView className='mb-6' />
                </StyledScrollView>
            }
        </View>
    )
}

export default dashboard