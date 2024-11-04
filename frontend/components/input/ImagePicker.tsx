import React from "react";
import { styled } from "nativewind";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from 'react-native-paper';

const StyledView = styled(View);
const StyledText = styled(Text);

interface CustomImagePickerProps {
    uploadImage: any;
    imgStream: string;
}

export const CustomImagePicker: React.FC<CustomImagePickerProps> = ({ uploadImage, imgStream }) => {
    return (
        <TouchableOpacity onPress={uploadImage}>
            <StyledView className="w-full flex-row justify-center items-center mb-1 mt-4">
                <StyledView
                    className="max-w-[210px] flex-row cursor-pointer rounded-full border-[1px] border-gray-900 overflow-hidden"
                >
                    <StyledText className="w-[46%] py-[2px] h-full bg-slate-600 text-white flex-row justify-center items-center text-center" style={{ fontSize: 12 }}>
                        Choose image
                    </StyledText>
                    <StyledText className="w-[54%] py-[2px] h-full text-gray-700 flex-row justify-center items-center text-center" style={{ fontSize: 12 }}>
                        {imgStream === "" ? "No image chosen" : "Image chosen"}
                    </StyledText>
                </StyledView>
            </StyledView>
        </TouchableOpacity>
    )
}

interface ImageInputProps {
    uploadImage: any;
    imgStream: string;
}

export const ImageInput: React.FC<ImageInputProps> = ({ imgStream, uploadImage }) => {
    return (
        <StyledView className={`overflow-x-hidden mt-4 flex-row items-center justify-between mr-[6px]`}>
            <StyledText className="pl-1 font-bold mb-[6px] mr-3 text-gray-700" style={{ fontSize: 16 }}>
                Image:
            </StyledText>
            <TouchableOpacity className='w-[55%] bg-slate-500 rounded-md' onPress={uploadImage}>
                <StyledView className="w-full flex-row justify-center items-center">
                    <StyledView className="py-[3px] w-full flex-row justify-center items-center cursor-pointer rounded-md border-[1px] border-gray-900 overflow-hidden">
                        <StyledText className="mr-1 h-full text-white flex-row justify-center items-center text-center font-bold mb-[1.5px]" style={{ fontSize: 14 }}>
                            {imgStream === "" ? "No image" : "Image chosen"}
                        </StyledText>
                        <Icon
                            source="camera"
                            color={'white'}
                            size={17}
                        />
                    </StyledView>
                </StyledView>
            </TouchableOpacity>
        </StyledView>
    )
}