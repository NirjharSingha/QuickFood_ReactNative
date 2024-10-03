import React from "react";
import { Input } from "@/components/input/TextInput";
import { Password } from "@/components/input/PasswordInput";
import { styled } from "nativewind";
import { Colors } from "@/constants/Colors";
import { usePathname } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Radio } from "@/components/input/RadioButton";

const StyledView = styled(View)
const StyledImage = styled(Image)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)
const { light } = Colors

const Login = () => {
    const [warning, setWarning] = useState("");
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [checked, setChecked] = useState('first');
    const pathname = usePathname();
    const router = useRouter();

    const handleLogin = async () => {
        if (id === "" || password === "") {
            setWarning("Please fill all fields");
            return;
        }
        if (id.includes("@") && checked === "second") {
            setWarning("Invalid id");
            return;
        }
        if (!id.includes("@") && checked === "first") {
            setWarning("Invalid email");
            return;
        }

        const postData = {
            id: id,
            password: password,
        };

        try {
            const response = await axios.post(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/auth/login`,
                postData
            );
            if (response.status == 200) {
                const token = response.data.token;
                await AsyncStorage.setItem("token", token);
                await AsyncStorage.setItem("role", response.data.role);
                router.replace("/home");
            }
        } catch (error) {
            console.log(error);
            setWarning("Invalid credentials");
        }
    };

    return (
        <ScrollView className="min-h-full bg-white" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", }}>
            <StyledImage source={require("@/assets/images/foodDelivery.png")} resizeMode="contain" className="w-full h-auto aspect-auto" />
            <StyledView className="w-[98.5%] h-full bg-white shadow-lg shadow-gray-800 rounded-t-xl z-10 mt-[-5px] p-4 flex-1 justify-center items-center">
                <StyledView className="pt-4 flex-row justify-center items-center gap-3">
                    <AntDesign name="login" size={45} color={light.primaryGray} />
                    <StyledText className=" text-gray-700 font-bold" style={{ fontSize: 25 }}>
                        Log in
                    </StyledText>
                </StyledView>
                <StyledText className=" text-gray-700 font-bold w-full text-left ml-4 mt-6" style={{ fontSize: 20 }}>
                    Choose role
                </StyledText>
                <StyledView className="min-w-full mr-auto flex-row mt-1">
                    <Radio checked={checked} setChecked={setChecked} text1="Log in as User" text2="Log in as Employee" />
                </StyledView>
                <StyledText className=" text-red-600 w-full text-center mt-3 mb-2" style={{ fontSize: 13 }}>
                    {warning}
                </StyledText>
                <Input text={id} setText={setId} placeholder={checked === 'first' ? "Enter email" : "Enter Id"} setWarning={setWarning} keyboardType={!pathname.includes("/admin/riders") ? "email-address" : "default"} />
                <Password password={password} setPassword={setPassword} showPass={showPass} setShowPass={setShowPass} placeholder="Enter password" setWarning={setWarning} />
                <StyledTouchableOpacity
                    className="bg-blue-500 w-full py-[6px] rounded-md mt-3 mb-2"
                    onPress={handleLogin}
                >
                    <StyledText className="text-white text-lg w-full text-center font-bold">Log in</StyledText>
                </StyledTouchableOpacity>
                {checked === "first" &&
                    <StyledView className="flex-row justify-center items-center mt-4 mb-6">
                        <StyledText className="w-full text-center" style={{ fontSize: 15, color: light.primaryGray }}>
                            Don't have an account?{"  "}
                            <StyledText className="text-blue-600 font-bold underline" onPress={() => router.replace("/auth/signup")}>
                                Sign up
                            </StyledText>
                        </StyledText>
                    </StyledView>
                }
            </StyledView>
        </ScrollView>
    );
}

export default Login;
