import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ChatRoom } from '@/components/ChatRoom';

const chat = () => {
    const [roomId, setRoomId] = useState(-1);

    const roomInit = async () => {
        const orderToDeliver = await AsyncStorage.getItem('orderToDeliver')
        if (orderToDeliver) {
            setRoomId(parseInt(orderToDeliver))
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            roomInit();
        }, [])
    );

    return (
        <ChatRoom roomId={roomId} />
    )
}

export default chat