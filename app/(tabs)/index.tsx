import { View, Text } from 'react-native'
import React from 'react'
import Header from "@/components/Header";
import { styled } from 'nativewind';

const index = () => {
    const StyledView = styled(View);

    return (
        <View>
            <StyledView className="bg-[#D6C5B7] px-2 py-1 flex-row justify-between items-center w-full">
                <Header />
            </StyledView>
            <Text>Index</Text>
        </View>
    )
}

export default index