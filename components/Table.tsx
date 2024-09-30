import { styled } from 'nativewind';
import * as React from 'react';
import { Image, View } from 'react-native';
import { Text } from 'react-native-paper';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

export type DataType = {
    id: number
    name: string
    price: number
    image: string
    quantity: number
}

export const OrderTable = ({ data }: { data: DataType[] }) => {
    return (
        <StyledView className='mr-[6px] mb-[20px]'>
            <StyledText className="font-bold py-[5px] text-center text-white mb-1 bg-slate-500 rounded-t-lg" style={{ fontSize: 18 }}>
                Ordered Items
            </StyledText>
            <StyledView className='flex-row w-full justify-between items-center px-2'>
                <StyledView className='gap-2'>
                    <StyledText className='font-bold text-slate-500 py-1' style={{ fontSize: 15 }}>
                        Image
                    </StyledText>
                    {data.map((item) => (
                        <StyledImage
                            key={item.id}
                            source={item.image ? { uri: `data:image/jpeg;base64,${item.image}` } : require("@/assets/images/Menu.jpg")}
                            alt="logo"
                            className="rounded-lg w-[50px] h-[38px]"
                            resizeMode="cover"
                        />
                    ))}
                </StyledView>
                <StyledView className='gap-2'>
                    <StyledText className='font-bold text-slate-500 py-1' style={{ fontSize: 15 }}>
                        Name
                    </StyledText>
                    {data.map((item) => (
                        <StyledView key={item.id} className='h-[38px] flex-row items-center'>
                            <StyledText className="text-gray-700 mb-1" ellipsizeMode='tail' style={{ maxWidth: 240 }}>
                                {item.name}
                            </StyledText>
                        </StyledView>
                    ))}
                </StyledView>
                <StyledView className='gap-2'>
                    <StyledText className='font-bold text-slate-500 py-1'>
                        Price
                    </StyledText>
                    {data.map((item) => (
                        <StyledView key={item.id} className='h-[38px] flex-row items-center' >
                            <StyledText className="text-gray-700 mb-1">
                                {item.price}
                            </StyledText>
                        </StyledView>
                    ))}
                </StyledView>
                <StyledView className='gap-2'>
                    <StyledText className='font-bold text-slate-500 py-1' style={{ fontSize: 15 }}>
                        Quantity
                    </StyledText>
                    {data.map((item) => (
                        <StyledView key={item.id} className='h-[38px] flex-row items-center justify-end pr-1'>
                            <StyledText className="text-gray-700 mb-1">
                                {item.quantity}
                            </StyledText>
                        </StyledView>
                    ))}
                </StyledView>
            </StyledView>
        </StyledView >
    );
}