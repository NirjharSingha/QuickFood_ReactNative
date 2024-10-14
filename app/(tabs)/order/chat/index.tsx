import { View, Text, ScrollView, Dimensions, Button, Image, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native'
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
import { styled } from 'nativewind';
import { Loading2 } from '@/components/Loading';
import ChatInput from '@/components/input/ChatInput';

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledImage = styled(Image)

const index = () => {
    const router = useRouter();
    const height = Dimensions.get('window').height;
    const [showLoading, setShowLoading] = useState(true);
    const [sendRequest, setSendRequest] = useState(true);
    const [inputValue, setInputValue] = useState("");
    const [childInput, setChildInput] = useState("");
    const [chatAttachments, setChatAttachments] = useState([]);
    const [previewFiles, setPreviewFiles] = useState([]);
    const [iAmTyping, setIAmTyping] = useState(false);
    const [showEmojis, setShowEmojis] = useState(false);
    const [destination, setDestination] = useState("");
    const [myTarget, setMyTarget] = useState<{ id: number, name: string, image: string } | null>(null);
    const [unseenChatCount, setUnseenChatCount] = useState(-1);








    const [page, setPage] = useState(0);
    const [chats, setChats] = useState<ChatCardType[]>([]);
    const [chatToReact, setChatToReact] = useState(0);
    const [chatToEdit, setChatToEdit] = useState(0);
    const [selectedChat, setSelectedChat] = useState(0);
    const { setCartCount } = useGlobal();
    const scrollViewRef = useRef<ScrollView>(null);
    // const { roomId } = useLocalSearchParams() as { roomId?: number };
    const [prevScrollHeight, setPrevScrollHeight] = useState(0);
    const roomId = 6
    const size = 7;
    const [isMounted, setIsMounted] = useState(false);

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

    const handleScroll = (event: any) => {
        const currentScrollTop = event.nativeEvent.contentOffset.y;
        // Check if we are at the bottom (in the reversed layout, bottom means scrolling up)
        if (currentScrollTop <= 3) {
            // Trigger pagination or load more items when scrolled to the bottom in reversed layout
            setPage((prev: number) => prev + 1);
        }
    };


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
                const { secondUser, unseenCount } = response.data;
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
    }, []);

    useEffect(() => {
        if (sendRequest) {
            if (chats.length === 0) {
                let pageNum = Math.ceil(unseenChatCount / size) - 1;
                pageNum = Math.max(pageNum, 0);
                for (let i = 0; i <= pageNum; i++) {
                    getAllChats(i);
                }
            } else {
                getAllChats(page);
            }
        }
    }, [page]);

    const prevReaction = chatToReact !== 0 ? (() => {
        const chat = chats.find(chat => chat.id === chatToReact);
        return chat ? chat.reaction : null;
    })() : null;

    useEffect(() => {
        if (!showLoading && !isMounted) {
            setIsMounted(true);
            setTimeout(() => {
                if (scrollViewRef.current) {
                    scrollViewRef.current.scrollToEnd({
                        animated: true,
                    });
                }
            }, 500);
        }
    }, [showLoading]);

    return (
        <KeyboardAvoidingView style={{}} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 190 : 130}>
            <StyledView className="h-[47px] bg-gray-700 py-[6px] px-3 flex-row items-center w-full">
                <StyledImage source={myTarget?.image === null ? require('@/assets/images/user.png') : { uri: `data:image/jpeg;base64,${myTarget?.image}` }}
                    alt="logo"
                    className="w-[35px] h-[35px] rounded-full border-[1px] bg-white border-solid border-white"
                    resizeMode='cover'
                />
                <StyledText numberOfLines={1} ellipsizeMode='middle' className="ml-2 mb-[2px] text-white font-bold" style={{ fontSize: 17 }}>{myTarget?.name}</StyledText>
            </StyledView>
            <ScrollView style={{ width: '100%', paddingVertical: 12, height: height - 187 }} ref={scrollViewRef} showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={5} contentContainerStyle={{ flexDirection: 'column-reverse' }}>
                {chats.length > 0 && chats.map((chat, index) => (
                    <View key={index} style={{ marginBottom: 10 }}>
                        <ChatCard chat={chat} setChatToReact={setChatToReact} setSelectedChat={setSelectedChat} />
                        {index === 0 && <View style={{ marginBottom: 10 }} />}
                    </View>
                ))}
                {showLoading && <Loading2 />}
            </ScrollView>
            <ChatInput />
            <Likes visible={chatToReact !== 0} setChatToReact={setChatToReact} prevReaction={prevReaction} handleReaction={handleReaction} />
            <ChatOptions visible={selectedChat !== 0} setSelectedChat={setSelectedChat} handleDelete={handleDelete} handleEdit={handleEdit} />
        </KeyboardAvoidingView>
    )
}

export default index