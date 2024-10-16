"use client";

import { styled } from "nativewind";
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView)
const StyledPressable = styled(Pressable)

const emojis = [
    ["\u{1F600}", // Grinning Face
        "\u{1F601}", // Grinning Face with Smiling Eyes
        "\u{1F602}", // Face with Tears of Joy
        "\u{1F603}", // Smiling Face with Open Mouth
        "\u{1F604}",], // Smiling Face with Open Mouth and Smiling Eyes
    ["\u{1F605}", // Smiling Face with Open Mouth and Cold Sweat
        "\u{1F606}", // Smiling Face with Open Mouth and Tightly-Closed Eyes
        "\u{1F607}", // Smiling Face with Halo
        "\u{1F608}", // Smiling Face with Horns
        "\u{1F609}",], // Winking Face
    ["\u{1F60A}", // Smiling Face with Smiling Eyes
        "\u{1F60B}", // Face Savouring Delicious Food
        "\u{1F60C}", // Relieved Face
        "\u{1F60D}", // Smiling Face with Heart-Shaped Eyes
        "\u{1F60E}",], // Smiling Face with Sunglasses
    ["\u{1F60F}", // Smirking Face
        "\u{1F610}", // Neutral Face
        "\u{1F611}", // Expressionless Face
        "\u{1F612}", // Unamused Face
        "\u{1F613}",], // Face with Cold Sweat
    ["\u{1F614}", // Pensive Face
        "\u{1F615}", // Confused Face
        "\u{1F616}", // Confounded Face
        "\u{1F617}", // Kissing Face
        "\u{1F618}",], // Face Throwing a Kiss
    ["\u{1F619}", // Kissing Face with Smiling Eyes
        "\u{1F61A}", // Kissing Face with Closed Eyes
        "\u{1F61B}", // Face with Stuck-Out Tongue
        "\u{1F61C}", // Face with Stuck-Out Tongue and Winking Eye
        "\u{1F61D}",], // Face with Stuck-Out Tongue and Tightly-Closed Eyes
    ["\u{1F61E}", // Disappointed Face
        "\u{1F61F}", // Worried Face
        "\u{1F620}", // Angry Face
        "\u{1F621}", // Pouting Face
        "\u{1F622}",], // Crying Face
    ["\u{1F623}", // Persevering Face
        "\u{1F624}", // Face with Look of Triumph
        "\u{1F625}", // Disappointed but Relieved Face
        "\u{1F626}", // Frowning Face with Open Mouth
        "\u{1F627}",], // Anguished Face
    ["\u{1F628}", // Fearful Face
        "\u{1F629}", // Weary Face
        "\u{1F62A}", // Sleepy Face
        "\u{1F62B}", // Tired Face
        "\u{1F62C}",], // Grimacing Face
    ["\u{1F62D}", // Loudly Crying Face
        "\u{1F62E}", // Face with Open Mouth
        "\u{1F62F}", // Hushed Face
        "\u{1F630}", // Face with Open Mouth and Cold Sweat
        "\u{1F631}",], // Face Screaming in Fear
    ["\u{1F633}", // Flushed Face
        "\u{1F634}", // Sleeping Face
        "\u{1F635}", // Dizzy Face
        "\u{1F636}", // Face Without Mouth
        "\u{1F637}",] // Face with Medical Mask
];

const EmojiPicker: React.FC<{ handleEmojiClick: any }> = ({ handleEmojiClick }) => {
    return (
        <StyledScrollView className="absolute bottom-[105%] left-[11px] w-48 h-44 bg-white rounded-md z-10 p-2" showsVerticalScrollIndicator={false}>
            {emojis.map((emojiRow, index) => (
                <View key={index}>
                    <StyledView className="flex-row justify-between">
                        {emojiRow.map((emoji, i) => (
                            <TouchableOpacity key={i} onPress={() => handleEmojiClick(emoji)}>
                                <StyledText className="text-center" style={{ fontSize: 20 }}>{emoji}</StyledText>
                            </TouchableOpacity>
                        ))}
                    </StyledView>
                    {index === emojis.length - 1 && <StyledView className="mt-3" />}
                </View>
            ))}
        </StyledScrollView>
    );
}

interface EmojiProps {
    inputValue: string;
    setInputValue: any;
    cursorPosition: number;
    setCursorPosition: any;
}

const Emoji: React.FC<EmojiProps> = ({ inputValue, setInputValue, cursorPosition, setCursorPosition }) => {
    const [showEmoji, setShowEmoji] = useState(false);

    const handleEmojiClick = (emoji: any) => {
        const text = inputValue.slice(0, cursorPosition) + emoji + inputValue.slice(cursorPosition);
        setInputValue(text);
        setCursorPosition((prev: number) => prev + 2);
    };

    return (
        <View style={{ position: 'relative' }}>
            {showEmoji && <EmojiPicker handleEmojiClick={handleEmojiClick} />}
            <StyledPressable className="h-[31px] bg-white border-[1px] border-solid border-gray-500 flex-row justify-center items-center rounded-l-full border-r-0 pl-2 pr-[6px]" onPress={() => {
                setShowEmoji((prev: boolean) => !prev);
            }}>
                <Entypo name="emoji-happy" size={20} color={Colors.light.primaryGray} />
            </StyledPressable>
        </View>
    );
};

export default Emoji;