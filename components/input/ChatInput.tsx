import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { styled } from 'nativewind';
import { Entypo } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledInput = styled(TextInput)

const ChatInput = () => {
    return (
        <View>
            <StyledView className="flex-row w-full px-2">
                <StyledTouchableOpacity className="h-[33px] bg-white border-[1px] border-solid border-gray-500 flex-row justify-center items-center rounded-l-full border-r-0 pl-2 pr-[6px]">
                    <Entypo name="emoji-happy" size={20} color={Colors.light.primaryGray} />
                </StyledTouchableOpacity>
                <StyledInput
                    className={`flex-1 bg-white h-[33px] border-[1px] border-solid border-gray-500 border-r-0 border-l-0 focus:border-gray-500 focus:outline-none`}
                    placeholder="Type a message"
                // value={inputValue}
                // onChangeText={(text) => handleInputChange(text)}
                />
                <StyledTouchableOpacity className="h-[33px] bg-white border-[1px] border-solid border-gray-500 flex-row justify-center items-center rounded-r-full border-l-0 pr-[4] pl-[1px]">
                    <Ionicons name="attach-sharp" size={22} color={Colors.light.primaryGray} />
                </StyledTouchableOpacity>
            </StyledView>
        </View>
    )
}

export default ChatInput