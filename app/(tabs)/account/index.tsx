"use client";

import React, { useRef, useEffect } from "react";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "expo-router";
import Loading from "@/components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { styled } from "nativewind";
import { View, Text, Image, ScrollView, ImageBackground, TouchableOpacity, SafeAreaView, TextInput } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Colors } from "@/constants/Colors";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image)
const StyledScrollView = styled(ScrollView)
const StyledInput = styled(TextInput)

interface InputGroupProps {
    isEdit: boolean;
    flag: boolean;
    title: string;
    value: string;
    setValue: (value: string) => void;
    placeholder: string;
    setWarning: (value: string) => void;
}

type ProfilePic = {
    uri: string;
    name: string | undefined;
    type: string;
};

const InputGroup: React.FC<InputGroupProps> = ({ isEdit, flag, title, value, setValue, placeholder, setWarning }) => {
    return (
        <StyledView className={`overflow-x-hidden mt-2 ${isEdit ? "flex-row items-center justify-between mr-[6px]" : "flex-1"}`}>
            <StyledText className="pl-1 font-bold mb-[6px] mr-3 text-gray-700" style={{ fontSize: 18 }}>
                {title}:{isEdit && flag && <StyledText className="text-red-500">*</StyledText>}
            </StyledText>
            {isEdit ? (
                <StyledInput
                    className="border-b-[1px] border-gray-400 mb-4 w-[65%] pl-1 outline-none cursor-pointer bg-slate-100"
                    placeholder={placeholder}
                    value={value}
                    style={{ fontSize: 16 }}
                    onChangeText={(text) => {
                        setValue(text);
                        setWarning("");
                    }}
                />
            ) : (
                <StyledText className={`mb-2 border-2 border-gray-200 pl-2 pt-[3px] pb-[2px] rounded-md ${value === "" ? "text-gray-500" : ""}`} style={{ fontSize: 16 }}>
                    {value === "" ? "Not filled" : value}
                </StyledText>
            )}
        </StyledView>
    )
}

