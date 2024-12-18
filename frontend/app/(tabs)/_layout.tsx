import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Tabs } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobal } from '@/contexts/Globals';
import { jwtDecode } from 'jwt-decode';
import { useSocket } from '@/contexts/Socket';
import axios, { AxiosError } from 'axios';
import unauthorized from '@/scripts/unauthorized';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useFocusEffect } from '@react-navigation/native';
import { ChatUserType, SocketDataType } from '@/scripts/type';

const validRoles = ['USER', 'RIDER', 'ADMIN', ''] as const;
type Role = typeof validRoles[number];

export default function TabLayout() {
    const [role, setRole] = useState<Role>('');
    const pathname = usePathname();
    const { setCartCount, setUnseenNotificationCount } = useGlobal();
    const { setChats, setIsTyping, currentUrl, setChatUsers, scrollViewRef } = useSocket();
    const router = useRouter();
    const currentUrlRef = useRef(currentUrl); // create a ref for currentUrl

    useEffect(() => {
        currentUrlRef.current = currentUrl; // update ref whenever currentUrl changes
    }, [currentUrl]);

    const handleInit = async () => {
        let tempRole = await AsyncStorage.getItem('role');

        if (!tempRole || !validRoles.includes(tempRole as Role)) {
            router.push('/auth/login');
            return;
        }

        setRole(tempRole as Role);

        if (tempRole === 'USER') {
            let temp = await AsyncStorage.getItem('cart');
            if (!temp) return

            let cart = JSON.parse(temp);

            if (cart) {
                if (cart.selectedMenu) {
                    setCartCount(cart.selectedMenu.length);
                }
            }
        }
    }

    const getUnseenNotifications = async () => {
        const token = await AsyncStorage.getItem("token");
        if (token) {
            const userId = jwtDecode(token).sub;
            try {
                const response = await axios.get(
                    `${process.env.EXPO_PUBLIC_SERVER_URL}/notification/getUnseenNotificationCount?userId=${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.status === 200) {
                    setUnseenNotificationCount(response.data);
                }
            } catch (error) {
                const axiosError = error as AxiosError;
                unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount, setUnseenNotificationCount);
            }
        }
    };

    useEffect(() => {
        handleInit();
        getUnseenNotifications();
    }, []);

    const fetchChatById = async (socketData: SocketDataType) => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/chat/getChatById?chatId=${socketData.chat ? socketData.chat.id : 0}&roomId=${socketData.chat && socketData.chat.roomId ? socketData.chat.roomId : 0}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status == 200) {
                const fetchedChat = response.data;
                setChats((prevChats) => {
                    const chatIndex = prevChats.findIndex(
                        (chat) => chat.id === fetchedChat.id
                    );

                    if (chatIndex !== -1) {
                        // If chat is found, replace it at the same index
                        return [
                            ...prevChats.slice(0, chatIndex),
                            fetchedChat,
                            ...prevChats.slice(chatIndex + 1),
                        ];
                    } else {
                        // If chat is not found, add it at index 0

                        setTimeout(() => {
                            if (scrollViewRef.current) {
                                scrollViewRef.current.scrollToEnd({
                                    animated: true,
                                });
                            }
                        }, 400);
                        return [fetchedChat, ...prevChats];
                    }
                });

                const destination = "/user/" + fetchedChat.senderId + "/queue";
                let redirectUrl;
                const role = await AsyncStorage.getItem("role");
                if (role === "RIDER") {
                    redirectUrl = `/order/chat/${socketData.chat && socketData.chat.roomId ? socketData.chat.roomId : 0}`;
                } else {
                    redirectUrl = "/delivery/chat";
                }
                let dataToSend: SocketDataType = {
                    ...socketData,
                    destination: destination,
                    topic: 'seen',
                    redirectUrl: redirectUrl
                };

                await axios.post(
                    `${process.env.EXPO_PUBLIC_SERVER_URL}/chat/socketChat_ReactNative`,
                    dataToSend,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                const { status } = axiosError.response;
                if (status === 401) {
                    unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount, setUnseenNotificationCount);
                }
                if (status === 404) {
                    Toast.show({
                        type: 'error',
                        text1: 'Dissolved Chat Room',
                        text2: 'The chat room is dissolved as the order is delivered.',
                        visibilityTime: 4000
                    })
                    const role = await AsyncStorage.getItem('role')
                    if (role) {
                        if (role === "USER") {
                            router.push("/order/chat");
                        } else {
                            router.push("/delivery");
                        }
                    }
                }
            }
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            const socket = new SockJS(`${process.env.EXPO_PUBLIC_SERVER_URL}/ws`);
            const stompClient = new Client({
                webSocketFactory: () => socket,
            });

            stompClient.onConnect = () => {
                (async () => {
                    const token = await AsyncStorage.getItem("token");
                    if (!token) return;
                    const userId = jwtDecode(token).sub;

                    stompClient.subscribe(
                        `/user/${userId}/queue`,
                        (response) => {
                            const data = JSON.parse(response.body);

                            if (data.title === "Notification") {
                                Toast.show({
                                    type: 'info',
                                    text1: 'New Notification',
                                    text2: data.notification,
                                    visibilityTime: 6000,
                                });
                                setUnseenNotificationCount((prev) => prev + 1);
                            } else if (data.title === "Typing") {
                                setIsTyping(data.typing);

                            } else if (data.title === "Chat") {
                                if (data.redirectUrl !== currentUrlRef.current) {
                                    if (data.topic === "add" || data.topic === "reaction") {
                                        Toast.show({
                                            type: 'info',
                                            text1: 'Chat Update!',
                                            text2: data.notificationMessage,
                                            visibilityTime: 4000,
                                        })
                                    }
                                    if (currentUrlRef.current === "/order/chat" && data.topic === "add") {
                                        setChatUsers((prevChatUsers: ChatUserType[]) => {
                                            const newChat = data.chat;
                                            const existingUserIndex = prevChatUsers.findIndex(
                                                (chatUser) => chatUser.roomId === newChat.roomId
                                            );

                                            if (existingUserIndex !== -1) {
                                                // Room already exists
                                                const updatedChatUser = {
                                                    ...prevChatUsers[existingUserIndex],
                                                    unseenCount:
                                                        prevChatUsers[existingUserIndex].unseenCount + 1,
                                                };
                                                const updatedChatUsers = [
                                                    updatedChatUser,
                                                    ...prevChatUsers.filter(
                                                        (_, index) => index !== existingUserIndex
                                                    ),
                                                ];
                                                return updatedChatUsers;
                                            }
                                        });
                                    }
                                } else {
                                    const topic = data.topic;
                                    if (topic === "add" || topic === "update") {
                                        fetchChatById(data);

                                    } else if (topic === "delete") {
                                        setChats((prevChats) => {
                                            return prevChats.filter(
                                                (chat) => chat.id !== data.chat.id
                                            );
                                        });
                                    } else if (topic === "reaction") {
                                        setChats((prevChats) => {
                                            const chatIndex = prevChats.findIndex(
                                                (chat) => chat.id === data.chat.id
                                            );

                                            if (chatIndex === -1) {
                                                // If chat not found, return the previous state
                                                return prevChats;
                                            }

                                            // Create a new chat object with the updated reaction
                                            const updatedChat = {
                                                ...prevChats[chatIndex],
                                                reaction: data.chat.reaction,
                                            };

                                            // Return the new state with the updated chat
                                            return [
                                                ...prevChats.slice(0, chatIndex),
                                                updatedChat,
                                                ...prevChats.slice(chatIndex + 1),
                                            ];
                                        });
                                    } else if (topic === "seenAll") {
                                        setChats((prevChats) =>
                                            prevChats.map((chat) =>
                                                chat.senderId === userId
                                                    ? { ...chat, isSeen: true }
                                                    : chat
                                            )
                                        );
                                    } else if (topic === "seen") {
                                        setChats((prevChats) => {
                                            return prevChats.map((chat) => {
                                                return chat.id === data.chat.id
                                                    ? { ...chat, isSeen: true }
                                                    : chat;
                                            });
                                        });
                                    }
                                }
                            }
                        }
                    );
                })();
            };

            stompClient.onStompError = (error) => {
                console.log("STOMP error:", error);
            };

            // Activate the client when the screen is focused
            stompClient.activate();

            // Cleanup function to deactivate stompClient on screen blur
            return () => {
                stompClient.deactivate();
            };
        }, [])
    );

    return (
        <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: 'blue', tabBarLabelStyle: { fontWeight: 'bold' } }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: () => <FontAwesome name="home" size={26} color={pathname === "/home" ? 'blue' : 'gray'} />
                }}
            />
            <Tabs.Screen
                name="delivery"
                options={{
                    href: role === 'RIDER' ? '/delivery' : null,
                    title: 'Delivery',
                    tabBarIcon: () => <MaterialIcons name="delivery-dining" size={29} color={pathname.includes("/delivery") ? 'blue' : 'gray'} />
                }}
            />
            <Tabs.Screen
                name="admin"
                options={{
                    href: role === 'ADMIN' ? '/admin' : null,
                    title: 'Dashboard',
                    tabBarIcon: () => <MaterialIcons name="dashboard" size={26} color={pathname.includes("/admin") ? 'blue' : 'gray'} />
                }}
            />
            <Tabs.Screen
                name="order"
                options={{
                    href: role === 'USER' ? '/order' : null,
                    title: 'Order',
                    tabBarIcon: () => <FontAwesome6 size={26} name="first-order-alt" color={pathname.includes("/order") ? 'blue' : 'gray'} />
                }}
            />
            <Tabs.Screen
                name="restaurants"
                options={{
                    href: role === 'USER' ? '/restaurants' : null,
                    title: 'Restaurants',
                    tabBarIcon: () => <MaterialIcons name="local-restaurant" size={26} color={pathname.includes("/restaurants") ? 'blue' : 'gray'} />
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: 'Account',
                    tabBarIcon: () => <MaterialIcons name="manage-accounts" size={26} color={pathname.includes("/account") ? 'blue' : 'gray'} />
                }}
            />
        </Tabs>
    );
}
