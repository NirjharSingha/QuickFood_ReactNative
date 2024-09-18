import { View, Text, Image, Pressable, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import axios, { AxiosError } from 'axios'
import unauthorized from '@/scripts/unauthorized'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AntDesign from '@expo/vector-icons/AntDesign';
import { styled } from 'nativewind'
import { ScrollView } from 'react-native-gesture-handler'
import { FontAwesome6 } from '@expo/vector-icons'
import { Loading2 } from '@/components/Loading'
import MenuDialog from '@/components/MenuDialog'
import { useMenu } from '@/contexts/Menu'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledImage = styled(Image)
const StyledPressable = styled(Pressable)

interface MenuType {
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
    category: string;
}

interface MenuCardProps {
    menu: MenuType;
    setShowMenuDialog?: (value: boolean) => void;
    setMenuToEdit?: (menu: MenuType) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ menu, setShowMenuDialog, setMenuToEdit }) => {
    const router = useRouter();
    const [rating, setRating] = useState('');
    const [flag, setFlag] = useState(false);

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
            <StyledText className="text-gray-600 mt-[2px] pl-3 pr-3" style={{ fontSize: 14 }}>
                Quantity :{" "}
                {menu.quantity > 0 ? menu.quantity : "Not Available"}
            </StyledText>
            <StyledText className="text-gray-600 mt-[2px] pl-3 pr-3" style={{ fontSize: 14 }}>
                Price : {`${menu.price} Tk`}
            </StyledText>
            <StyledView className='flex-row items-center justify-between p-3 pb-0'>
                <TouchableOpacity onPress={() => {
                    setMenuToEdit && setMenuToEdit(menu);
                    setShowMenuDialog && setShowMenuDialog(true);
                }}>
                    <FontAwesome6 name="pen" size={18} color="#2CA4D4" />
                </TouchableOpacity>
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


const Menu = () => {
    const { menu, setMenu } = useMenu();
    const [menuToEdit, setMenuToEdit] = useState<MenuType | undefined>(undefined);
    const [showMenuDialog, setShowMenuDialog] = useState(false);
    const [showLoading, setShowLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [prevScrollTop, setPrevScrollTop] = useState(0);
    const [sendRequest, setSendRequest] = useState(true);
    const scrollViewRef = useRef<ScrollView>(null);
    const router = useRouter();
    const pageSize = 3;
    const { id } = useLocalSearchParams()

    const handleScroll = (event: any) => {
        const currentScrollTop = event.nativeEvent.contentOffset.y; // Current scroll position

        if (currentScrollTop > prevScrollTop) {
            const scrollHeight = event.nativeEvent.contentSize.height; // Full scrollable content height
            const clientHeight = event.nativeEvent.layoutMeasurement.height; // Visible height of the ScrollView
            const scrollTop = event.nativeEvent.contentOffset.y; // Current scroll offset

            if (scrollHeight - scrollTop - clientHeight < 3) {
                // If the user has scrolled to the bottom
                setPage((prev: number) => prev + 1); // Increment page for infinite scroll
            }
        }

        setPrevScrollTop(currentScrollTop); // Update the previous scroll position
    };


    const getMenu = async () => {
        const token = await AsyncStorage.getItem("token");
        if (token === null || token === undefined) {
            router.push("/auth/login");
            return;
        }

        try {
            setShowLoading(true);
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/menu/getMenuByResId?resId=${id}&page=${page}&size=${pageSize}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status == 200) {
                setShowLoading(false);
                const responseData = response.data;
                setMenu((prev) => {
                    const filteredData = responseData.filter(
                        (newItem: any) => !prev.some((prevItem) => prevItem.id === newItem.id)
                    );
                    return [...prev, ...filteredData];
                });
                if (response.data.length < pageSize) {
                    setSendRequest(false);
                }
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router);
        }
    };

    useEffect(() => {
        if (sendRequest) {
            getMenu();
        }
    }, [page]);

    return (
        <View>
            {!showLoading && !sendRequest && menu.length === 0 && (
                <StyledView className='flex-row w-full h-full justify-center items-center'>
                    <StyledText className="text-gray-500" style={{ fontSize: 14 }}>
                        No Menu Found
                    </StyledText>
                </StyledView>
            )}
            <MenuDialog visible={showMenuDialog} setVisible={setShowMenuDialog} menu={menuToEdit} />
            <ScrollView style={{ width: '100%', padding: 12 }} showsVerticalScrollIndicator={false} ref={scrollViewRef} onScroll={handleScroll} scrollEventThrottle={5}>
                {menu.length !== 0 && menu.map((item, index) => (
                    <View key={index}>
                        <MenuCard menu={item} setShowMenuDialog={setShowMenuDialog} setMenuToEdit={setMenuToEdit} />
                        {index === menu.length - 1 && <View className="mb-3" />}
                    </View>
                ))}
                {showLoading && <Loading2 />}
            </ScrollView>
        </View>
    )
}

export default Menu