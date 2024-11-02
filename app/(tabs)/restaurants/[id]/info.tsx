import React, { useEffect } from "react";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "expo-router";
import Loading from "@/components/Loading";
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { styled } from "nativewind";
import { View, Text, Image, ScrollView, ImageBackground, TouchableOpacity, SafeAreaView, TextInput, KeyboardTypeOptions } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Entypo from '@expo/vector-icons/Entypo';
import { Colors } from "@/constants/Colors";
import * as ImagePicker from 'expo-image-picker';
import unauthorized from "@/scripts/unauthorized";
import { usePathname } from "expo-router";
import { InputGroup_1 as InputGroup } from "@/components/input/TextInput";
import { CustomImagePicker } from "@/components/input/ImagePicker";
import { ProfileDataType } from "@/scripts/type";
import { useGlobal } from "@/contexts/Globals";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image)
const StyledScrollView = styled(ScrollView)
const StyledTouchableOpacity = styled(TouchableOpacity)

interface ResComponentProps {
    id: string;
}

export const ResComponent: React.FC<ResComponentProps> = ({ id }) => {
    const { light } = Colors
    const router = useRouter();
    const [name, setName] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [imgStream, setImgStream] = useState("");
    const [address, setAddress] = useState("");
    const [isEdit, setIsEdit] = useState(false)
    const [warning, setWarning] = useState("");
    const [showLoading, setShowLoading] = useState(true);
    const [flag, setFlag] = useState(false);
    const [isAddRes, setIsAddRes] = useState(true);
    const [resId, setResId] = useState(id !== undefined && id !== null ? id : "");
    const [prevdata, setPrevdata] = useState<ProfileDataType>({ name: '', address: '', phoneNum: '', image: '' });
    const pathname = usePathname()
    const { setCartCount } = useGlobal()
    const { setUnseenNotificationCount } = useGlobal();

    useEffect(() => {
        const getResInfo = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                const response = await axios.get(
                    `${process.env.EXPO_PUBLIC_SERVER_URL}/restaurant/getRestaurantById?id=${resId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.status === 200) {
                    setShowLoading(false);
                    setName(response.data.name);
                    setPhoneNum(
                        response.data.mobile !== null ? response.data.mobile : ""
                    );
                    setAddress(
                        response.data.address !== null ? response.data.address : ""
                    );
                    setResId(response.data.id);
                    if (response.data.image !== null) {
                        setImgStream(`data:image/jpeg;base64,${response.data.image}`);
                    }
                }
            } catch (error) {
                const axiosError = error as AxiosError;
                unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount, setUnseenNotificationCount);
            }
        };

        setIsAddRes(pathname === `/restaurants/addRestaurant`);

        if (pathname !== `/restaurants/addRestaurant`) {
            getResInfo();
        } else {
            setShowLoading(false);
        }
    }, []);

    const handleSubmit = async () => {
        if (resId === "" || name === "" || phoneNum === "" || address === "") {
            setWarning("Fill all the fields");
            return;
        }
        setWarning('')
        const formData = new FormData();
        formData.append("id", resId);
        formData.append("name", name);
        formData.append("address", address);
        formData.append("mobile", phoneNum);
        if (flag) {
            formData.append("file", { uri: imgStream, name: "image.jpeg", type: "image/jpeg" } as any);
        } else {
            formData.append("file", null as any);
        }

        const token = await AsyncStorage.getItem("token");
        if (token === null || token === undefined) {
            router.push("/auth/login");
            return
        }

        const owner = jwtDecode(token).sub;
        const ownerStr = owner as string;
        formData.append("owner", ownerStr)

        try {
            if (isAddRes) {
                const response = await axios.post(
                    `${process.env.EXPO_PUBLIC_SERVER_URL}/restaurant/addRestaurant`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                            Accept: 'application/json',
                        },
                    }
                );
                if (response.status == 200) {
                    Toast.show({
                        type: 'success',
                        text1: 'Restaurant Added',
                        text2: 'Your restaurant has been added successfully.',
                        visibilityTime: 4000,
                    });
                    router.push('/restaurants');
                }
            } else {
                const response = await axios.put(
                    `${process.env.EXPO_PUBLIC_SERVER_URL}/restaurant/updateRestaurant`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                            Accept: 'application/json',
                        },
                    }
                );
                if (response.status == 200) {
                    setIsEdit(false);
                }
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                const { status, data } = axiosError.response;
                if (status === 401) {
                    unauthorized(axiosError, Toast, AsyncStorage, router, setCartCount, setUnseenNotificationCount);
                } else if (status === 409) {
                    setWarning('ID already exists')
                } else {
                    console.log(data);
                }
            };
        }
    }

    const uploadImage = async () => {
        setWarning('')
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            setImgStream(imageUri);
            setFlag(true);
        }
    };

    return (
        <View>
            {showLoading && <Loading />}
            {!showLoading && (
                <SafeAreaView style={{ height: '100%' }}>
                    <StyledScrollView className={`bg-slate-100 w-full p-[6px]`} showsVerticalScrollIndicator={false} style={{ zIndex: 1, height: '100%' }}>
                        <StyledView className="w-full h-full">
                            <StyledView className="w-full relative rounded-xl" style={{ height: 212 }}>
                                <ImageBackground
                                    source={require('@/assets/images/profileBG.jpeg')}
                                    imageStyle={{ borderRadius: 10 }}
                                    style={{ minWidth: '100%', height: 140 }}
                                    resizeMode="cover"
                                />
                                <StyledView className="absolute inset-0 flex-row justify-center items-center mb-2 mt-2 min-w-full">
                                    <MaterialIcons name="home-work" size={36} color={light.primaryGray} />
                                    <StyledText className="font-bold text-gray-700 ml-[6px]" style={{ fontSize: 24 }}>
                                        Restaurant
                                    </StyledText>
                                </StyledView>
                                <StyledView className="w-full flex-row absolute top-[65px] h-[148px] justify-center items-center" style={{ height: 148 }}>
                                    {imgStream === "" && <StyledView className="bg-slate-200 rounded-full border-2 border-solid border-white" style={{ width: 146, height: 146 }} />}
                                    {imgStream !== "" && <StyledImage source={{ uri: imgStream }} style={{ width: 146, height: 146, borderRadius: 73 }} />}
                                </StyledView>
                                {isEdit &&
                                    <StyledTouchableOpacity className="absolute top-[2px] right-[2px] border-[0.5px] border-white p-1 rounded-full bg-red-500" onPress={() => {
                                        setWarning('')
                                        setIsEdit(false)
                                        setName(prevdata.name);
                                        setAddress(prevdata.address);
                                        setPhoneNum(prevdata.phoneNum);
                                        setImgStream(prevdata.image);
                                        setFlag(false);
                                    }}>
                                        <Entypo name="cross" size={24} color="white" />
                                    </StyledTouchableOpacity>
                                }
                            </StyledView>
                            {(isEdit || isAddRes) && (
                                <CustomImagePicker imgStream={imgStream} uploadImage={uploadImage} />
                            )}
                            {(isEdit || isAddRes) && (
                                <StyledText className="text-red-600 w-full text-center mt-2" style={{ fontSize: 14 }}>
                                    {warning}
                                </StyledText>
                            )}
                            {!isEdit && !isAddRes && (
                                <StyledView className={`overflow-x-hidden mt-2 flex-1`}>
                                    <StyledText className="pl-1 font-bold mb-[6px] mr-3 text-gray-700" style={{ fontSize: 18 }}>ID:</StyledText>
                                    <StyledText className="mb-2 border-2 border-gray-200 pl-2 pt-[3px] pb-[2px] rounded-md truncate" style={{ fontSize: 16 }}>
                                        {id}
                                    </StyledText>
                                </StyledView>
                            )}
                            {isAddRes && <InputGroup isEdit={isAddRes} flag={true} title="ID" value={resId} setValue={setResId} placeholder="Enter ID" setWarning={setWarning} keyboardType="default" />}
                            <InputGroup isEdit={isEdit || isAddRes} flag={true} title="Name" value={name} setValue={setName} placeholder="Enter Name" setWarning={setWarning} keyboardType="default" />
                            <InputGroup isEdit={isEdit || isAddRes} flag={true} title="Address" value={address} setValue={setAddress} placeholder="Enter address" setWarning={setWarning} keyboardType="default" />
                            <InputGroup isEdit={isEdit || isAddRes} flag={true} title="Mobile" value={phoneNum} setValue={setPhoneNum} placeholder="Enter mobile number" setWarning={setWarning} keyboardType="numeric" />
                        </StyledView>
                    </StyledScrollView>
                    <TouchableOpacity style={{ padding: 6 }} onPress={() => {
                        if (!isEdit && !isAddRes) {
                            setIsEdit(true);
                            const data = {
                                name: name,
                                address: address,
                                phoneNum: phoneNum,
                                image: imgStream,
                            }
                            setPrevdata(data);
                        } else {
                            handleSubmit()
                        }
                    }}>
                        <StyledView className='flex-row bg-blue-500 py-[6px] items-center justify-center rounded-md my-[2px]'>
                            {!isEdit && !isAddRes && <FontAwesome6 name="pen" size={18} color="white" />}
                            <StyledText className='text-white font-bold ml-2 text-base'>{!isEdit && !isAddRes ? "Edit" : "Submit"}</StyledText>
                        </StyledView>
                    </TouchableOpacity>
                </SafeAreaView>
            )}
        </View >
    )
}

const info = () => {
    const { id } = useLocalSearchParams() as { id?: string };

    useEffect(() => {
        const saveProp = async () => {
            if (id) {
                await AsyncStorage.setItem('YourRestaurant', id);
            }
        };
        saveProp();
    }, [id]);

    return (
        <ResComponent id={id ? id : ''} />
    );
}

export default info;