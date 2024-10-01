import React from "react";
import { styled } from "nativewind";
import { View, Text } from "react-native";
import { RadioButton } from 'react-native-paper';

const StyledView = styled(View)
const StyledText = styled(Text)

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