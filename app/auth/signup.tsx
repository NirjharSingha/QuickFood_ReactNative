import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Animated } from "react-native";
import { Image } from "react-native";
import { styled } from "nativewind";
import Octicons from '@expo/vector-icons/Octicons';
import { Colors } from "@/constants/Colors";
import { usePathname } from "expo-router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "expo-router";

const StyledView = styled(View)
const StyledImage = styled(Image)
const StyledText = styled(Text)
const StyledInput = styled(TextInput)
const StyledTouchableOpacity = styled(TouchableOpacity)
const { light } = Colors

interface PasswordProps {
    password: string;
    setPassword: (password: string) => void;
    showPass: boolean;
    setShowPass: (showPass: boolean) => void;
    placeholder: string;
    setWarning: (text: string) => void;
}

interface InoutProps {
    text: string;
    setText: (text: string) => void;
    placeholder: string;
    setWarning: (text: string) => void;
    keyboardType: "email-address" | "default";
}

export const Input: React.FC<InoutProps> = ({ text, setText, placeholder, setWarning, keyboardType }) => {
    return (
        <StyledInput
            keyboardType={keyboardType}
            className={`indent-3 border-b-[1px] border-b-gray-400 w-full mb-4 outline-none p-1  cursor-pointer bg-white`}
            placeholder={placeholder}
            value={text}
            onChangeText={(value) => {
                setText(value)
                setWarning("")
            }}
        />
    )
}

export const Password: React.FC<PasswordProps> = ({ password, setPassword, showPass, setShowPass, placeholder, setWarning }) => {
    return (
        <StyledView className="p-1 flex-row justify-between indent-3 bg-white border-b-[1px] border-b-gray-400 mb-4 min-w-full">
            <StyledView className="w-[90%]">
                <StyledInput
                    keyboardType="default"
                    className="indent-3 border-none outline-none cursor-pointer bg-white w-full"
                    placeholder={placeholder}
                    secureTextEntry={!showPass} // Toggle visibility with a state variable
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        setWarning("")
                    }}
                />
            </StyledView>
            {!showPass && (
                <Octicons name="eye" size={22} color={light.primaryGray} style={{ cursor: "pointer" }} onPress={() => setShowPass(true)} />
            )}
            {showPass && (
                <Octicons name="eye-closed" size={22} color={light.primaryGray} style={{ cursor: "pointer" }} onPress={() => setShowPass(false)} />
            )}
        </StyledView>
    )
}

const Signup = () => {
    const [warning, setWarning] = useState("Invalid username or password");
    const [id, setId] = useState("");
    const [username, setUsername] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const translateYValue = useRef(new Animated.Value(600)).current; // Start from below the screen

    useEffect(() => {
        Animated.timing(translateYValue, {
            toValue: 0, // End at its normal position
            duration: 1500, // Animation duration: 3 seconds
            useNativeDriver: true,
        }).start();
    }, [translateYValue]);

    return (
        <ScrollView className="min-h-full bg-white" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", }}>
            <StyledImage source={require("@/assets/images/foodDelivery.png")} resizeMode="contain" className="w-full h-auto aspect-auto" />
            <Animated.View className={"w-full"}
                style={{
                    transform: [{ translateY: translateYValue }],
                }}
            >
                <StyledView className="w-full h-full bg-white shadow-lg shadow-gray-800 rounded-t-3xl z-10 mt-[-10px] p-4 border-t-[1px] border-t-gray-400">
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
                        className="bg-blue-500 w-full py-2 rounded-md mt-2 mb-1"
                        onPress={() => router.push("/home")}
                    >
                        <StyledText className="text-white text-lg w-full text-center font-bold">Sign up</StyledText>
                    </StyledTouchableOpacity>
                    <StyledView className="flex-row justify-center items-center mt-4 mb-5">
                        <StyledText className="w-full text-center" style={{ fontSize: 15, color: light.primaryGray }}>
                            Already have an account?{"  "}
                            <StyledText className="text-blue-600 font-bold underline" onPress={() => router.push("/auth/login")}>
                                Log in
                            </StyledText>
                        </StyledText>
                    </StyledView>
                    <StyledView className="">
                        {/* <GoogleOAuthProvider clientId={process.env.EXPO_PUBLIC_OAUTH_CLIENT_ID as string}>
                        <GoogleLogin
                            onSuccess={(credentialResponse) => {
                                const details = jwtDecode(credentialResponse.credential as string);
                                console.log(details);
                                // handleGoogleAuth(details);
                            }}
                            onError={() => {
                                console.log("Failed");
                            }}
                        />
                    </GoogleOAuthProvider> */}
                    </StyledView>
                </StyledView>
            </Animated.View>
        </ScrollView>
    );
}

export default Signup;