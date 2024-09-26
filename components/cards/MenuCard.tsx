import { View, Text, Image, Pressable, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import axios, { AxiosError } from 'axios'
import unauthorized from '@/scripts/unauthorized'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AntDesign from '@expo/vector-icons/AntDesign';
import { styled } from 'nativewind'
import { FontAwesome6 } from '@expo/vector-icons'
import { MenuType } from '@/scripts/type'
import { usePathname } from 'expo-router'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledImage = styled(Image)
const StyledPressable = styled(Pressable)

interface MenuCardProps {
    menu: MenuType;
    setShowMenuDialog?: (value: boolean) => void;
    setMenuToEdit?: (menu: MenuType) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ menu, setShowMenuDialog, setMenuToEdit }) => {
    const router = useRouter();
    const [rating, setRating] = useState('');
    const [flag, setFlag] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const getRating = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                const response = await axios.get(
                    `${process.env.EXPO_PUBLIC_SERVER_URL}/review/menuRating?menuId=${menu.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.status === 200) {
                    setFlag(true);
                    const stringData: string = String(response.data);
                    setRating(stringData);
                }
            } catch (error) {
                const axiosError = error as AxiosError;
                unauthorized(axiosError, Toast, AsyncStorage, router);
            }
        };
        getRating();
    }, []);

    return (
        <StyledPressable
            className={`w-full max-w-[280px] mx-auto rounded-lg shadow-md bg-base-100 border-2 border-gray-200 bg-white pb-[14px] mb-3`}>
            <StyledImage
                source={menu.image ? { uri: `data:image/jpeg;base64,${menu.image}` } : require("@/assets/images/Menu.jpg")}
                alt="logo"
                className="bg-red-100 w-full h-[170px] rounded-tl-lg rounded-tr-lg border-b-2 border-b-gray-200"
            />
            <StyledText className="font-bold text-gray-700 mt-2 pl-3 pr-3" style={{ fontSize: 18 }}>
                {menu.name}
            </StyledText>
            <StyledText className="text-gray-600 mt-[2px] pl-3 pr-3" style={{ fontSize: 14 }}>
                Category :{" "}
                {menu.category
                    ? menu.category === "NON_VEG"
                        ? "NON-VEG"
                        : menu.category
                    : "Category Not Available"}
            </StyledText>
            {!pathname.includes("/order") &&
                <StyledText className="text-gray-600 mt-[2px] pl-3 pr-3" style={{ fontSize: 14 }}>
                    Quantity :{" "}
                    {menu.quantity > 0 ? menu.quantity : "Not Available"}
                </StyledText>
            }
            <StyledText className="text-gray-600 mt-[2px] pl-3 pr-3" style={{ fontSize: 14 }}>
                Price : {`${menu.price} Tk`}
            </StyledText>
            <StyledView className={`flex-row items-center justify-between p-3 pb-0 ${pathname.includes('/order') ? 'mt-[2px]' : ''}`}>
                {!pathname.includes("/order") &&
                    <TouchableOpacity onPress={() => {
                        setMenuToEdit && setMenuToEdit(menu);
                        setShowMenuDialog && setShowMenuDialog(true);
                    }}>
                        <FontAwesome6 name="pen" size={18} color="#2CA4D4" />
                    </TouchableOpacity>
                }
                {pathname.includes("/order") &&
                    <StyledView className="mt-2 flex-row gap-1 justify-center items-center font-bold text-white bg-green-700 rounded-[4.5px] px-2 pb-1">
                        <AntDesign name="star" size={15} color="white" />
                        <StyledText className='font-bold text-white' style={{ fontSize: 13 }}>{parseFloat(rating).toFixed(2)}</StyledText>
                    </StyledView>
                }
                {flag === true &&
                    <View>
                        {rating === '' && <StyledText className='mt-2 flex-row gap-1 justify-center items-center font-bold text-white bg-green-700 ml-auto rounded-[4.5px] px-2 py-1' style={{ fontSize: 12 }}>No Rating</StyledText>}
                        {rating !== '' &&
                            <StyledView className="mt-2 flex-row gap-1 justify-center items-center font-bold text-white bg-green-700 ml-auto rounded-[4.5px] px-2 pb-1">
                                <StyledText className='font-bold text-white' style={{ fontSize: 13 }}>{parseFloat(rating).toFixed(2)}</StyledText>
                                <AntDesign name="star" size={15} color="white" />
                            </StyledView>
                        }
                    </View>
                }
            </StyledView>
        </StyledPressable>
    );
};