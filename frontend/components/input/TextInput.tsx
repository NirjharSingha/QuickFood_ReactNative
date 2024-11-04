import React from "react";
import { styled } from "nativewind";
import { View, Text, TextInput, KeyboardTypeOptions } from "react-native";


const StyledView = styled(View)
const StyledText = styled(Text)
const StyledInput = styled(TextInput)

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

interface InputGroupProps_1 {
    isEdit: boolean;
    flag: boolean;
    title: string;
    value: string;
    setValue: (value: string) => void;
    placeholder: string;
    setWarning: (value: string) => void;
    keyboardType: KeyboardTypeOptions;
}

export const InputGroup_1: React.FC<InputGroupProps_1> = ({ isEdit, flag, title, value, setValue, placeholder, setWarning, keyboardType = "default" }) => {
    return (
        <StyledView className={`overflow-x-hidden mt-2 ${isEdit ? "flex-row items-center justify-between mr-[6px]" : "flex-1"}`}>
            <StyledText className="pl-1 font-bold mb-[6px] mr-3 text-gray-700" style={{ fontSize: 18 }}>
                {title}:{isEdit && flag && <StyledText className="text-red-500">*</StyledText>}
            </StyledText>
            {isEdit ? (
                <StyledInput
                    className="border-b-[1px] border-gray-400 mb-4 w-[65%] pl-1 outline-none cursor-pointer bg-slate-100"
                    placeholder={placeholder}
                    keyboardType={keyboardType}
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

interface InputGroupProps_2 {
    flag: boolean;
    title: string;
    value: string;
    setValue: (value: string) => void;
    placeholder: string;
    setWarning: (value: string) => void;
    keyboardType: KeyboardTypeOptions;
}

export const InputGroup_2: React.FC<InputGroupProps_2> = ({ flag, title, value, setValue, placeholder, setWarning, keyboardType = "default" }) => {
    return (
        <StyledView className={`overflow-x-hidden mt-2 flex-row items-center justify-between mr-[6px]`}>
            <StyledText className="pl-1 font-bold mb-[6px] mr-3 text-gray-700" style={{ fontSize: 16 }}>
                {title}:{flag && <StyledText className="text-red-500">*</StyledText>}
            </StyledText>
            <StyledInput
                className="border-b-[1px] border-gray-400 mb-4 w-[55%] pl-1 outline-none cursor-pointer bg-white"
                placeholder={placeholder}
                keyboardType={keyboardType}
                value={value}
                style={{ fontSize: 14 }}
                onChangeText={(text) => {
                    setValue(text);
                    setWarning("");
                }}
            />
        </StyledView>
    )
}