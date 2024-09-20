import React, { useState, createContext, useContext } from "react";
import { MenuType } from "@/scripts/type";

type MenuContextType = {
    menu: MenuType[];
    setMenu: React.Dispatch<React.SetStateAction<MenuType[]>>;
};

type MenuContextProviderProps = {
    children: React.ReactNode;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function useMenu() {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error("useMenu must be used within a MenuContextProvider");
    }
    return context;
}

export default function MenuContextProvider({
    children,
}: MenuContextProviderProps) {
    const [menu, setMenu] = useState<MenuType[]>([]);

    return (
        <MenuContext.Provider value={{ menu, setMenu }}>
            {children}
        </MenuContext.Provider>
    );
}
