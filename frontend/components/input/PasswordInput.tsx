import React from "react";
import { View, TextInput } from "react-native";
import { styled } from "nativewind";
import Octicons from '@expo/vector-icons/Octicons';
import { Colors } from "@/constants/Colors";

const StyledView = styled(View)
const StyledInput = styled(TextInput)
const { light } = Colors

interface PasswordProps {
    password: string;
    setPassword: (password: string) => void;
    showPass: boolean;
    setShowPass: (showPass: boolean) => void;
    placeholder: string;
    setWarning: (text: string) => void;
}

export const Password: React.FC<PasswordProps> = ({ password, setPassword, showPass, setShowPass, placeholder, setWarning }) => {
    return (
        <StyledView className="p-1 flex-row justify-between items-center indent-3 bg-white border-b-[1px] border-b-gray-400 mb-4 min-w-full">
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