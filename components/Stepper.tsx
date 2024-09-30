import { View, Text } from 'react-native'
import React from 'react'
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)

const Stepper: React.FC<{ step: number }> = ({ step }) => {
    return (
        <StyledView className="ml-1 mb-3 w-[474px] bg-slate-100 shadow-sm shadow-gray-300 rounded-md">
            <StyledView className="flex-row justify-between items-center pt-3 pl-7 pr-7 pb-1">
                <StyledView className={`flex-row justify-center items-center ${step >= 0 ? "bg-green-600 text-white" : "bg-slate-200"} rounded-full w-8 h-8`}>
                    <StyledText className='font-bold' style={{ fontSize: 13 }}>
                        1
                    </StyledText>
                </StyledView>
                <StyledView className={`h-[3px] ${step >= 1 ? "bg-green-500" : "bg-gray-400"} rounded`} style={{ width: 96.67 }} />
                <StyledView className={`justify-center items-center ${step >= 1 ? "bg-green-600 text-white" : "bg-slate-200"} rounded-full w-8 h-8`}>
                    <StyledText className='font-bold' style={{ fontSize: 13 }}>
                        2
                    </StyledText>
                </StyledView>
                <StyledView className={`h-[3px] ${step >= 2 ? "bg-green-500" : "bg-gray-400"} rounded`} style={{ width: 96.67 }} />
                <StyledView className={`flex-row justify-center items-center ${step >= 2 ? "bg-green-600 text-white" : "bg-slate-200"} rounded-full w-8 h-8`}>
                    <StyledText className={`font-bold`} style={{ fontSize: 13 }}>
                        3
                    </StyledText>
                </StyledView>
                <StyledView className={`h-[3px] ${step >= 3 ? "bg-green-500" : "bg-gray-400"} rounded`} style={{ width: 96.67 }} />
                <StyledView className={`flex-row justify-center items-center ${step >= 3 ? "bg-green-600 text-white" : "bg-slate-200"} rounded-full w-8 h-8`}>
                    <StyledText className={`font-bold`} style={{ fontSize: 13 }}>
                        4
                    </StyledText>
                </StyledView>
            </StyledView>
            <StyledView className="flex-row justify-between p-3 px-0 pt-0">
                <StyledText className={`flex-row justify-center items-center rounded-sm w-[90px] ${step >= 0 ? "text-gray-800" : "text-gray-400"} text-center`} style={{ fontSize: 12 }}>
                    Order{'\n'}Placed
                </StyledText>
                <StyledText className={`flex-row justify-center items-center rounded-sm w-[90px] ${step >= 1 ? "text-gray-800" : "text-gray-400"} text-center`} style={{ fontSize: 12 }}>
                    Delivery{'\n'}Received
                </StyledText>
                <StyledText className={`flex-row justify-center items-center rounded-sm w-[90px] ${step >= 2 ? "text-gray-800" : "text-gray-400"} text-center`} style={{ fontSize: 12 }}>
                    Customer{'\n'}Notified
                </StyledText>
                <StyledText className={`flex-row justify-center items-center rounded-sm w-[90px] ${step >= 3 ? "text-gray-800" : "text-gray-400"} text-center`} style={{ fontSize: 12 }}>
                    Delivery{'\n'}Complete
                </StyledText>
            </StyledView>
        </StyledView>
    );
};

export default Stepper