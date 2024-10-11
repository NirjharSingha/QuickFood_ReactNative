import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { styled } from 'nativewind'
import { Dialog, Portal } from 'react-native-paper'
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const StyledView = styled(View)
const StyledTouchableOpacity = styled(TouchableOpacity)

interface LikesProps {
    visible: boolean;
    setChatToReact: (value: number) => void;
    prevReaction: string | null;
    handleReaction: any
}

export const Likes: React.FC<LikesProps> = ({ visible, setChatToReact, prevReaction, handleReaction }) => {
    const hideDialog = () => {
        setChatToReact(0)
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog} style={{ backgroundColor: 'white', borderRadius: 12 }}>
                <Dialog.Content>
                    <StyledView className='flex-row justify-between items-center'>
                        <StyledTouchableOpacity onPress={() => handleReaction('LIKE')} className={prevReaction === 'LIKE' ? 'p-2 rounded-lg bg-slate-200' : ''}>
                            <AntDesign name="like1" size={26} color='#007bff' />
                        </StyledTouchableOpacity>
                        <StyledTouchableOpacity onPress={() => handleReaction('DISLIKE')} className={prevReaction === 'DISLIKE' ? 'p-2 rounded-lg bg-slate-200' : ''}>
                            <AntDesign name="dislike1" size={26} color='#007bff' />
                        </StyledTouchableOpacity>
                        <StyledTouchableOpacity onPress={() => handleReaction('LOVE')} className={prevReaction === 'LOVE' ? 'p-2 rounded-lg bg-slate-200' : ''}>
                            <AntDesign name="heart" size={26} color='#ff0000' />
                        </StyledTouchableOpacity>
                        <StyledTouchableOpacity onPress={() => handleReaction('SAD')} className={prevReaction === 'SAD' ? 'p-2 rounded-lg bg-slate-200' : ''}>
                            <MaterialCommunityIcons name="emoticon-cry" size={30} color="#ffcc00" />
                        </StyledTouchableOpacity>
                        <StyledTouchableOpacity onPress={() => handleReaction('LAUGH')} className={prevReaction === 'LAUGH' ? 'p-2 rounded-lg bg-slate-200' : ''}>
                            <FontAwesome6 name="face-laugh-squint" size={26} color="#ffcc00" />
                        </StyledTouchableOpacity>
                        <StyledTouchableOpacity onPress={() => handleReaction('ANGRY')} className={prevReaction === 'ANGRY' ? 'p-2 rounded-lg bg-slate-200' : ''}>
                            <MaterialCommunityIcons name="emoticon-angry" size={30} color="#ff9999" />
                        </StyledTouchableOpacity>
                    </StyledView>
                </Dialog.Content>
            </Dialog>
        </Portal>
    )
}
