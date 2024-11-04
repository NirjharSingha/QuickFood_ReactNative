import { View, Text, Image, ScrollView } from 'react-native'
import React from 'react'
import Header from "@/components/Header";
import { styled } from 'nativewind';
import CarouselItem1 from '@/assets/images/CarouselItem1.jpg';
import CarouselItem2 from '@/assets/images/CarouselItem2.jpg';
import CarouselItem3 from '@/assets/images/CarouselItem3.jpg';
import CarouselItem4 from '@/assets/images/CarouselItem4.jpg';
import CarouselItem5 from '@/assets/images/CarouselItem5.jpg';
import CarouselItem6 from '@/assets/images/CarouselItem6.jpg';
import CarouselItem7 from '@/assets/images/CarouselItem7.jpg';
import CarouselItem8 from '@/assets/images/CarouselItem8.jpg';
import CarouselItem9 from '@/assets/images/CarouselItem9.jpg';
import CarouselItem10 from '@/assets/images/CarouselItem10.jpg';
import CarouselItem11 from '@/assets/images/CarouselItem11.jpg';
import CarouselItem12 from '@/assets/images/CarouselItem12.jpg';
import CarouselItem13 from '@/assets/images/CarouselItem13.jpg';
import CarouselItem14 from '@/assets/images/CarouselItem14.jpg';
import CarouselItem15 from '@/assets/images/CarouselItem15.jpg';
import CarouselItem16 from '@/assets/images/CarouselItem16.jpg';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';

const home = () => {
    const StyledView = styled(View);
    const StyledText = styled(Text);
    const StyledImage = styled(Image)
    const StyledScrollView = styled(ScrollView)

    const carouselItems = [
        CarouselItem1,
        CarouselItem2,
        CarouselItem3,
        CarouselItem4,
        CarouselItem5,
        CarouselItem6,
        CarouselItem7,
        CarouselItem8,
        CarouselItem9,
        CarouselItem10,
        CarouselItem11,
        CarouselItem12,
        CarouselItem13,
        CarouselItem14,
        CarouselItem15,
        CarouselItem16,
    ];

    return (
        <StyledView className='w-full h-full'>
            <StyledView className="bg-[#D6C5B7] px-3 py-1 flex-row justify-between items-center w-full">
                <Header />
            </StyledView>
            <StyledScrollView className="w-screen bg-orange-50" showsVerticalScrollIndicator={false}>
                <StyledView className="bg-orange-50 flex flex-col-reverse md:flex-row items-center justify-around">
                    <StyledView className="flex flex-col justify-center items-center">
                        <StyledText className="w-full text-center text-gray-700 font-bold" style={{ fontSize: 36 }}>
                            QuickFood
                        </StyledText>
                        <StyledText className="w-full text-center text-gray-700 font-bold mt-2" style={{ fontSize: 20 }}>
                            From Order to Door
                        </StyledText>
                        <StyledText className="w-full text-center text-gray-700 font-bold mb-4" style={{ fontSize: 20 }}>
                            in Minutes
                        </StyledText>
                        <StyledText className="w-full text-center p-2 pl-4 pr-4 text-gray-700">
                            We offer fastest delivery in the city{"\n"}ensuring the quality of the food.
                        </StyledText>
                    </StyledView>
                    <StyledImage source={require("@/assets/images/Food_Delivery.png")} resizeMode="contain" className="w-[98%] h-auto mx-auto" />
                </StyledView>
                <StyledText className="bg-orange-50 p-4 w-full text-center text-gray-700 font-bold mt-4" style={{ fontSize: 20 }}>
                    How We Serve You
                </StyledText>
                <StyledImage source={require("@/assets/images/service.png")} resizeMode='contain' className="w-[98%] h-auto mx-auto" />
                <StyledText className="bg-orange-50 p-4 w-full text-center text-gray-700 font-bold mt-3" style={{ fontSize: 20 }}>
                    Our Trending Items
                </StyledText>
                <StyledScrollView horizontal={true} showsHorizontalScrollIndicator={false} className='min-w-full bg-white gap-3 h-[215px] overflow-hidden' style={{ marginBottom: 12, paddingBottom: 12, paddingHorizontal: 8 }}>
                    {carouselItems.map((item, index) => (
                        <StyledImage key={index} source={item} className={`w-[250px] h-[190px] rounded-lg ${index === 15 ? "mr-[18px]" : ""}`} resizeMode='cover' />
                    ))}
                </StyledScrollView>
                <StyledView className='flex-row items-center mt-4 ml-6'>
                    <StyledView className='flex-row justify-center items-center rounded-full border-[3px] border-red-400 p-[10px]'>
                        <MaterialIcons name="delivery-dining" size={32} color="red" />
                    </StyledView>
                    <StyledView className='flex-1 ml-4'>
                        <StyledText className='text-gray-700 font-bold mb-[2px]' style={{ fontSize: 18 }}>
                            Fast Delivery
                        </StyledText>
                        <StyledText className='text-gray-700'>
                            We promise to deliver within 30 minutes
                        </StyledText>
                    </StyledView>
                </StyledView>
                <StyledView className='flex-row items-center mt-4 ml-6'>
                    <StyledView className='flex-row justify-center items-center rounded-full border-[3px] border-green-400 p-[10px]'>
                        <Entypo name="shopping-bag" size={32} color="green" />
                    </StyledView>
                    <StyledView className='flex-1 ml-4'>
                        <StyledText className='text-gray-700 font-bold mb-[2px]' style={{ fontSize: 18 }}>
                            Pickup
                        </StyledText>
                        <StyledText className='text-gray-700'>
                            Pickup your order from doorsteps
                        </StyledText>
                    </StyledView>
                </StyledView>
                <StyledView className='flex-row items-center mt-4 ml-6 mb-6'>
                    <StyledView className='flex-row justify-center items-center rounded-full border-[3px] border-yellow-400 p-[10px]'>
                        <MaterialIcons name="local-restaurant" size={32} color="yellow" />
                    </StyledView>
                    <StyledView className='flex-1 ml-4'>
                        <StyledText className='text-gray-700 font-bold mb-[2px]' style={{ fontSize: 18 }}>
                            Dine In
                        </StyledText>
                        <StyledText className='text-gray-700'>
                            Enjoy your food fresh crispy and hot
                        </StyledText>
                    </StyledView>
                </StyledView>
            </StyledScrollView>
        </StyledView>
    )
}

export default home