import { View, Text, ScrollView, Dimensions, Image, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'expo-router'
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import { ChatCardType, ChatFileType, SocketDataType } from '@/scripts/type';
import ChatCard from '@/components/cards/ChatCard';
import { Likes } from '@/components/Dialogs/LikesDialog';
import unauthorized from '@/scripts/unauthorized';
import { useGlobal } from '@/contexts/Globals';
import Toast from 'react-native-toast-message';
import { ChatOptions } from '@/components/Dialogs/ChatOptions';
import { styled } from 'nativewind';
import { Loading2 } from '@/components/Loading';
import ChatInput from '@/components/input/ChatInput';
import ChatFiles from '@/components/ChatFiles';
import * as ImagePicker from 'expo-image-picker';
import { useSocket } from '@/contexts/Socket';
import LottieView from 'lottie-react-native';

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledImage = styled(Image)

export const ChatRoom: React.FC<{ roomId: number }> = ({ roomId }) => {
    const router = useRouter();
    const height = Dimensions.get('window').height;
    const { chats, setChats, isTyping, scrollViewRef } = useSocket();
    const { setCartCount } = useGlobal();
    const { setUnseenNotificationCount } = useGlobal();
    const size = 15;
    const [myName, setMyName] = useState('');
    const [showLoading, setShowLoading] = useState(true);
    const [sendRequest, setSendRequest] = useState(true);
    const [inputValue, setInputValue] = useState("");
    const [chatAttachments, setChatAttachments] = useState<ChatFileType[]>([]);
    const [destination, setDestination] = useState("");
    const [myTarget, setMyTarget] = useState<{ id: number, name: string, image: string } | null>(null);
    const [unseenChatCount, setUnseenChatCount] = useState(-1);
    const [page, setPage] = useState(0);
    const [chatToReact, setChatToReact] = useState(0);
    const [chatToEdit, setChatToEdit] = useState<ChatCardType | null>(null);
    const [selectedChat, setSelectedChat] = useState<ChatCardType | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    const [iAmTyping, setIAmTyping] = useState(false);
    const lastTypingTimeRef = useRef(0);
    const typingTimeoutRef = useRef<any>(null);

    const handleError = async (error: any) => {
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

    const sendSocketMessage = async (topic: string, chat: { id: number, roomId?: number, reaction?: string } | null, typing: boolean | null) => {
        let notificationMessage = "";
        let redirectUrl;
        if (topic === "add") {
            notificationMessage = `${myName} sent you a new message`;
        } else if (topic === "reaction") {
            notificationMessage = `${myName} reacted to your message`;
        }
        const role = await AsyncStorage.getItem("role");
        if (role === "USER") {
            redirectUrl = "/delivery/chat";
        } else {
            redirectUrl = `/order/chat/${roomId}`;
        }

        let dataToSend: SocketDataType = {
            title: topic === 'Typing' ? 'Typing' : "Chat",
            topic: topic,
            destination: "/user/" + destination + "/queue",
            notificationMessage: notificationMessage,
            redirectUrl: redirectUrl,
            chat: chat,
            typing: typing
        };

        try {
            const token = await AsyncStorage.getItem("token");
            await axios.post(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/chat/socketChat_ReactNative`,
                dataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (error) {
            handleError(error)
        }
    }

    useEffect(() => {
        if (iAmTyping) {
            sendSocketMessage('Typing', null, true)
        } else {
            sendSocketMessage('Typing', null, false)
        }
    }, [iAmTyping]);

    useEffect(() => {
        const timerLength = 5000;

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            const timeNow = new Date().getTime();
            const timeDiff = timeNow - lastTypingTimeRef.current;
            if (timeDiff >= timerLength && iAmTyping) {
                setIAmTyping(false);
            }
        }, timerLength);

        return () => {
            clearTimeout(typingTimeoutRef.current);
        };
    }, [lastTypingTimeRef.current, iAmTyping]);

    const handleInputChange = () => {
        setIAmTyping(true);
        lastTypingTimeRef.current = new Date().getTime();
    };

    useEffect(() => {
        if (destination !== '') {
            sendSocketMessage("seenAll", null, null);
        }
    }, [destination])

    const handleScroll = (event: any) => {
        const currentScrollTop = event.nativeEvent.contentOffset.y;
        // Check if we are at the bottom (in the reversed layout, bottom means scrolling up)
        if (currentScrollTop <= 3) {
            // Trigger pagination or load more items when scrolled to the bottom in reversed layout
            setPage((prev: number) => prev + 1);
        }
    };

    const fetchData = async () => {
        setChats([]);
        setPage(0);
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
                setMyTarget(secondUser);
                setDestination(secondUser.id);
                setUnseenChatCount(unseenCount);
                setMyName(firstUser.name);
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
                sendSocketMessage("reaction", { id: chatToReact, reaction: reaction }, null);
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
                `${process.env.EXPO_PUBLIC_SERVER_URL}/chat/deleteChatById?chatId=${selectedChat?.id}&roomId=${roomId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                setChats((prevChats) => prevChats.filter((chat) => chat.id !== selectedChat?.id));
                sendSocketMessage("delete", { id: selectedChat ? selectedChat.id : 0 }, null);
                setSelectedChat(null);
            }
        } catch (error) {
            handleError(error)
        }
    };

    const handleEdit = (chat: ChatCardType) => {
        setChatToEdit(chat);
        setSelectedChat(null);
    }

    useEffect(() => {
        if (roomId >= 0) {
            fetchData();
        }
    }, [roomId]);

    useEffect(() => {
        if (sendRequest && roomId >= 0) {
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
    }, [page, roomId]);

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

    const uploadFiles = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 1,
            allowsMultipleSelection: true
        });

        if (!result.canceled) {
            const selectedFiles = result.assets.map(asset => ({
                id: -1,
                data: asset.uri,
                fileType: asset.type ? asset.type : '',
            }));

            setChatAttachments((prev) => [...prev, ...selectedFiles]);
        }
    };

    const handleSubmit = async (messageToSend: string) => {
        const formData = new FormData();

        formData.append("message", messageToSend);
        chatAttachments.forEach((chatAttachment) => {
            if (chatAttachment.id === -1) {
                formData.append("chatAttachments", {
                    uri: chatAttachment.data,
                    name: chatAttachment.fileType.includes('image') ? `image.jpeg` : 'video.mp4',
                    type: chatAttachment.fileType.includes('image') ? 'image/jpeg' : 'video/mp4'
                } as any);
            }
        })
        formData.append("roomId", roomId ? roomId.toString() : '');

        const token = await AsyncStorage.getItem("token");
        if (token === null || token === undefined) {
            router.push("/auth/login");
            return;
        }

        if (chatToEdit === null) {
            const senderId = jwtDecode(token).sub;
            if (senderId === undefined) {
                return;
            }
            formData.append("senderId", senderId.toString());
            formData.append("receiverId", destination);
        } else {
            formData.append("id", chatToEdit.id.toString());
            chatAttachments.forEach((file: any) => {
                if (file.id !== -1) {
                    formData.append("prevFiles", file.id);
                }
            });
        }

        try {
            let response: any;
            if (chatToEdit === null) {
                response = await axios.post(
                    `${process.env.EXPO_PUBLIC_SERVER_URL}/chat/addChat`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                            Accept: 'application/json',
                        },
                    }
                );
            } else {
                response = await axios.put(
                    `${process.env.EXPO_PUBLIC_SERVER_URL}/chat/updateChat`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                            Accept: 'application/json',
                        },
                    }
                );
            }
            if (response.status === 200) {
                setChatAttachments([]);
                setInputValue("");
                sendSocketMessage('Typing', null, false)

                if (chatToEdit === null) {
                    const newChat: ChatCardType = response.data;
                    setChats((prev) => {
                        return [newChat, ...prev];
                    });

                    setTimeout(() => {
                        if (scrollViewRef.current) {
                            scrollViewRef.current.scrollToEnd({
                                animated: true,
                            });
                        }
                    }, 300);

                    sendSocketMessage("add", { id: newChat.id, roomId: newChat.roomId }, null);
                } else {
                    const updatedChat: ChatCardType = response.data;
                    setChats((prev) => {
                        return prev.map((chat) =>
                            chat.id === updatedChat.id ? updatedChat : chat
                        );
                    });
                    setChatToEdit(null);
                    Toast.show({
                        type: 'success',
                        text1: 'Chat Edited',
                        text2: 'The chat has been successfully edited',
                        visibilityTime: 4000
                    })

                    sendSocketMessage("update", { id: updatedChat.id, roomId: updatedChat.roomId }, null);
                }
            }
        } catch (error) {
            handleError(error)
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 190 : 130}>
            <StyledView className="h-[47px] bg-gray-700 py-[6px] px-3 flex-row items-center w-full">
                <StyledImage source={myTarget?.image === null ? require('@/assets/images/user.png') : { uri: `data:image/jpeg;base64,${myTarget?.image}` }}
                    alt="logo"
                    className="w-[35px] h-[35px] rounded-full border-[1px] bg-white border-solid border-white"
                    resizeMode='cover'
                />
                <StyledText numberOfLines={1} ellipsizeMode='middle' className="ml-2 mb-[2px] text-white font-bold" style={{ fontSize: 17 }}>{myTarget?.name}</StyledText>
            </StyledView>
            <ScrollView style={{ width: '100%', paddingVertical: 12, height: isTyping ? height - 213 : height - 187 }} ref={scrollViewRef} showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={5} contentContainerStyle={{ flexDirection: 'column-reverse' }}>
                {chats.length > 0 && chats.map((chat, index) => (
                    <View key={chat.id} style={{ marginBottom: 10 }}>
                        <ChatCard chat={chat} setChatToReact={setChatToReact} setSelectedChat={setSelectedChat} />
                        {index === 0 && <View style={{ marginBottom: 10 }} />}
                    </View>
                ))}
                {showLoading && <Loading2 />}
            </ScrollView>
            {isTyping &&
                <LottieView
                    source={require('@/assets/animations/typing.json')}
                    autoPlay
                    style={{
                        width: 45,
                        height: 19.5,
                        marginLeft: 9,
                        marginTop: 3,
                        marginBottom: 3
                    }}
                />
            }
            <ChatInput inputValue={inputValue} setInputValue={setInputValue} uploadFiles={uploadFiles} handleSubmit={handleSubmit} handleInputChange={handleInputChange} />
            <Likes visible={chatToReact !== 0} setChatToReact={setChatToReact} prevReaction={prevReaction} handleReaction={handleReaction} />
            <ChatOptions visible={selectedChat !== null} selectedChat={selectedChat} setSelectedChat={setSelectedChat} handleDelete={handleDelete} handleEdit={handleEdit} />
            {(chatAttachments.length > 0 || chatToEdit !== null) && <ChatFiles chatAttachments={chatAttachments} setChatAttachments={setChatAttachments} chatToEdit={chatToEdit} setChatToEdit={setChatToEdit} inputValue={inputValue} setInputValue={setInputValue} uploadFiles={uploadFiles} handleSubmit={handleSubmit} handleInputChange={handleInputChange} />}
        </KeyboardAvoidingView>
    )
}