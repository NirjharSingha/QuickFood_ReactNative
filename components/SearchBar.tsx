import { View, Text, TextInput, Pressable, Image } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios, { AxiosError } from 'axios';
import unauthorized from '@/scripts/unauthorized';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { styled } from 'nativewind';
import { useClickOutside } from 'react-native-click-outside';
import { ScrollView } from 'react-native-gesture-handler'

interface SearchResultProps {
    filteredData: Array<{ id: string; name: string; image: string }>;
    setShowResult: (value: boolean) => void;
    setInpuValue: (value: string) => void;
    showMesssage: boolean;
}

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput)
const StyledPressable = styled(Pressable)
const StyledImage = styled(Image)
const StyledScrollView = styled(ScrollView)

const SearchResult: React.FC<SearchResultProps> = ({ filteredData, setShowResult, setInpuValue, showMesssage }) => {
    const router = useRouter();

    const handleNavigate = (resId: string) => {
        setShowResult(false);
        setInpuValue("");
        router.push(`/order/${resId}`);
    };

    return (
        <StyledScrollView className='left-3 h-[230px] mr-6 flex-1 max-w-[245px] bg-white rounded-lg rounded-t-none border-0 border-gray-500 shadow-md pr-[10px]' showsVerticalScrollIndicator={false} style={{ height: 230, maxHeight: 230 }}>
            {filteredData.length > 0 && filteredData.map((searchItem) => (
                <StyledPressable
                    key={`${searchItem.id}`}
                    className="h-[42px] p-[5px] pb-[2.5px] pt-[2.5px] mb-1 ml-1 mr-1 flex-row items-center rounded"
                    onPress={() => handleNavigate(searchItem.id)}
                >
                    <StyledImage source={searchItem.image === null ? require('@/assets/images/Restaurant.jpeg') : { uri: `data:image/jpeg;base64,${searchItem.image}` }}
                        alt="logo"
                        className="w-[32px] h-[32px] rounded-full border-2 bg-blue-400 border-solid border-white"
                        resizeMode='cover'
                    />
                    <StyledText numberOfLines={1} ellipsizeMode='middle' className="ml-2 mb-[2px] font-bold">{searchItem.name}</StyledText>
                </StyledPressable>
            ))}
            {showMesssage &&
                <StyledView className='flex-row w-full h-[230px] justify-center items-center'>
                    <StyledText className="text-gray-500" style={{ fontSize: 14 }}>
                        No Result Found
                    </StyledText>
                </StyledView>
            }
        </StyledScrollView>
    );
};

const SearchBar = () => {
    const router = useRouter();
    const [fetchedData, setFetchedData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const containerRef = useClickOutside<View>(() => {
        setShowResult(false)
        setShowMessage(false)
        setInputValue("")
        setFilteredData([])
    });

    const handleInputChange = async (value: string) => {
        setInputValue(value);
        if (value.length > 0) {
            setShowResult(true);
        } else {
            setShowResult(false);
            setShowMessage(false);
        }
        if (value.length === 1) {
            try {
                const token = await AsyncStorage.getItem("token");
                const response = await axios.get(
                    `${process.env.EXPO_PUBLIC_SERVER_URL}/restaurant/searchRestaurant?name=${value}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response) {
                    setFetchedData(response.data);
                    setFilteredData(response.data);
                    if (response.data.length === 0) {
                        setShowMessage(true);
                    } else {
                        setShowMessage(false);
                    }
                }
            } catch (error) {
                const axiosError = error as AxiosError;
                unauthorized(axiosError, Toast, AsyncStorage, router);
            }
        } else if (value.length === 0) {
            setFilteredData([]);
        } else {
            setFilteredData(() => {
                const data = fetchedData.filter((item: { id: string, name: string, image: string }) =>
                    item.name.toLowerCase().includes(value.toLowerCase())
                );
                if (data.length === 0) {
                    setShowMessage(true);
                } else {
                    setShowMessage(false);
                }
                return data;
            });
        }
    }

    return (
        <StyledView className=" bg-[#374151] relative h-[49px] pr-6 z-50">
            <StyledView className='absolute top-2 left-3 w-full max-w-[270px] flex-1' ref={containerRef} collapsable={false}>
                <StyledView className="flex-row w-full">
                    <StyledView className="h-[33px] bg-white border-[1.5px] border-solid border-gray-500 flex justify-center items-center mt-0.5rem rounded-l-full border-r-0 pl-2 pr-1">
                        <MaterialIcons name='search' color={'gray'} size={22} />
                    </StyledView>
                    <StyledInput
                        className={`flex-1 bg-white h-[33px] border-[1.5px] border-solid border-gray-500 rounded-r-full border-l-0 focus:border-gray-500 focus:outline-none`}
                        placeholder="Search Restaurants"
                        value={inputValue}
                        onChangeText={(text) => handleInputChange(text)}
                    />
                </StyledView>
                {showResult && <SearchResult filteredData={filteredData} setShowResult={setShowResult} setInpuValue={setInputValue} showMesssage={showMessage} />}
            </StyledView>
        </StyledView>
    )
}

export default SearchBar