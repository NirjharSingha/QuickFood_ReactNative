import { ChatCardType, ChatUserType } from "@/scripts/type";
import React, { useState, createContext, useContext, useRef } from "react";
import { ScrollView } from "react-native";

type SocketContextType = {
    isTyping: boolean;
    setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
    chatUsers: ChatUserType[];
    setChatUsers: any;
    chats: ChatCardType[];
    setChats: React.Dispatch<React.SetStateAction<ChatCardType[]>>;
    currentUrl: any;
    setCurrentUrl: React.Dispatch<React.SetStateAction<any>>;
    scrollViewRef: React.RefObject<ScrollView>;
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
    const [isTyping, setIsTyping] = useState(false);
    const [chatUsers, setChatUsers] = useState<ChatUserType[]>([])
    const [chats, setChats] = useState<ChatCardType[]>([]);
    const [currentUrl, setCurrentUrl] = useState('/');
    const scrollViewRef = useRef<ScrollView>(null);

    return (
        <SocketContext.Provider value={{ currentUrl, setCurrentUrl, isTyping, setIsTyping, chatUsers, setChatUsers, chats, setChats, scrollViewRef }}>
            {children}
        </SocketContext.Provider>
    );
}
