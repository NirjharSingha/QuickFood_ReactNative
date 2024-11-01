import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BarChart, PieChart } from "react-native-gifted-charts";
import axios, { AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';
import Loading from '@/components/Loading';
import { styled } from 'nativewind';
import { FontAwesome5 } from '@expo/vector-icons';
import ModernDatePicker from '@/components/input/DatePicker';
import unauthorized from '@/scripts/unauthorized';
import Toast from 'react-native-toast-message';
import { useGlobal } from '@/contexts/Globals';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { jwtDecode } from 'jwt-decode';
import { deliverData, stackData } from '@/scripts/type';
import { StackData } from '@/components/StackData';

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledScrollView = styled(ScrollView)

export const DeliveryAnalytics: React.FC<{ riderId: string }> = ({ riderId }) => {
    const [weeklyDeliveries, setWeeklyDeliveries] = useState<stackData[]>([])
    const [monthlyDeliveries, setMonthlyDeliveries] = useState<stackData[]>([]);
    const [allDeliveries, setAllDeliveries] = useState<{ value: number, text: string }[]>([]);
    const [allDeliveryLabels, setAllDeliveryLabels] = useState<string[]>([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date(Date.now()).toISOString())
    const { setCartCount } = useGlobal();
    const [flags, setFlags] = useState<boolean[]>([false, false, false]);
    const router = useRouter();

    const weeklyDelivery = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/user/weeklyDeliveryStatus?timestampString=${selectedDate}&riderId=${riderId}`,
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
                setFlags((prev) => prev.map((flag, index) => index === 0 ? true : flag));
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
                `${process.env.EXPO_PUBLIC_SERVER_URL}/user/monthlyDeliveryStatus?riderId=${riderId}`,
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
                setFlags((prev) => prev.map((flag, index) => index === 1 ? true : flag));
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount);
        }
    };

    const allDelivery = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/user/allDelivery?riderId=${riderId}`,
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
                setAllDeliveries(temp);
                setAllDeliveryLabels(tempLabels);
                setFlags((prev) => prev.map((flag, index) => index === 2 ? true : flag));
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount);
        }
    };

    useEffect(() => {
        if (riderId !== '') {
            monthlyDelivery();
            allDelivery();
        }
    }, [riderId])

    useEffect(() => {
        if (riderId !== '') {
            weeklyDelivery();
        }
    }, [selectedDate, riderId])

    return (
        <View>
            {flags.includes(false) && <Loading />}
            {!flags.includes(false) &&
                <StyledScrollView className="w-screen p-3" showsVerticalScrollIndicator={false}>
                    <ModernDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} isDatePickerVisible={isDatePickerVisible} setDatePickerVisibility={setDatePickerVisibility} />
                    <StyledView className='w-full flex-row items-center py-[6px] px-[10px] shadow-sm shadow-gray-400 rounded-md bg-slate-200 mb-5'>
                        <StyledView className='w-7 h-7 flex-row justify-center items-center rounded-full bg-slate-400'>
                            <MaterialIcons name="delivery-dining" size={18} color={Colors.light.primaryGray} />
                        </StyledView>
                        <StyledText className='text-gray-700 font-bold ml-2' style={{ fontSize: 16 }}>
                            Weekly Deliveries
                        </StyledText>
                        <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={{ marginLeft: 'auto' }} >
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
                    {allDeliveries.length > 0 &&
                        <View>
                            <StyledView className='w-full flex-row items-center py-[6px] px-[10px] shadow-sm shadow-gray-400 rounded-md bg-slate-200 mt-5 mb-5'>
                                <StyledView className='w-7 h-7 flex-row justify-center items-center rounded-full bg-slate-400'>
                                    <MaterialIcons name="delivery-dining" size={18} color={Colors.light.primaryGray} />
                                </StyledView>
                                <StyledText className='text-gray-700 font-bold ml-2' style={{ fontSize: 16 }}>
                                    All Deliveries
                                </StyledText>
                            </StyledView>
                            <StyledView className='flex-1 justify-center items-center mb-5'>
                                <PieChart data={allDeliveries} showText={true} donut radius={135} innerRadius={50} fontWeight='bold' textSize={12} />
                                <StyledView className="flex-row justify-center items-center mt-2 w-full flex-wrap">
                                    {allDeliveries.map((item, index) => (
                                        <StyledText key={index} className="text-gray-700 font-bold mx-2" style={{ fontSize: 12 }}>
                                            {allDeliveryLabels[index] + '-' + item.value.toFixed(0)}
                                        </StyledText>
                                    ))}
                                </StyledView>
                            </StyledView>
                        </View>
                    }
                    {allDeliveries.length === 0 && <StyledView className='mb-6' />}
                </StyledScrollView>
            }
        </View>
    )
}

const analytics = () => {
    const [riderId, setRiderId] = useState<string>('')
    const router = useRouter()

    useEffect(() => {
        const init = async () => {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                router.push("/auth/login");
                return;
            }
            const id = jwtDecode(token).sub;
            setRiderId(id as string);
        }

        init();
    }, [])

    return (
        <DeliveryAnalytics riderId={riderId} />
    )
}

export default analytics