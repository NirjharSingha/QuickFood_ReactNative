import { View, Text, TextInput, TouchableWithoutFeedback, Button } from 'react-native'
import React, { useRef, useState } from 'react'
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios, { AxiosError } from 'axios';
import unauthorized from '@/scripts/unauthorized';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { styled } from 'nativewind';
import { Dialog, Portal } from 'react-native-paper';

interface SearchResultProps {
    filteredData: Array<{ id: string; name: string; image: string }>;
    showResult: boolean;
    setShowResult: (show: boolean) => void;
    setInputValue: (value: string) => void;
}

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput)

const SearchResult: React.FC<SearchResultProps> = ({ filteredData, showResult, setShowResult, setInputValue }) => {
    // const router = useRouter();

    // useEffect(() => {
    //     const handleOutsideClick = (event: any) => {
    //         if (
    //             containerRef.current &&
    //             !containerRef.current.contains(event.target)
    //         ) {
    //             setShowResult(false);
    //             setInputValue("");
    //         }
    //     };

    //     document.addEventListener("mousedown", handleOutsideClick);

    //     return () => {
    //         document.removeEventListener("mousedown", handleOutsideClick);
    //     };
    // }, []);

    // const handleNavigate = (id) => {
    //     router.push(`/orderFood/${id}`);
    // };

    return (
        // <div
        //     className={`${windowWidth > 640
        //         ? "w-[17.7rem]"
        //         : windowWidth > 530
        //             ? "w-[13.7rem]"
        //             : windowWidth > 340
        //                 ? "w-[17.7rem]"
        //                 : ""
        //         } absolute top-8 pt-2 pb-2 right-3 h-[18rem] bg-gray-200 rounded-lg rounded-t-none border-0 border-gray-500 shadow-md overflow-x-hidden overflow-y-auto z-50 scrollNone`}
        //     style={windowWidth <= 340 ? { width: "calc(100vw - 3.3rem)" } : {}}
        // >
        //     {filteredData.map((searchItem, index) => (
        //         <div
        //             key={`${searchItem.id}-${index}`}
        //             className="h-[42px] p-[5px] pb-[2.5px] pt-[2.5px] mb-1 ml-1 mr-1 flex items-center rounded hover:cursor-pointer hover:bg-gray-400"
        //             onClick={() => handleNavigate(searchItem.id)}
        //         >
        //             <img
        //                 src={
        //                     searchItem.image === null
        //                         ? "/Restaurant.jpeg"
        //                         : "data:image/jpeg;base64," + searchItem.image
        //                 }
        //                 alt="logo"
        //                 className="w-[2rem] h-[2rem] rounded-[50%] bg-blue-400 border-2 border-solid border-white"
        //             />
        //             <p className="ml-[8px] truncate">{searchItem.name}</p>
        //         </div>
        //     ))}
        // </div>
        <StyledView className='absolute top-12 left-6 mr-3 max-w-[264px] pt-2 pb-2 right-3 h-[230px] bg-white rounded-lg rounded-t-none border-0 border-gray-500 shadow-md'></StyledView>
        // <Portal>
        //     <Dialog visible={showResult} onDismiss={() => setShowResult(false)}>

        //     </Dialog>
        // </Portal>
    );
};

const SearchBar = () => {
    const router = useRouter();
    const [fetchedData, setFetchedData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [showResult, setShowResult] = useState(false);
    const containerRef = useRef<View>(null);

    const handleInputChange = async (value: string) => {
        setInputValue(value);
        if (value.length > 0) {
            setShowResult(true);
        } else {
            setShowResult(false);
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
                return data;
            });
        }
    };

    const handleOutsideClick = (event: { nativeEvent: { pageX: number, pageY: number } }) => {
        if (!containerRef.current) {
            return;
        }

        containerRef.current.measure((fx, fy, width, height, px, py) => {
            const { pageX, pageY } = event.nativeEvent;

            // Check if the touch is outside the container
            if (
                pageX < px ||
                pageX > px + width ||
                pageY < py ||
                pageY > py + height
            ) {
                setShowResult(false);
                setInputValue(""); // Clear input when touched outside
            }
        });
    };

    return (
        <StyledView className="relative bg-[#374151]">
            <StyledView className="flex-row w-full max-w-[300px] p-3">
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
            {showResult && (
                <TouchableWithoutFeedback onPress={() => setShowResult(false)}>
                    <SearchResult
                        filteredData={filteredData}
                        showResult={showResult}
                        setShowResult={setShowResult}
                        setInputValue={setInputValue}
                    />
                </TouchableWithoutFeedback>
            )}
        </StyledView>
    )
}

export default SearchBar