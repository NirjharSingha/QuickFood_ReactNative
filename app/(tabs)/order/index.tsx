import { View, Text } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import SearchBar from '@/components/SearchBar'
import { Loading2 } from '@/components/Loading'
import { ScrollView } from 'react-native-gesture-handler'
import { useRouter } from 'expo-router'
import { styled } from 'nativewind'
import { RestaurantCard } from '@/components/cards/RestaurantCard'
import axios, { AxiosError } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { RestaurantCardType } from '@/scripts/type'
import unauthorized from '@/scripts/unauthorized'
import Toast from 'react-native-toast-message'
import { useGlobal } from '@/contexts/Globals'

const StyledView = styled(View)
const StyledText = styled(Text)

const index = () => {
    const router = useRouter();
    const [restaurants, setRestaurants] = useState<RestaurantCardType[]>([]);
    const [page, setPage] = useState(0);
    const [prevScrollTop, setPrevScrollTop] = useState(0);
    const [sendRequest, setSendRequest] = useState(true);
    const [showLoading, setShowLoading] = useState(true);
    const { setCartCount } = useGlobal();
    const pageSize = 3;

    useEffect(() => {
        const getRestaurants = async () => {
            try {
                setShowLoading(true);
                const token = await AsyncStorage.getItem("token");
                const response = await axios.get(
                    `${process.env.EXPO_PUBLIC_SERVER_URL
                    }/restaurant/getRestaurantsByPagination?size=${pageSize}&page=${page}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.status == 200) {
                    setShowLoading(false);
                    setRestaurants((prev) => [...prev, ...response.data]);
                    if (response.data.length < pageSize) {
                        setSendRequest(false);
                    }
                }
            } catch (error) {
                const axiosError = error as AxiosError;
                unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount);
            }
        };
        if (sendRequest) {
            getRestaurants();
        }
    }, [page]);

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
            <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={5}>
                <SearchBar />
                {restaurants.length !== 0 && restaurants.map((item, index) => (
                    <View key={index} style={{ paddingHorizontal: 12 }}>
                        {index === 0 && <View className="mt-3" />}
                        <RestaurantCard restaurant={item} />
                    </View>
                ))}
                {showLoading && <Loading2 />}
            </ScrollView>
            {!showLoading && !sendRequest && restaurants.length === 0 && (
                <StyledView className='flex-row w-full h-full justify-center items-center'>
                    <StyledText className="text-gray-500" style={{ fontSize: 14, paddingBottom: 24.5 }}>
                        No Restaurant found
                    </StyledText>
                </StyledView>
            )}
        </View>
    )
}

export default index