const index = () => {
    const { light } = Colors
    const router = useRouter();
    const [id, setId] = useState("");
    const [username, setUsername] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [profilePic, setProfilePic] = useState<ProfilePic | null>(null);
    const [imgStream, setImgStream] = useState("");
    const [address, setAddress] = useState("");
    const [isEdit, setIsEdit] = useState(false)
    const [warning, setWarning] = useState("");
    const fileInputRef = useRef(null);
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        const getProfile = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                setShowLoading(true);
                const response = await axios.get(
                    `${process.env.EXPO_PUBLIC_SERVER_URL}/user/getUser?userId=${token !== null ? jwtDecode(token).sub : ""
                    }`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.status === 200) {
                    setShowLoading(false);
                    setUsername(response.data.name);
                    setPhoneNum(
                        response.data.mobile !== null ? response.data.mobile : ""
                    );
                    setAddress(
                        response.data.address !== null ? response.data.address : ""
                    );
                    setId(response.data.id);
                    if (response.data.profilePic !== null) {
                        setImgStream(`data:image/jpeg;base64,${response.data.profilePic}`);
                    }
                }
            } catch (error) {
                const axiosError = error as AxiosError;
                if (axiosError.response) {
                    const { status, data } = axiosError.response;
                    if (status === 401) {
                        await AsyncStorage.removeItem("token");
                        await AsyncStorage.removeItem("role");
                        Toast.show({
                            type: 'error',
                            text1: 'Session Expired',
                            text2: 'Your current session has expired. Please login again.',
                            visibilityTime: 6000,
                        });
                        router.push("/auth/login");
                    } else {
                        console.log(data);
                    }
                }
            }
        };

        getProfile();
    }, []);

    const handleUpdate = async () => {
        if (username === "") {
            setWarning("Username cannot be empty");
            return;
        }

        const formData = new FormData();
        formData.append("id", id);
        formData.append("name", username);
        formData.append("address", address);
        formData.append("mobile", phoneNum);
        if (profilePic !== null) {
            console.log(profilePic.name);
            console.log(profilePic.type);
            formData.append("file", { uri: profilePic?.uri, name: "image.png", type: "image/png" } as any);
        } else {
            formData.append("file", null as any);
        }

        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.put(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/user/updateProfile`,
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
                console.log(response.data);
            }
        } catch (error) {
            console.log("Error:", error);
        };
    }

    const uploadImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            const fileName = imageUri.split('/').pop();
            const fileType = result.assets[0].type || 'image/jpeg';

            // For displaying the image on the UI (using URI)
            setImgStream(imageUri);
            setProfilePic({ uri: imageUri, name: fileName, type: fileType });
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
                                    <MaterialIcons name="person" size={36} color={light.primaryGray} />
                                    <StyledText className="font-bold text-gray-700 ml-1" style={{ fontSize: 24 }}>
                                        Profile
                                    </StyledText>
                                </StyledView>
                                <StyledView className="w-full flex-row absolute top-[65px] h-[148px] justify-center items-center" style={{ height: 148 }}>
                                    {imgStream === "" && <StyledView className="bg-slate-200 rounded-full border-2 border-solid border-white" style={{ width: 146, height: 146 }} />}
                                    {imgStream !== "" && <StyledImage source={{ uri: imgStream }} style={{ width: 146, height: 146, borderRadius: 73 }} />}
                                </StyledView>
                            </StyledView>
                            {isEdit && (
                                <TouchableOpacity onPress={uploadImage}>
                                    <StyledView className="w-full flex-row justify-center items-center mb-1 mt-4">
                                        <StyledView
                                            className="max-w-[210px] flex-row cursor-pointer rounded-full border-[1px] border-gray-900 overflow-hidden"
                                        >
                                            <StyledText className="w-[46%] py-[2px] h-full bg-slate-600 text-white flex-row justify-center items-center text-center" style={{ fontSize: 12 }}>
                                                Choose image
                                            </StyledText>
                                            <StyledText className="w-[54%] py-[2px] h-full text-gray-700 flex-row justify-center items-center text-center" style={{ fontSize: 12 }}>
                                                {imgStream === "" ? "No image chosen" : "Image chosen"}
                                            </StyledText>
                                        </StyledView>
                                    </StyledView>
                                </TouchableOpacity>
                            )}
                            {isEdit && (
                                <StyledText className="text-red-600 w-full text-center mt-2" style={{ fontSize: 14 }}>
                                    {warning}
                                </StyledText>
                            )}
                            {!isEdit && (
                                <StyledView className={`overflow-x-hidden mt-2 flex-1`}>
                                    <StyledText className="pl-1 font-bold mb-[6px] mr-3 text-gray-700" style={{ fontSize: 18 }}>ID:</StyledText>
                                    <StyledText className="mb-2 border-2 border-gray-200 pl-2 pt-[3px] pb-[2px] rounded-md" style={{ fontSize: 16 }}>
                                        {id}
                                    </StyledText>
                                </StyledView>
                            )}
                            <InputGroup isEdit={isEdit} flag={true} title="Name" value={username} setValue={setUsername} placeholder="Enter username" setWarning={setWarning} />
                            <InputGroup isEdit={isEdit} flag={false} title="Address" value={address} setValue={setAddress} placeholder="Enter address" setWarning={setWarning} />
                            <InputGroup isEdit={isEdit} flag={false} title="Mobile" value={phoneNum} setValue={setPhoneNum} placeholder="Enter mobile number" setWarning={setWarning} />
                        </StyledView>
                    </StyledScrollView >
                    <TouchableOpacity style={{ padding: 6 }} onPress={() => {
                        if (!isEdit) {
                            setIsEdit(true);
                        } else {
                            handleUpdate()
                        }
                    }}>
                        <StyledView className='flex-row bg-blue-500 py-[6px] items-center justify-center rounded-md my-[2px]'>
                            {!isEdit && <FontAwesome6 name="pen" size={18} color="white" />}
                            <StyledText className='text-white font-bold ml-2 text-base'>{!isEdit ? "Edit" : "Apply"}</StyledText>
                        </StyledView>
                    </TouchableOpacity>
                </SafeAreaView>
            )}
        </View >
    )
}

export default index;