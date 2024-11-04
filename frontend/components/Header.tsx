import { View, Text, Image } from 'react-native';
import React from 'react';
import { styled } from 'nativewind';
import FavIcon from '@/assets/images/favicon.png';

// Styled components using NativeWind
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

const Header = () => {
    return (
        <StyledView className="flex-row justify-center items-center">
            <StyledView className="rounded-full mr-2 border-[1px] border-solid border-white p-[6px] bg-yellow-50">
                <StyledImage source={FavIcon} style={{ width: 28, height: 28 }} />
            </StyledView>
            <StyledText className="text-xl text-gray-700 font-bold">
                QuickFood
            </StyledText>
        </StyledView>
    );
};

export default Header;
