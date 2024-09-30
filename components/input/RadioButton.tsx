import React from "react";
import { styled } from "nativewind";
import { Colors } from "@/constants/Colors";
import { usePathname } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import { RadioButton } from 'react-native-paper';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StyledView = styled(View)
const StyledImage = styled(Image)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)
const { light } = Colors

interface RadioProps {
    checked: string;
    setChecked: (checked: string) => void;
}

export const Radio: React.FC<RadioProps> = ({ checked, setChecked }) => {
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