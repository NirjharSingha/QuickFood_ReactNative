import { View, Text } from 'react-native'
import React, { useRef, useState } from 'react'
import { useRouter } from 'expo-router'
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const index = () => {
    const router = useRouter();
    const [page, setPage] = useState(-1);
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

    const fetchData = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (token === null || token === undefined) {
                router.push("/auth/login");
                return;
            }
            const userId = jwtDecode(token).sub;
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/chat/chatRoomInit?roomId=${1}&userId=${userId}`,
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

    return (
        <View>
            <Text>index</Text>
        </View>
    )
}

export default index