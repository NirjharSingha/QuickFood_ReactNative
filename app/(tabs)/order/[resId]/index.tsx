import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Loading2 } from '@/components/Loading'
import { ScrollView } from 'react-native-gesture-handler'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { styled } from 'nativewind'
import { MenuCard } from '@/components/cards/MenuCard'
import axios, { AxiosError } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MenuType } from '@/scripts/type'
import unauthorized from '@/scripts/unauthorized'
import Toast from 'react-native-toast-message'
import Filters from '@/components/Dialogs/Filters'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors'
import { useGlobal } from '@/contexts/Globals'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpcity = styled(TouchableOpacity)

const index = () => {
    const { light } = Colors
    const router = useRouter();
    const [menu, setMenu] = useState<MenuType[]>([]);
    const [nameFilter, setNameFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [priceFilter, setPriceFilter] = useState("");
    const [ratingFilter, setRatingFilter] = useState("")
    const [visible, setVisible] = useState(false);
    const [page, setPage] = useState(0);
    const [prevScrollTop, setPrevScrollTop] = useState(0);
    const [sendRequest, setSendRequest] = useState(true);
    const [showLoading, setShowLoading] = useState(true);
    const scrollViewRef = useRef<ScrollView>(null);
    const { resId } = useLocalSearchParams() as { resId?: string };
    const pageSize = 3;
    const { setCartCount } = useGlobal();
    const { setUnseenNotificationCount } = useGlobal();

    useEffect(() => {
        const getMenu = async () => {
            try {
                setShowLoading(true);
                const token = await AsyncStorage.getItem("token");
                const response = await axios.get(
                    `${process.env.EXPO_PUBLIC_SERVER_URL
                    }/menu/getFilteredMenu?name=${nameFilter}&resId=${resId}&category=${categoryFilter}&price=${priceFilter}&rating=${ratingFilter}&page=${page}&size=${pageSize}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.status == 200) {
                    setShowLoading(false);
                    if (page === 0) {
                        setMenu(response.data);
                    } else {
                        const responseData = response.data;
                        setMenu((prev: MenuType[]) => {
                            // Filter out elements from responseData that already exist in prev based on their IDs
                            const filteredData = responseData.filter(
                                (newItem: MenuType) =>
                                    !prev.some((prevItem: MenuType) => prevItem.id === newItem.id)
                            );
                            // Merge the filtered data with the previous state
                            return [...prev, ...filteredData];
                        });
                    }
                    if (response.data.length < pageSize) {
                        setSendRequest(false);
                    }
                }
            } catch (error) {
                const axiosError = error as AxiosError;
                unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount, setUnseenNotificationCount);
            }
        };

        if (sendRequest) {
            getMenu();
        }
    }, [page, sendRequest, nameFilter, categoryFilter, priceFilter, ratingFilter]);

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

    return (
        <View>
            {visible && <Filters visible={visible} setVisible={setVisible} nameFilter={nameFilter} setNameFilter={setNameFilter} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} priceFilter={priceFilter} setPriceFilter={setPriceFilter} ratingFilter={ratingFilter} setRatingFilter={setRatingFilter} setSendRequest={setSendRequest} setPage={setPage} />}
            <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false} ref={scrollViewRef} onScroll={handleScroll} scrollEventThrottle={5}>
                <StyledView className=" bg-[#374151] h-[49px] flex-row items-center">
                    <StyledTouchableOpcity onPress={() => setVisible(true)} className='flex-row justify-center items-center ml-auto mr-3 px-[10px] bg-white rounded-full py-[3px]'>
                        <Ionicons name="filter-sharp" size={20} color={light.primaryGray} />
                        <StyledText style={{ color: light.primaryGray, fontSize: 14, fontWeight: 'bold' }} className='ml-2 mb-[1px]'>Apply Filters</StyledText>
                    </StyledTouchableOpcity>
                </StyledView>
                {menu.length !== 0 && menu.map((item, index) => (
                    <View key={index} style={{ paddingHorizontal: 12 }}>
                        {index === 0 && <View className="mt-3" />}
                        <MenuCard menu={item} />
                    </View>
                ))}
                {showLoading && <Loading2 />}
            </ScrollView>
            {!showLoading && !sendRequest && menu.length === 0 && (
                <StyledView className='flex-row w-full h-full justify-center items-center'>
                    <StyledText className="text-gray-500" style={{ fontSize: 14, paddingBottom: 24.5 }}>
                        No Menu Found
                    </StyledText>
                </StyledView>
            )}
        </View>
    )
}

export default index