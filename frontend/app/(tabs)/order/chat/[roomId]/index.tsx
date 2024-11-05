import { ChatRoom } from "@/components/ChatRoom";
import { useLocalSearchParams } from "expo-router";

const index = () => {
    const { roomId } = useLocalSearchParams() as { roomId?: number };

    return (
        <ChatRoom roomId={roomId as number} />
    )
}

export default index