import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { styled } from 'nativewind'
import Loading from '@/components/Loading'
import Feather from '@expo/vector-icons/Feather';
import { Colors } from '@/constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import unauthorized from '@/scripts/unauthorized';
import Toast from 'react-native-toast-message';
import { useGlobal } from "@/contexts/Globals";
import { useFocusEffect } from '@react-navigation/native';

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledScrollView = styled(ScrollView)


interface NotificationCardProps {
    notification: any;
    setNotifications: any;
    setUnreadCount: any;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, setNotifications, setUnreadCount }) => {
    const router = useRouter();
    const { setCartCount } = useGlobal();
    const { setUnseenNotificationCount } = useGlobal();

    const deleteOne = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.delete(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/notification/deleteByNotificationId?notificationId=${notification.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                if (!notification.isSeen) {
                    setUnreadCount((prev: number) => prev - 1);
                }
                setNotifications((prev: any) => {
                    const newNotifications = prev.filter(
                        (item: any) => item.id !== notification.id
                    );
                    return newNotifications;
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount, setUnseenNotificationCount);
        }
    }

    return (
        <StyledView className='pr-[1.5px] pb-[1.5px] pt-0 pl-0 my-[8px] bg-gray-300 rounded-md'>
            <StyledView className='bg-slate-50 p-2 rounded-md'>
                <StyledView className='flex-row items-center'>
                    <StyledView className={`w-[10px] h-[10px] mr-2 rounded-full ${notification.isSeen ? 'bg-slate-50' : 'bg-sky-500'}`} style={{ maxWidth: 10, maxHeight: 10 }} />
                    <StyledView className="flex-1">
                        <StyledText className="text-gray-800">
                            {notification.description}
                        </StyledText>
                        <StyledText className="text-gray-400 mt-[2px] ml-auto mr-2" style={{ fontSize: 13 }}>
                            {new Date(notification.timestamp).toLocaleString()}
                        </StyledText>
                    </StyledView>
                    <TouchableOpacity onPress={deleteOne}>
                        <MaterialIcons name="delete" size={23} color={Colors.light.primaryGray} style={{ marginLeft: 'auto', marginTop: 0 }} />
                    </TouchableOpacity>
                </StyledView>
            </StyledView>
        </StyledView>
    )
}

const notifications = () => {
    const [showLoading, setShowLoading] = useState(true)
    const { light } = Colors
    const router = useRouter();
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const { setCartCount, setUnseenNotificationCount } = useGlobal();

    const deleteAll = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (token === null || token === undefined) {
                router.push("/auth/login");
                return;
            }
            const userId = jwtDecode(token).sub;
            const response = await axios.delete(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/notification/deleteByUserId?userId=${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                setNotifications([]);
                setUnreadCount(0);
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount, setUnseenNotificationCount);
        }
    }

    const getNotifications = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (token === null || token === undefined) {
                router.push("/auth/login");
                return;
            }
            const userId = jwtDecode(token).sub;
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/notification/getNotifications?userId=${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                setNotifications(response.data.reverse());
                let count = 0;
                response.data.map((data: any) => {
                    if (!data.isSeen) {
                        count++;
                    }
                });
                setUnreadCount(count);
                setShowLoading(false);
                setUnseenNotificationCount(0);
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount, setUnseenNotificationCount);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getNotifications();
        }, [])
    );

    return (
        <View>
            {showLoading && <Loading />}
            {!showLoading && (
                <SafeAreaView style={{ height: '100%' }}>
                    <StyledScrollView className={`w-full p-[10px]`} showsVerticalScrollIndicator={false} style={{ zIndex: 1, height: '100%' }}>
                        <StyledView className="w-full h-full">
                            <StyledView className='flex-row items-center gap-2'>
                                <Feather name="bell" size={26} color={light.primaryGray} />
                                <StyledText className='font-bold' style={{ fontSize: 21, color: light.primaryGray, marginBottom: 4 }}>Notifications</StyledText>
                            </StyledView>
                            <StyledText className='text-gray-400 ml-[2px] mb-[6px]' style={{ fontSize: 14 }}>
                                {unreadCount === 0 ? "No unread notification" : `${unreadCount} unread ${unreadCount === 1 ? "notification" : "notifications"}`}
                            </StyledText>
                            {notifications.map((notification: any) => (
                                <NotificationCard key={notification.id} notification={notification} setNotifications={setNotifications} setUnreadCount={setUnreadCount} />
                            ))}
                        </StyledView>
                    </StyledScrollView>
                    <TouchableOpacity style={{ padding: 6 }} onPress={deleteAll}>
                        <StyledView className='flex-row bg-blue-500 py-[6px] items-center justify-center rounded-md my-[2px]'>
                            <StyledText className='text-white font-bold ml-2 text-base'>Delete All Notifications</StyledText>
                        </StyledView>
                    </TouchableOpacity>
                </SafeAreaView>
            )}
        </View >
    )
}

export default notifications