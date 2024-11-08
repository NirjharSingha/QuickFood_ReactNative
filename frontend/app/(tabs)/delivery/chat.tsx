import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ChatRoom } from '@/components/ChatRoom';
import { useSocket } from '@/contexts/Socket';

const chat = () => {
    const [roomId, setRoomId] = useState(-1);
    const { setCurrentUrl } = useSocket();

    const roomInit = async () => {
        const orderToDeliver = await AsyncStorage.getItem('orderToDeliver')
        if (orderToDeliver) {
            setRoomId(parseInt(orderToDeliver))
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            roomInit();

            setTimeout(() => {
                setCurrentUrl(`/delivery/chat`)
            }, 1000);;

            return () => {
                setCurrentUrl('/')
            };
        }, [])
    );

    return (
        <ChatRoom roomId={roomId} />
    )
}

export default chat