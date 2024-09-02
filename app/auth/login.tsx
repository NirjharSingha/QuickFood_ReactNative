import React from "react";
import { Password, Input } from "./signup";
import { styled } from "nativewind";
import Octicons from '@expo/vector-icons/Octicons';
import { Colors } from "@/constants/Colors";
import { usePathname } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useRouter } from "expo-router";

const StyledView = styled(View)
const StyledImage = styled(Image)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)
const { light } = Colors

const Login = () => {
    const [warning, setWarning] = useState("Invalid username or password");
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
            <StyledImage source={require("@/assets/images/foodDelivery.png")} resizeMode="contain" className="w-full h-auto aspect-auto" />
            <StyledView className="w-[98.5%] h-full bg-white shadow-lg shadow-gray-800 rounded-t-xl z-10 mt-[-5px] p-4 flex-1 justify-center items-center">
                <StyledView className="pt-4 flex-row justify-center items-center gap-3">
                    <Octicons name="sign-in" size={45} color={light.primaryGray} />
                    <StyledText className=" text-gray-700 font-bold" style={{ fontSize: 22 }}>
                        Log in
                    </StyledText>
                </StyledView>
                <StyledText className=" text-red-600 w-full text-center mt-2 mb-1" style={{ fontSize: 13 }}>
                    {warning}
                </StyledText>
                <Input text={id} setText={setId} placeholder={!pathname.includes("/admin/riders") ? "Enter email" : "Enter rider Id"} setWarning={setWarning} keyboardType={!pathname.includes("/admin/riders") ? "email-address" : "default"} />
                <Password password={password} setPassword={setPassword} showPass={showPass} setShowPass={setShowPass} placeholder="Enter password" setWarning={setWarning} />
                <StyledTouchableOpacity
                    className="bg-blue-500 w-full py-2 rounded-md"
                    onPress={() => setWarning(id)}
                >
                    <StyledText className="text-white text-lg w-full text-center font-bold">Sign up</StyledText>
                </StyledTouchableOpacity>
                <StyledView className="flex-row justify-center items-center mt-4 mb-4">
                    <StyledText className="w-full text-center" style={{ fontSize: 15, color: light.primaryGray }}>
                        Don't have an account?{"  "}
                        <StyledText className="text-blue-600 font-bold underline" onPress={() => router.push("/auth/signup")}>
                            Sign up
                        </StyledText>
                    </StyledText>
                </StyledView>
                <StyledView className="">
                    <GoogleOAuthProvider clientId={process.env.EXPO_PUBLIC_OAUTH_CLIENT_ID as string}>
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
                    </GoogleOAuthProvider>
                </StyledView>
            </StyledView>
        </ScrollView>
    );
}

export default Login;
