import { styled } from "nativewind"
import { View, Text } from "react-native"
import React from "react"

const StyledView = styled(View)
const StyledText = styled(Text)

export const StackData = () => {
    return (
        <StyledView className="flex-row justify-center items-center mt-2 w-full flex-wrap">
            <StyledView className='flex-row items-center'>
                <StyledView className='w-3 h-3 rounded-full' style={{ backgroundColor: 'green' }} />
                <StyledText className="text-gray-700 font-bold mx-2" style={{ fontSize: 12 }}>
                    No issues
                </StyledText>
            </StyledView>
            <StyledView className='flex-row items-center'>
                <StyledView className='w-3 h-3 rounded-full' style={{ backgroundColor: 'blue' }} />
                <StyledText className="text-gray-700 font-bold mx-2" style={{ fontSize: 12 }}>
                    Late Delivery
                </StyledText>
            </StyledView>
            <StyledView className='flex-row items-center'>
                <StyledView className='w-3 h-3 rounded-full' style={{ backgroundColor: 'purple' }} />
                <StyledText className="text-gray-700 font-bold mx-2" style={{ fontSize: 12 }}>
                    Complaint
                </StyledText>
            </StyledView>
            <StyledView className='flex-row items-center'>
                <StyledView className='w-3 h-3 rounded-full' style={{ backgroundColor: 'red' }} />
                <StyledText className="text-gray-700 font-bold mx-2" style={{ fontSize: 12 }}>
                    Late & Complaint
                </StyledText>
            </StyledView>
        </StyledView>
    )
}