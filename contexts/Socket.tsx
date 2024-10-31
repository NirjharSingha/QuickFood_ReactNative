import { ChatCardType } from "@/scripts/type";
import React, { useState, createContext, useContext } from "react";

type SocketContextType = {
    stompClient: any;
    setStompClient: React.Dispatch<React.SetStateAction<any>>;
    isTyping: boolean;
    setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
    chats: ChatCardType[];
    setChats: React.Dispatch<React.SetStateAction<ChatCardType[]>>;
};

type SocketContextProviderProps = {
    children: React.ReactNode;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function useSocket() {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a GlobalContextProvider");
    }
    return context;
}

export default function SocketContextProvider({
    children,
}: SocketContextProviderProps) {
    const [stompClient, setStompClient] = useState<any>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [chats, setChats] = useState<ChatCardType[]>([]);

    return (
        <SocketContext.Provider value={{ stompClient, setStompClient, isTyping, setIsTyping, chats, setChats }}>
            {children}
        </SocketContext.Provider>
    );
}