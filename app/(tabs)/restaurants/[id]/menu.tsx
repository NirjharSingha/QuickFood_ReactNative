import { View, Text } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import axios, { AxiosError } from 'axios'
import unauthorized from '@/scripts/unauthorized'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { styled } from 'nativewind'
import { ScrollView } from 'react-native-gesture-handler'
import { Loading2 } from '@/components/Loading'
import MenuDialog from '@/components/Dialogs/MenuDialog'
import { useGlobal } from '@/contexts/Globals'
import { MenuType } from '@/scripts/type'
import { MenuCard } from '@/components/cards/MenuCard'

const StyledView = styled(View)
const StyledText = styled(Text)

const Menu = () => {
    const { menu, setMenu, setCartCount } = useGlobal();
    const [menuToEdit, setMenuToEdit] = useState<MenuType | undefined>(undefined);
    const [showMenuDialog, setShowMenuDialog] = useState(false);
    const [showLoading, setShowLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [prevScrollTop, setPrevScrollTop] = useState(0);
    const [sendRequest, setSendRequest] = useState(true);
    const router = useRouter();
    const pageSize = 3;
    const { id } = useLocalSearchParams()
    const { setUnseenNotificationCount } = useGlobal();

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
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount, setUnseenNotificationCount);
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
            <ScrollView style={{ width: '100%', padding: 12 }} showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={5}>
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