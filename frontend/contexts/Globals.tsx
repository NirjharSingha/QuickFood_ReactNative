import React, { useState, createContext, useContext } from "react";
import { MenuType } from "@/scripts/type";

type GlobalContextType = {
    menu: MenuType[];
    setMenu: React.Dispatch<React.SetStateAction<MenuType[]>>;
    cartCount: number;
    setCartCount: React.Dispatch<React.SetStateAction<number>>;
    selectedOrder: number;
    setSelectedOrder: React.Dispatch<React.SetStateAction<number>>;
    showOrderDialog: boolean;
    setShowOrderDialog: React.Dispatch<React.SetStateAction<boolean>>;
    unseenNotificationCount: number;
    setUnseenNotificationCount: React.Dispatch<React.SetStateAction<number>>;
};

type GlobalContextProviderProps = {
    children: React.ReactNode;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function useGlobal() {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobal must be used within a GlobalContextProvider");
    }
    return context;
}

export default function GlobalContextProvider({
    children,
}: GlobalContextProviderProps) {
    const [menu, setMenu] = useState<MenuType[]>([]);
    const [cartCount, setCartCount] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState(0);
    const [showOrderDialog, setShowOrderDialog] = useState(false);
    const [unseenNotificationCount, setUnseenNotificationCount] = useState(0);

    return (
        <GlobalContext.Provider value={{ menu, setMenu, cartCount, setCartCount, selectedOrder, setSelectedOrder, showOrderDialog, setShowOrderDialog, unseenNotificationCount, setUnseenNotificationCount }}>
            {children}
        </GlobalContext.Provider>
    );
}
