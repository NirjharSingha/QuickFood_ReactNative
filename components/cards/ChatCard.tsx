import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { moderateScale } from 'react-native-size-matters';
import { styled } from 'nativewind';
import ImageView from 'react-native-image-viewing';
import { ChatCardType } from '@/scripts/type';
import { Video } from 'expo-av';

const StyledText = styled(Text)
const StyledImage = styled(Image)


const ChatCard: React.FC<{ chat: ChatCardType }> = ({ chat }) => {
    const [mine] = useState(true);
    const [imageIndex, setImageIndex] = useState(-1);
    const [isVisible, setIsVisible] = useState(false);

    return (
        <View style={[styles.message, mine ? styles.mine : styles.not_mine]}>
            <StyledText className={`${!mine ? 'text-right pr-2' : 'pl-2'} mb-[1px] text-gray-700`} style={{ fontSize: 11 }}>Edited</StyledText>
            <View style={[styles.cloud, mine ? { backgroundColor: '#dddddd' } : { backgroundColor: '#007aff' }]}>
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
                            />
                        )}
                    </View>
                ))}
                <StyledText className={`${mine ? 'text-gray-700' : 'text-white'} mt-[1px]`} style={{ fontSize: 16 }}>{chat.message}</StyledText>
                <View style={[styles.arraoContainer, mine ? styles.arrow_left_container : styles.arrow_right_container]}>
                    <Svg
                        style={mine ? styles.arrowLeft : styles.arrowRight}
                        width={moderateScale(15.5, 0.6)}
                        height={moderateScale(17.5, 0.6)}
                        viewBox="32.484 17.5 15.515 17.5"
                        enable-background="new 32.485 17.5 15.515 17.5"
                    >
                        <Path
                            d={mine ?
                                'M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z' :
                                'M48,35c-7-4-6-8.75-6-17.5C28,17.5,29,35,48,35z'}
                            fill={mine ? '#dddddd' : '#007aff'}
                            x='0'
                            y='0'
                        />
                    </Svg>
                </View>
            </View>
            <StyledText className={`${!mine ? 'text-right pr-[6px]' : 'pl-[6px]'} mt-[1px] text-gray-700`} style={{ fontSize: 11 }}>12:10:43 PM</StyledText>
            {imageIndex > -1 &&
                <ImageView
                    images={chat.files.map(image => ({ uri: `data:image/jpeg;base64,${image.data}` }))}
                    imageIndex={imageIndex}
                    visible={isVisible}
                    onRequestClose={() => setIsVisible(false)}
                />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    message: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        marginVertical: moderateScale(7, 2),
    },
    mine: {
        marginLeft: 20,
    },
    not_mine: {
        alignSelf: 'flex-end',
        marginRight: 20,
    },
    cloud: {
        maxWidth: moderateScale(200, 2),
        paddingHorizontal: moderateScale(10, 2),
        paddingTop: moderateScale(7, 2),
        paddingBottom: moderateScale(7, 2),
        borderRadius: 15,
        minWidth: 100,
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
