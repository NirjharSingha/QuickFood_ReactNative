import React, { useState, createContext, useContext } from "react";
import { MenuType } from "@/scripts/type";

type GlobalContextType = {
    menu: MenuType[];
    setMenu: React.Dispatch<React.SetStateAction<MenuType[]>>;
    cartCount: number;
    setCartCount: React.Dispatch<React.SetStateAction<number>>;
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

export default function MenuContextProvider({
    children,
}: GlobalContextProviderProps) {
    const [menu, setMenu] = useState<MenuType[]>([]);
    const [cartCount, setCartCount] = useState(0);

    return (
        <GlobalContext.Provider value={{ menu, setMenu, cartCount, setCartCount }}>
            {children}
        </GlobalContext.Provider>
    );
}
