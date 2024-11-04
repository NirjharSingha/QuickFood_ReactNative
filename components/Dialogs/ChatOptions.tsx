import { View, TouchableOpacity, Text } from 'react-native'
import React, { useEffect } from 'react'
import { styled } from 'nativewind'
import { Dialog, Portal } from 'react-native-paper'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ChatCardType } from '@/scripts/type';

const StyledView = styled(View)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledText = styled(Text)

interface EditOrDeleteProps {
    visible: boolean;
    selectedChat: ChatCardType | null;
    setSelectedChat: any;
    handleEdit: any;
    handleDelete: any;
}

export const ChatOptions: React.FC<EditOrDeleteProps> = ({ visible, selectedChat, setSelectedChat, handleEdit, handleDelete }) => {
    const hideDialog = () => {
        setSelectedChat(null)
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog} style={{ backgroundColor: 'white', borderRadius: 12, minWidth: 200, marginHorizontal: 'auto' }}>
                <Dialog.Content>
                    <StyledTouchableOpacity className='flex-row items-center bg-slate-200 px-3 py-[6px] mb-3 rounded-md' onPress={() => handleEdit(selectedChat)}>
                        <StyledView className='mr-[10px]'>
                            <FontAwesome name="pencil" size={24} color="black" />
                        </StyledView>
                        <StyledText className='font-bold' style={{ fontSize: 17 }}>
                            Edit
                        </StyledText>
                    </StyledTouchableOpacity>
                    <StyledTouchableOpacity className='flex-row items-center bg-slate-200 px-3 py-[6px] rounded-md' onPress={handleDelete}>
                        <StyledView className='mr-2'>
                            <MaterialIcons name="delete" size={24} color="black" />
                        </StyledView>
                        <StyledText className='font-bold' style={{ fontSize: 17 }}>
                            Delete
                        </StyledText>
                    </StyledTouchableOpacity>
                </Dialog.Content>
            </Dialog>
        </Portal>
    )
}