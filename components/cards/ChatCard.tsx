import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { moderateScale } from 'react-native-size-matters';
import { styled } from 'nativewind';
import ImageView from 'react-native-image-viewing';
import { ChatCardType } from '@/scripts/type';
import { ResizeMode, Video } from 'expo-av';
import Entypo from '@expo/vector-icons/Entypo';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const StyledText = styled(Text)
const StyledImage = styled(Image)
const StyledView = styled(View)

interface ChatCardProps {
    chat: ChatCardType;
    setChatToReact: any;
    setSelectedChat: any;
}

const ChatCard: React.FC<ChatCardProps> = ({ chat, setChatToReact, setSelectedChat }) => {
    const [isReceived, setIsReceived] = useState<boolean | undefined>(undefined);
    const [imageIndex, setImageIndex] = useState(-1);
    const [isVisible, setIsVisible] = useState(false);
    const [shouldPlay, setShouldPlay] = useState<boolean[]>([]);
    const [isMuted, setIsMuted] = useState<boolean[]>([])

    useEffect(() => {
        const setFlag = async () => {
            const token = await AsyncStorage.getItem("token");
            if (token === null || token === undefined) return;
            const userId = jwtDecode(token).sub;
            setIsReceived(chat.senderId === userId);
        }
        setFlag();
    }, []);

    useEffect(() => {
        const temp = new Array<boolean>(chat.files.length).fill(true)
        setShouldPlay(temp)
        setIsMuted(temp)

        setTimeout(() => {
            const temp2 = new Array<boolean>(chat.files.length).fill(false)
            setShouldPlay(temp2)
            setIsMuted(temp2)
        }, 1000)
    }, [chat.files])

    return (
        <View>
            {isReceived !== undefined &&
                <StyledView className={`${!isReceived ? 'flex-row-reverse' : 'flex-row'} items-center gap-2`}>
                    <View>
                        {chat.isEdited && <StyledText className={`${!isReceived ? 'text-right pr-2' : 'pl-2'} mb-[1px] text-gray-700`} style={{ fontSize: 11, marginHorizontal: moderateScale(16, 2) }}>Edited</StyledText>}
                        <View style={[styles.message, isReceived ? styles.isReceived : styles.not_isReceived]}>
                            <View style={[styles.cloud, isReceived ? { backgroundColor: '#dddddd' } : { backgroundColor: '#007aff' }]}>
                                {chat.files.map((file, index) => (
                                    <View key={index}>
                                        {file.fileType.includes('image') &&
                                            <Pressable style={{ marginVertical: 8 }} onPress={() => {
                                                setImageIndex(index)
                                                setIsVisible(true)
                                            }} >
                                                <StyledImage key={file.id} source={{ uri: `data:image/jpeg;base64,${file.data}` }} className='w-[200px] h-[150px] rounded-md' resizeMode='cover' />
                                            </Pressable>
                                        }
                                        {file.fileType.includes('video') && (
                                            <Video
                                                key={file.id}
                                                style={{ marginVertical: 8, width: 200, height: 150, borderRadius: 6 }}
                                                source={{ uri: `data:video/mp4;base64,${file.data}` }}
                                                useNativeControls
                                                resizeMode={ResizeMode.COVER}
                                                isLooping
                                                shouldPlay={shouldPlay[index]}
                                                isMuted={isMuted[index]}
                                            />
                                        )}
                                    </View>
                                ))}
                                <StyledText className={`${isReceived ? 'text-gray-700' : 'text-white'} mt-[1px]`} style={{ fontSize: 16 }}>{chat.message}</StyledText>
                                <View style={[styles.arraoContainer, isReceived ? styles.arrow_left_container : styles.arrow_right_container]}>
                                    <Svg
                                        style={isReceived ? styles.arrowLeft : styles.arrowRight}
                                        width={moderateScale(15.5, 0.6)}
                                        height={moderateScale(17.5, 0.6)}
                                        viewBox="32.484 17.5 15.515 17.5"
                                        enable-background="new 32.485 17.5 15.515 17.5"
                                    >
                                        <Path
                                            d={isReceived ?
                                                'M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z' :
                                                'M48,35c-7-4-6-8.75-6-17.5C28,17.5,29,35,48,35z'}
                                            fill={isReceived ? '#dddddd' : '#007aff'}
                                            x='0'
                                            y='0'
                                        />
                                    </Svg>
                                </View>
                                {chat.reaction !== null &&
                                    <StyledView className={`absolute bottom-[-8px] p-[2px] bg-white rounded-full ${isReceived ? 'right-[-8px]' : 'left-[-8px]'}`}>
                                        {chat.reaction === 'LIKE' && <AntDesign name="like1" size={18} color='#007bff' />}
                                        {chat.reaction === 'DISLIKE' && <AntDesign name="dislike1" size={18} color='#007bff' />}
                                        {chat.reaction === 'LOVE' && <AntDesign name="heart" size={18} color='#ff0000' />}
                                        {chat.reaction === 'SAD' && <MaterialCommunityIcons name="emoticon-cry" size={20} color="#ffcc00" />}
                                        {chat.reaction === 'LAUGH' && <FontAwesome6 name="face-laugh-squint" size={18} color="#ffcc00" />}
                                        {chat.reaction === 'ANGRY' && <MaterialCommunityIcons name="emoticon-angry" size={20} color="#ff9999" />}
                                    </StyledView>
                                }
                            </View>
                        </View>
                        <StyledText className={`${!isReceived ? 'text-right pr-[6px]' : 'pl-[6px]'} mt-[1px] text-gray-700`} style={{ fontSize: 11, marginHorizontal: moderateScale(15, 2) }}>{new Date(chat.timestamp).toLocaleTimeString()}</StyledText>
                        {imageIndex > -1 &&
                            <ImageView
                                images={chat.files.map(image => ({ uri: `data:image/jpeg;base64,${image.data}` }))}
                                imageIndex={imageIndex}
                                visible={isVisible}
                                onRequestClose={() => setIsVisible(false)}
                            />
                        }
                    </View>
                    {isReceived &&
                        <TouchableOpacity onPress={() => setChatToReact(chat.id)} style={{ marginBottom: !chat.isEdited ? 12 : 0 }}>
                            <Entypo name="emoji-happy" size={22} color={Colors.light.primaryGray} />
                        </TouchableOpacity>
                    }
                    {!isReceived &&
                        <TouchableOpacity onPress={() => setSelectedChat(chat)} style={{ marginBottom: !chat.isEdited ? 12 : 0 }}>
                            <Entypo name="dots-three-horizontal" size={22} color={Colors.light.primaryGray} />
                        </TouchableOpacity>
                    }
                </StyledView>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    message: {
        flexDirection: 'column',
        flexWrap: 'wrap',
    },
    isReceived: {
        marginLeft: 20,
    },
    not_isReceived: {
        alignSelf: 'flex-end',
        marginRight: 20,
    },
    cloud: {
        maxWidth: 224,
        padding: 12,
        borderRadius: 15,
        minWidth: 100,
        position: 'relative',
    },
    arraoContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        top: 0,
        left: 0,
        zIndex: -1,
        flex: 1
    },
    arrow_left_container: {
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    arrow_right_container: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    arrowLeft: {
        left: moderateScale(-6, 0.5),
    },
    arrowRight: {
        right: moderateScale(-6, 0.5),
    },
});

export default ChatCard;