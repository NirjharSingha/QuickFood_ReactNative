import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { styled } from 'nativewind'
import Chat from '@/assets/images/chat.jpg'
import axios, { AxiosError } from 'axios'
import { jwtDecode } from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import Loading from '@/components/Loading'
import unauthorized from '@/scripts/unauthorized'
import Toast from 'react-native-toast-message'
import { useGlobal } from '@/contexts/Globals'
import { ChatUserType } from '@/scripts/type'
import { useSocket } from '@/contexts/Socket'
import { useFocusEffect } from '@react-navigation/native';

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledImage = styled(Image)
const StyledTouchableOpacity = styled(TouchableOpacity)

const ChatUser: React.FC<{ chatUser: ChatUserType }> = ({ chatUser }) => {
    const width = Dimensions.get('window').width;
    const router = useRouter()

    return (
        <StyledTouchableOpacity className='pr-[1.5px] pb-[1.5px] pt-0 pl-0 my-1 bg-gray-300 rounded-md overflow-hidden' onPress={() => {
            router.push(`/order/chat/${chatUser.roomId}`)
        }}>
            <StyledView className='bg-slate-50 px-[6px] py-1 rounded-md'>
                <StyledView className='flex-row items-center'>
                    <StyledImage source={chatUser.image === null ? require('@/assets/images/user.png') : { uri: `data:image/jpeg;base64,${chatUser.image}` }}
                        alt="logo"
                        className="w-[36px] h-[36px] rounded-full border-2 bg-blue-400 border-solid border-white"
                        resizeMode='cover'
                    />
                    <StyledText numberOfLines={1} ellipsizeMode='middle' className='ml-2 mb-[2px] font-bold mr-2 overflow-hidden' style={{ maxWidth: width - 98 }}>{chatUser.name}</StyledText>
                    {chatUser.unseenCount > 0 &&
                        <StyledView className='rounded-full bg-gray-200 ml-auto w-6 h-6 flex-row justify-center items-center'>
                            <StyledText className='text-gray-800 overflow-hidden' style={{ fontSize: 11 }}>{chatUser.unseenCount}</StyledText>
                        </StyledView>
                    }
                </StyledView>
            </StyledView>
        </StyledTouchableOpacity>
    )
}

const index = () => {
    const router = useRouter()
    const { setCartCount } = useGlobal()
    const { setUnseenNotificationCount } = useGlobal();
    const [showLoading, setShowLoading] = useState(true);
    const { chatUsers, setChatUsers } = useSocket()

    const getChatUsers = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                router.push("/auth/login");
                return;
            }
            const userId = jwtDecode(token).sub;
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/chat/getChatUsers?userId=${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status == 200) {
                setShowLoading(false);
                setChatUsers(response.data);
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount, setUnseenNotificationCount);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getChatUsers();
        }, [])
    );

    return (
        <View>
            {showLoading && <Loading />}
            {!showLoading && (
                <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
                    <StyledView className=" bg-[#374151] px-3 py-2">
                        <StyledView className="flex-row items-center mb-2">
                            <StyledView className="rounded-full mr-[6px] border-[1px] border-solid border-white p-1 bg-yellow-50">
                                <Image source={Chat} style={{ width: 27, height: 27, borderRadius: 10 }} />
                            </StyledView>
                            <StyledText className="text-lg text-white font-bold">
                                Chat Rooms
                            </StyledText>
                        </StyledView>
                        <StyledView className='flex-row'>
                            <StyledView className='w-[8px] h-[8px] rounded-full bg-white mr-1 mt-[5.5px]' />
                            <StyledText className='text-white' style={{ fontSize: 13 }}>When you place an order, you will be connected in a chat room with your rider.</StyledText>
                        </StyledView>
                        <StyledView className='flex-row'>
                            <StyledView className='w-[8px] h-[8px] rounded-full bg-white mr-1 mt-[5.5px]' />
                            <StyledText className='text-white' style={{ fontSize: 13 }}>As soon as the delivery is completed, the chat room will be dissolved.</StyledText>
                        </StyledView>
                    </StyledView>
                    <StyledView className='p-[6px]'>
                        {chatUsers.map((chatUser: ChatUserType) => (
                            <ChatUser key={chatUser.userId} chatUser={chatUser} />
                        ))}
                    </StyledView>
                </ScrollView>
            )}
        </View>
    )
}

export default index