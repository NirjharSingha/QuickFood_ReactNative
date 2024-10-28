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

    return (
        <GlobalContext.Provider value={{ menu, setMenu, cartCount, setCartCount, selectedOrder, setSelectedOrder, showOrderDialog, setShowOrderDialog }}>
            {children}
        </GlobalContext.Provider>
    );
}
