import { View, TextInput, Pressable, TextInputSelectionChangeEventData, NativeSyntheticEvent } from 'react-native'
import React, { useState } from 'react'
import { styled } from 'nativewind';
import { Colors } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import Emoji from '../Emoji';

const StyledView = styled(View);
const StyledInput = styled(TextInput)
const StyledPressable = styled(Pressable)

interface ChatInputProps {
    inputValue: string;
    setInputValue: (text: string) => void;
    uploadFiles: any;
    handleSubmit: any;
}

const ChatInput: React.FC<ChatInputProps> = ({ inputValue, setInputValue, uploadFiles, handleSubmit }) => {
    const [cursorPosition, setCursorPosition] = useState(0);
    const handleSelectionChange = (event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
        const { selection } = event.nativeEvent;
        setCursorPosition(selection.start);
    };

    return (
        <View>
            <StyledView className="flex-row w-full px-2 items-center">
                <Emoji inputValue={inputValue} setInputValue={setInputValue} cursorPosition={cursorPosition} setCursorPosition={setCursorPosition} flag={true} />
                <StyledInput
                    className={`flex-1 bg-white h-[31px] border-[1px] border-solid border-gray-500 border-r-0 border-l-0 focus:border-gray-500 focus:outline-none`}
                    placeholder="Type a message"
                    value={inputValue}
                    onChangeText={(text) => {
                        setInputValue(text)
                        setCursorPosition((prev: number) => prev + 1);
                    }}
                    onSelectionChange={handleSelectionChange}
                />
                <StyledPressable className="h-[31px] bg-white border-[1px] border-solid border-gray-500 flex-row justify-center items-center rounded-r-full border-l-0 pr-[4] pl-[1px] mr-2" onPress={uploadFiles}>
                    <Ionicons name="attach-sharp" size={22} color={Colors.light.primaryGray} />
                </StyledPressable>
                <Ionicons name="send-sharp" size={24} color={'blue'} onPress={() => handleSubmit(inputValue)} />
            </StyledView>
        </View>
    )
}

export default ChatInput