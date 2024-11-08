import { ChatRoom } from "@/components/ChatRoom";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { useSocket } from "@/contexts/Socket";

const index = () => {
    const { roomId } = useLocalSearchParams() as { roomId?: number };
    const { setCurrentUrl } = useSocket()

    useFocusEffect(
        React.useCallback(() => {
            setTimeout(() => {
                setCurrentUrl(`/order/chat/${roomId}`)
            }, 1000);;

            return () => {
                setCurrentUrl('/')
            };
        }, [])
    );

    return (
        <ChatRoom roomId={roomId as number} />
    )
}

export default index