import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { styled } from "nativewind";
import Octicons from '@expo/vector-icons/Octicons';
import { Colors } from "@/constants/Colors";
import { usePathname } from "expo-router";
import { useRouter } from "expo-router";
import { Input } from "@/components/input/TextInput";
import { Password } from "@/components/input/PasswordInput";
import axios from "axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StyledView = styled(View)
const StyledImage = styled(Image)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)
const { light } = Colors

const Signup = () => {
    const [warning, setWarning] = useState("");
    const [id, setId] = useState("");
    const [username, setUsername] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            setWarning("Passwords do not match");
            return;
        }

        const postData = {
            id: id,
            name: username,
            password: password,
            role: !pathname.includes("/admin/riders") ? "USER" : "RIDER",
        };
        try {
            const response = await axios.post(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/auth/signupReactNative`,
                postData
            );
            if (response.status == 200) {
                if (pathname.includes("/admin/riders")) {
                    Toast.show({
                        type: "success",
                        text1: "Rider added",
                        text2: "The rider is added successfully",
                        visibilityTime: 4000,
                    });

                    // setRiders((prev) => {
                    //     return [...prev, { id: id, name: username, image: null }];
                    // });
                    return;
                }
                await AsyncStorage.setItem("token", response.data.token);
                await AsyncStorage.setItem("role", response.data.role);
                router.replace("/home");
            }
        } catch (error) {
            console.log(error);
            setWarning("Invalid input");
        }
    };

    return (
        <ScrollView className="min-h-full bg-white" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", }}>
            <StyledImage source={require("@/assets/images/foodDelivery.png")} resizeMode="contain" className="w-full h-auto aspect-auto" />
            <StyledView className="w-[98.5%] h-full bg-white shadow-lg shadow-gray-800 rounded-t-xl z-10 mt-[-5px] p-4 flex-1 justify-center items-center">
                <StyledView className="pt-4 flex-row justify-center items-center gap-3">
                    <Octicons name="sign-in" size={47} color={light.primaryGray} />
                    <StyledText className=" text-gray-700 font-bold" style={{ fontSize: 24 }}>
                        Sign Up
                    </StyledText>
                </StyledView>
                <StyledText className=" text-red-600 w-full text-center mt-2 mb-1" style={{ fontSize: 13 }}>
                    {warning}
                </StyledText>
                <Input text={id} setText={setId} placeholder={!pathname.includes("/admin/riders") ? "Enter email" : "Enter rider Id"} setWarning={setWarning} keyboardType={!pathname.includes("/admin/riders") ? "email-address" : "default"} />
                <Input text={username} setText={setUsername} placeholder={!pathname.includes("/admin/riders") ? "Enter username" : "Enter rider name"} setWarning={setWarning} keyboardType="default" />
                <Password password={password} setPassword={setPassword} showPass={showPass} setShowPass={setShowPass} placeholder="Enter password" setWarning={setWarning} />
                <Password password={confirmPassword} setPassword={setConfirmPassword} showPass={showConfirmPassword} setShowPass={setShowConfirmPassword} placeholder="Confirm password" setWarning={setWarning} />
                <StyledTouchableOpacity
                    className="bg-blue-500 w-full py-1 rounded-md mt-2 mb-1"
                    onPress={handleSignUp}
                >
                    <StyledText className="text-white text-lg w-full text-center font-bold">Sign up</StyledText>
                </StyledTouchableOpacity>
                <StyledView className="flex-row justify-center items-center mt-4 mb-5">
                    <StyledText className="w-full text-center" style={{ fontSize: 15, color: light.primaryGray }}>
                        Already have an account?{"  "}
                        <StyledText className="text-blue-600 font-bold underline" onPress={() => router.replace("/auth/login")}>
                            Log in
                        </StyledText>
                    </StyledText>
                </StyledView>
            </StyledView>
        </ScrollView>
    );
}

export default Signup;