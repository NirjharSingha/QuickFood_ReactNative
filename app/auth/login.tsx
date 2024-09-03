import React from "react";
import { Password, Input } from "./signup";
import { styled } from "nativewind";
import { Colors } from "@/constants/Colors";
import { usePathname } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useRouter } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import { RadioButton } from 'react-native-paper';

const StyledView = styled(View)
const StyledImage = styled(Image)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)
const { light } = Colors

interface RadioProps {
    checked: string;
    setChecked: (checked: string) => void;
}

const Radio: React.FC<RadioProps> = ({ checked, setChecked }) => {
    return (
        <StyledView className="flex-1 items-start">
            <StyledView className="flex-row justify-center items-center">
                <RadioButton
                    value="first"
                    status={checked === 'first' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked('first')}
                    color="#3B82F6"
                />
                <StyledText className=" text-gray-700 font-bold" style={{ fontSize: 15 }}>
                    Log in as User
                </StyledText>
            </StyledView>
            <StyledView className="flex-row justify-center items-center">
                <RadioButton
                    value="second"
                    status={checked === 'second' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked('second')}
                    color="#3B82F6"
                />
                <StyledText className=" text-gray-700 font-bold" style={{ fontSize: 15 }}>
                    Log in as Employee
                </StyledText>
            </StyledView>
        </StyledView>
    );
};

const Login = () => {
    const [warning, setWarning] = useState("Invalid username or password");
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [checked, setChecked] = useState('first');
    const pathname = usePathname();
    const router = useRouter();

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
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
                    <Radio checked={checked} setChecked={setChecked} />
                </StyledView>
                <StyledText className=" text-red-600 w-full text-center mt-3 mb-2" style={{ fontSize: 13 }}>
                    {warning}
                </StyledText>
                <Input text={id} setText={setId} placeholder={!pathname.includes("/admin/riders") ? "Enter email" : "Enter rider Id"} setWarning={setWarning} keyboardType={!pathname.includes("/admin/riders") ? "email-address" : "default"} />
                <Password password={password} setPassword={setPassword} showPass={showPass} setShowPass={setShowPass} placeholder="Enter password" setWarning={setWarning} />
                <StyledTouchableOpacity
                    className="bg-blue-500 w-full py-2 rounded-md mt-3 mb-2"
                    onPress={() => router.push("/")}
                >
                    <StyledText className="text-white text-lg w-full text-center font-bold">Log in</StyledText>
                </StyledTouchableOpacity>
                {checked === "first" &&
                    <StyledView className="flex-row justify-center items-center mt-4 mb-6">
                        <StyledText className="w-full text-center" style={{ fontSize: 15, color: light.primaryGray }}>
                            Don't have an account?{"  "}
                            <StyledText className="text-blue-600 font-bold underline" onPress={() => router.push("/auth/signup")}>
                                Sign up
                            </StyledText>
                        </StyledText>
                    </StyledView>
                }
                {checked === "first" &&
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
                }
            </StyledView>
        </ScrollView>
    );
}

export default Login;
