import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import { ChatCardType } from '@/scripts/type';
import ChatCard from '@/components/cards/ChatCard';
import { Likes } from '@/components/Dialogs/LikesDialog';
import unauthorized from '@/scripts/unauthorized';
import { useGlobal } from '@/contexts/Globals';
import Toast from 'react-native-toast-message';
import { ChatOptions } from '@/components/Dialogs/ChatOptions';

const index = () => {
    const router = useRouter();
    const [page, setPage] = useState(0);
    const size = 12;
    const [showLoading, setShowLoading] = useState(false);
    const [sendRequest, setSendRequest] = useState(true);
    const [inputValue, setInputValue] = useState("");
    const [childInput, setChildInput] = useState("");
    const [chatAttachments, setChatAttachments] = useState([]);
    const [previewFiles, setPreviewFiles] = useState([]);
    const [iAmTyping, setIAmTyping] = useState(false);
    const [showEmojis, setShowEmojis] = useState(false);
    const [destination, setDestination] = useState("");
    const [mySelf, setMySelf] = useState({});
    const [myTarget, setMyTarget] = useState({});
    const [unseenChatCount, setUnseenChatCount] = useState(-1);









    const [chats, setChats] = useState<ChatCardType[]>([]);
    const [chatToReact, setChatToReact] = useState(0);
    const [chatToEdit, setChatToEdit] = useState(0);
    const [selectedChat, setSelectedChat] = useState(0);
    const { setCartCount } = useGlobal();
    // const { roomId } = useLocalSearchParams() as { roomId?: number };
    const roomId = 6

    const handleError = async (error: any) => {
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

    const fetchData = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (token === null || token === undefined) {
                router.push("/auth/login");
                return;
            }
            const userId = jwtDecode(token).sub;
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/chat/chatRoomInit?roomId=${roomId}&userId=${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status == 200) {
                const { firstUser, secondUser, unseenCount } = response.data;
                setMySelf(firstUser);
                setMyTarget(secondUser);
                setDestination(secondUser.id);
                setUnseenChatCount(unseenCount);
            }
        } catch (error) {
            handleError(error)
        }
    };

    const getAllChats = async (currentPage: number) => {
        try {
            const token = await AsyncStorage.getItem("token");
            setShowLoading(true);
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/chat/getChats?page=${currentPage}&size=${size}&roomId=${roomId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status == 200) {
                setShowLoading(false);
                if (page === 0) {
                    setChats(response.data);
                    const chats: ChatCardType[] = response.data;
                    chats[0].files.map((file) => {
                        console.log(file.fileType);
                    });
                } else {
                    const responseData = response.data;
                    setChats((prev) => {
                        // Merge the previous state with the new data
                        const mergedData = [...prev, ...responseData];
                        // Sort the merged data by id
                        const sortedData = mergedData.sort((a, b) => b.id - a.id);
                        // Remove duplicates by iterating through the sorted array
                        const uniqueData = sortedData.filter(
                            (item, index, array) =>
                                index === 0 || item.id !== array[index - 1].id
                        );
                        return uniqueData;
                    });
                }
                if (response.data.length < size) {
                    setSendRequest(false);
                }
            }
        } catch (error) {
            handleError(error)
        }
    };

    const handleReaction = async (reaction: string) => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.put(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/chat/reaction?chatId=${chatToReact}&roomId=${roomId}&reaction=${reaction}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                setChats((prev: ChatCardType[]) =>
                    prev.map(chat =>
                        chat.id === chatToReact ? { ...chat, reaction: reaction === chat.reaction ? null : reaction } : chat
                    )
                );
                setChatToReact(0);
            }
        } catch (error) {
            handleError(error)
        }
    };

    const handleDelete = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.delete(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/chat/deleteChatById?chatId=${selectedChat}&roomId=${roomId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                setChats((prevChats) => prevChats.filter((chat) => chat.id !== selectedChat));
                setSelectedChat(0);
            }
        } catch (error) {
            handleError(error)
        }
    };

    const handleEdit = () => {
        setSelectedChat((chatId) => {
            setChatToEdit(chatId);
            return 0
        })
    }

    useEffect(() => {
        fetchData();
        getAllChats(page);
    }, [page]);

    useEffect(() => {
        console.log('chatToEdit ', chatToEdit);
    }, [chatToEdit])

    const prevReaction = chatToReact !== 0 ? (() => {
        const chat = chats.find(chat => chat.id === chatToReact);
        return chat ? chat.reaction : null;
    })() : null;

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            {chats.map((chat, index) => (
                <ChatCard key={index} chat={chat} setChatToReact={setChatToReact} setSelectedChat={setSelectedChat} />
            ))}
            <Likes visible={chatToReact !== 0} setChatToReact={setChatToReact} prevReaction={prevReaction} handleReaction={handleReaction} />
            <ChatOptions visible={selectedChat !== 0} setSelectedChat={setSelectedChat} handleDelete={handleDelete} handleEdit={handleEdit} />
        </ScrollView>
    )
}

export default index