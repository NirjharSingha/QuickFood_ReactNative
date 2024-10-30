import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

const validRoles = ['USER', 'RIDER', 'ADMIN', ''] as const;
type Role = typeof validRoles[number];

export default function TabLayout() {
    const [role, setRole] = useState<Role>('');
    const pathname = usePathname();
    const { setCartCount } = useGlobal();
    const { setIsTyping, setStompClient, setChats } = useSocket();
    const router = useRouter();

    useEffect(() => {
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
        handleInit();
    }, []);

    const fetchChatById = async (chatId: number, roomId: number, stompClient: any, dataChat: any) => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/chat/getChatById?chatId=${chatId}&roomId=${roomId}`,
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
                        return [fetchedChat, ...prevChats];
                    }
                });

                const destination = "/user/" + fetchedChat.senderId + "/queue";
                let redirectUrl;
                const role = localStorage.getItem("role");
                if (role === "RIDER") {
                    redirectUrl = `/orderFood/chat/${dataChat.roomId}`;
                } else {
                    redirectUrl = "/delivery/chat";
                }
                let dataToSend = {
                    title: "Chat",
                    topic: "seen",
                    chat: dataChat,
                    redirectUrl: redirectUrl,
                };
                stompClient.send(destination, {}, JSON.stringify(dataToSend));
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                const { status } = axiosError.response;
                if (status === 401) {
                    unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount);
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

    useEffect(() => {
        const socket = new SockJS(`${process.env.EXPO_PUBLIC_SERVER_URL}/ws`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
        });

        stompClient.onConnect = () => {
            (async () => {
                setStompClient(stompClient);
                const token = await AsyncStorage.getItem("token");
                if (!token) return;
                const userId = jwtDecode(token).sub;

                stompClient.subscribe(
                    "/user/" + userId + "/queue",
                    function (response) {
                        const data = JSON.parse(response.body);
                        console.log("Received message:", data);
                    }
                );
            })();

        }

        stompClient.onStompError = function (error) {
            console.log("STOMP error:", error);
        };

        // Activate the client
        stompClient.activate();

        // Cleanup on component unmount
        return () => {
            stompClient.deactivate();
        };
    }, []);

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
                name="dashboard"
                options={{
                    href: role === 'ADMIN' ? '/dashboard' : null,
                    title: 'Dashboard',
                    tabBarIcon: () => <MaterialIcons name="dashboard" size={26} color={pathname.includes("/dashboard") ? 'blue' : 'gray'} />
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
