import { styled } from 'nativewind';
import * as React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { OrderTableType } from '@/scripts/type';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Href, usePathname, useRouter } from 'expo-router';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const OrderTable = ({ data }: { data: OrderTableType[] }) => {
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

export const RatingTable = ({ data, setVisible, setMenuId, ratings }: { data: { id: number, name: string, image: string }[], setVisible: any, setMenuId: any, ratings: { menuId: number, rating: number }[] }) => {
    const getRating = (menuId: number) => {
        const rating = ratings.find((item) => item.menuId === menuId);
        return rating ? rating.rating : 0;
    }

    return (
        <StyledView className='mr-[6px] mb-[20px]'>
            <StyledText className="font-bold py-[5px] text-center text-white mb-1 bg-slate-500 rounded-t-lg" style={{ fontSize: 18 }}>
                Rate Food Items
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
                        Rate
                    </StyledText>
                    {data.map((item) => (
                        <StyledView key={item.id} className='h-[38px] flex-row items-center'>
                            <TouchableOpacity key={item.id} className='' onPress={() => {
                                setMenuId(item.id);
                                setVisible(true);
                            }}>
                                {getRating(item.id) !== 0 &&
                                    <StyledView className='bg-slate-300 pt-[3px] pb-[2px] rounded-[4px] flex-row justify-center items-center w-[65px]'>
                                        <StyledText className="text-gray-700 mb-[1px] mr-[3px] font-bold" style={{ fontSize: 14 }}>
                                            {getRating(item.id).toFixed(1)}
                                        </StyledText>
                                        <FontAwesome name='star' size={16} color={Colors.light.primaryGray} />
                                    </StyledView>
                                }
                                {getRating(item.id) === 0 &&
                                    <StyledText className="bg-slate-300 pt-[3px] pb-[2px] rounded-[4px] text-gray-700 mb-[1px] mr-[3px] font-bold w-[65px] text-center" style={{ fontSize: 14 }}>
                                        Rate
                                    </StyledText>
                                }
                            </TouchableOpacity>
                        </StyledView>
                    ))}
                </StyledView>
            </StyledView>
        </StyledView >
    )
}

export const AdminTable: React.FC<{ data: { image: string, id: string, name: string }[] }> = ({ data }) => {
    const pathname = usePathname()
    const router = useRouter()

    return (
        <StyledView className='mr-[6px] my-[10px]' style={{ width: 430 }}>
            <StyledText className="font-bold py-[5px] text-center text-white mb-1 bg-slate-500 rounded-t-lg" style={{ fontSize: 18 }}>
                {pathname.includes('/admin/restaurants') ? 'All Restaurants' : 'All Riders'}
            </StyledText>
            <StyledView className='flex-row w-full justify-between items-center px-2'>
                <StyledView className='gap-2'>
                    <StyledText className='font-bold text-slate-500 py-1 ml-1' style={{ fontSize: 15 }}>
                        Image
                    </StyledText>
                    {data.map((item) => (
                        <StyledImage
                            key={item.id}
                            source={item.image ? { uri: `data:image/jpeg;base64,${item.image}` } : !pathname.includes('/riders') ? require("@/assets/images/Restaurant.jpeg") : require("@/assets/images/user.png")}
                            alt="logo"
                            className="rounded-lg w-[50px] h-[38px]"
                            resizeMode="cover"
                        />
                    ))}
                </StyledView>
                <StyledView className='gap-2'>
                    <StyledText className='font-bold text-slate-500 py-1' style={{ fontSize: 15 }}>
                        Id
                    </StyledText>
                    {data.map((item) => (
                        <StyledView key={item.id} className='h-[38px] flex-row items-center'>
                            <StyledText className="text-gray-700 mb-1" ellipsizeMode='tail' style={{ maxWidth: 230 }}>
                                {item.id}
                            </StyledText>
                        </StyledView>
                    ))}
                </StyledView>
                <StyledView className='gap-2'>
                    <StyledText className='font-bold text-slate-500 py-1 text-right mr-1' style={{ fontSize: 15 }}>
                        Action
                    </StyledText>
                    {data.map((item) => (
                        <StyledView key={item.id} className='h-[38px] flex-row items-center'>
                            <StyledTouchableOpacity className='bg-blue-500 rounded-md' onPress={() => {
                                router.push(`${pathname}/${item.id}` as Href)
                            }}>
                                <StyledText className="text-white px-2 py-1 font-bold" style={{ fontSize: 11 }}>
                                    Analytics
                                </StyledText>
                            </StyledTouchableOpacity>
                        </StyledView>
                    ))}
                </StyledView>
            </StyledView>
        </StyledView >
    )
}