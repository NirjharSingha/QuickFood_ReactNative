import { styled } from 'nativewind';
import * as React from 'react';
import { ScrollView, Image, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import unauthorized from '@/scripts/unauthorized';
import Toast from 'react-native-toast-message';
import Loading from '@/components/Loading';
import { RatingTable as Table } from '@/components/Table';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { AntDesign } from '@expo/vector-icons';
import { useGlobal } from '@/contexts/Globals';
import { RatingPageType } from '@/scripts/type';
import RatingDialog from '@/components/Dialogs/RatingDialog';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

const index = () => {
    const { orderId } = useLocalSearchParams() as { orderId?: number };
    const [showLoading, setShowLoading] = useState(true);
    const router = useRouter();
    const { setCartCount } = useGlobal();
    const [pageData, setPageData] = useState<RatingPageType>(null);
    const [rating, setRating] = useState<{ menuId: number, rating: number }[]>([]);
    const [visible, setVisible] = useState(false);
    const [selectedMenuId, setSelectedMenuId] = useState(0);

    const getPage = async () => {
        const token = await AsyncStorage.getItem("token");
        try {
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/review/getReviewPage?orderId=${orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                setShowLoading(false);
                setPageData(response.data);
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount);
        }
    };

    useEffect(() => {
        getPage()
    }, []);

    const handleSubmitRating = async () => {
        if (rating.length === 0) {
            Toast.show({
                type: 'error',
                text1: 'Rating Error',
                text2: 'Please give rating to at least one item.',
                visibilityTime: 4000,
            })
            return;
        }
        const token = await AsyncStorage.getItem("token");
        try {
            const response = await axios.post(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/review/submitReview?orderId=${orderId}`,
                rating,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Rating Submitted',
                    text2: 'Thanks for your valuable feedback.',
                    visibilityTime: 4000,
                })
                router.push('/order/rating');
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount);
        }
    };

    return (
        <View>
            {showLoading && <Loading />}
            {!showLoading &&
                <SafeAreaView style={{ height: '100%', paddingTop: 6 }}>
                    <RatingDialog visible={visible} setVisible={setVisible} setRating={setRating} menuId={selectedMenuId} />
                    <StyledView className='flex-row justify-center items-center gap-3'>
                        <AntDesign name="star" size={38} color={Colors.light.primaryGray} style={{ textAlign: 'center' }} />
                        <StyledText style={styles.title}>Rating</StyledText>
                    </StyledView>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 6, paddingRight: 0 }}>
                            <StyledView className="w-full h-[140px] p-1 pt-0 rounded-xl gap-3 mt-[-20px] mb-2 justify-between items-center" style={{ flexDirection: 'row', alignItems: 'center', width: 430 }}>
                                <StyledImage
                                    source={pageData && pageData.restaurantPic ? { uri: `data:image/jpeg;base64,${pageData.restaurantPic}` } : require("@/assets/images/Restaurant.jpeg")}
                                    alt="logo"
                                    className={`ml-2 w-36 h-24 rounded-lg overflow-hidden`}
                                    resizeMode='cover'
                                />
                                <StyledView className="h-full flex-col justify-center w-full overflow-hidden">
                                    <StyledText className={`font-bold text-gray-700 mb-1`} style={{ fontSize: 20 }}>
                                        {pageData?.restaurantName}
                                    </StyledText>
                                    <StyledText className={`text-gray-700 mb-1`} style={{ fontSize: 16 }}>
                                        Please give rating
                                    </StyledText>
                                    <StyledText className={`text-gray-700 mb-1`} style={{ fontSize: 16 }}>
                                        to the ordered food.
                                    </StyledText>
                                </StyledView>
                            </StyledView>
                            {pageData && pageData.menuItems && <Table data={pageData.menuItems} setVisible={setVisible} setMenuId={setSelectedMenuId} ratings={rating} />}
                        </ScrollView>
                    </ScrollView>
                    <TouchableOpacity style={{ padding: 6 }} onPress={handleSubmitRating}>
                        <StyledView className='flex-row bg-blue-500 py-[6px] items-center justify-center rounded-md my-[2px]'>
                            <StyledText className='text-white font-bold ml-2 text-base'>Submit Rating</StyledText>
                        </StyledView>
                    </TouchableOpacity>
                </SafeAreaView>
            }
        </View>
    )
}

export default index

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        color: Colors.light.primaryGray,
        fontSize: 26,
        fontWeight: 'bold',
    },
})