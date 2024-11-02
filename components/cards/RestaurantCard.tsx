import { View, Text, Image, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { usePathname } from 'expo-router'
import axios, { AxiosError } from 'axios'
import unauthorized from '@/scripts/unauthorized'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AntDesign from '@expo/vector-icons/AntDesign';
import { styled } from 'nativewind'
import { RestaurantCardType } from '@/scripts/type'
import { useGlobal } from '@/contexts/Globals'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledImage = styled(Image)
const StyledPressable = styled(Pressable)

interface RestaurantCardProps {
    restaurant: RestaurantCardType;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [rating, setRating] = useState('');
    const [flag, setFlag] = useState(false);
    const { setCartCount } = useGlobal()
    const { setUnseenNotificationCount } = useGlobal();

    const handleNavigate = () => {
        if (pathname.includes("/restaurants")) {
            router.push(`/restaurants/${restaurant.id}/info`);
        } else if (pathname.includes("/order")) {
            router.push(`/order/${restaurant.id}`);
        }
    };

    useEffect(() => {
        const getRating = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                const response = await axios.get(
                    `${process.env.EXPO_PUBLIC_SERVER_URL}/review/restaurantRating?restaurantId=${restaurant.id}`,
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
                unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount, setUnseenNotificationCount);
            }
        };
        getRating();
    }, []);

    return (
        <StyledPressable
            className={`w-full max-w-[270px] mx-auto rounded-lg shadow-md bg-base-100 border-2 border-gray-200 bg-white pb-[14px] mb-3`}
            onPress={handleNavigate}
        >
            <StyledImage
                source={restaurant.image ? { uri: `data:image/jpeg;base64,${restaurant.image}` } : require("@/assets/images/Restaurant.jpeg")}
                alt="logo"
                className="bg-red-100 w-full h-[170px] rounded-tl-lg rounded-tr-lg border-b-2 border-b-gray-200"
            />
            <StyledText className="font-bold text-gray-700 mt-2 pl-3 pr-3" style={{ fontSize: 18 }}>
                {restaurant.name}
            </StyledText>
            <StyledText className="text-gray-600 mt-[2px] pl-3 pr-3" style={{ fontSize: 14 }}>
                {restaurant.address ? restaurant.address : "No Address"}
            </StyledText>
            {flag === true &&
                <View>
                    {rating === '' && <StyledText className='mt-2 flex-row gap-1 justify-center items-center font-bold text-white bg-green-700 ml-auto rounded-[4.5px] px-2 py-1 mr-3' style={{ fontSize: 12 }}>No Rating</StyledText>}
                    {rating !== '' &&
                        <StyledView className="mt-2 flex-row gap-1 justify-center items-center font-bold text-white bg-green-700 ml-auto rounded-[4.5px] px-2 pb-1 mr-3">
                            <StyledText className='font-bold text-white' style={{ fontSize: 13 }}>{parseFloat(rating).toFixed(2)}</StyledText>
                            <AntDesign name="star" size={15} color="white" />
                        </StyledView>
                    }
                </View>
            }
        </StyledPressable>
    );
};