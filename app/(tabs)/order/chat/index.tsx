import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'expo-router'
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ChatCardType } from '@/scripts/type';
import ChatCard from '@/components/cards/ChatCard';

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
    const [chatToEdit, setChatToEdit] = useState(null);
    const [iAmTyping, setIAmTyping] = useState(false);
    const [showEmojis, setShowEmojis] = useState(false);
    const lastTypingTimeRef = useRef(0);
    const typingTimeoutRef = useRef(null);
    const inputRef = useRef(null);
    const emojiIconRef = useRef(null);
    const chatScrollRef = useRef(null);
    const [destination, setDestination] = useState("");
    const [mySelf, setMySelf] = useState({});
    const [myTarget, setMyTarget] = useState({});
    const [unseenChatCount, setUnseenChatCount] = useState(-1);
    const fileInputRef = useRef(null);








    const [chats, setChats] = useState<ChatCardType[]>([]);

    const fetchData = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (token === null || token === undefined) {
                router.push("/auth/login");
                return;
            }
            const userId = jwtDecode(token).sub;
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/chat/chatRoomInit?roomId=${6}&userId=${userId}`,
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
            // console.log("Error:", error);
            // if (error.response.status === 401) {
            //     handleUnauthorized(setIsLoggedIn, setToastMessage, router);
            // } else if (error.response.status === 404) {
            //     setToastMessage(
            //         "The chat room is already dissolved as the order is complete"
            //     );
            //     const role = localStorage.getItem("role");
            //     if (role === "USER") {
            //         router.push("/orderFood/chat");
            //     } else {
            //         router.push("/delivery");
            //     }
            // }
        }
    };

    const getAllChats = async (currentPage: number) => {
        try {
            const token = await AsyncStorage.getItem("token");
            setShowLoading(true);
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/chat/getChats?page=${currentPage}&size=${size}&roomId=${6}`,
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
            // console.log("Error:", error);
            // if (error.response.status === 401) {
            //     handleUnauthorized(setIsLoggedIn, setToastMessage, router);
            // } else if (error.response.status === 404) {
            //     setToastMessage(
            //         "The chat room is already dissolved as the order is delivered"
            //     );
            //     const role = localStorage.getItem("role");
            //     if (role === "USER") {
            //         router.push("/orderFood/chat");
            //     } else {
            //         router.push("/delivery");
            //     }
            // }
        }
    };

    useEffect(() => {
        fetchData();
        getAllChats(page);
    }, [page]);

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            {chats.map((chat, index) => (
                <ChatCard key={index} chat={chat} />
            ))}
        </ScrollView>
    )
}

export default index