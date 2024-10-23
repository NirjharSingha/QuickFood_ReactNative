import { ChatCardType, ChatFileType } from '@/scripts/type';
import React, { useEffect, useState } from 'react';
import { View, Modal, StyleSheet, ScrollView, Text, TouchableOpacity, NativeSyntheticEvent, TextInputSelectionChangeEventData, TextInput, Image } from 'react-native';
import { styled } from 'nativewind';
import { Button } from 'react-native-paper';
import Emoji from './Emoji';
import { ResizeMode, Video } from 'expo-av';

interface ChatFilesProps {
    chatAttachments: ChatFileType[];
    setChatAttachments: any;
    chatToEdit: ChatCardType | null;
    setChatToEdit: any;
    inputValue: string;
    setInputValue: any;
    uploadFiles: any
    handleSubmit: any
}

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledInput = styled(TextInput)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledImage = styled(Image)

const ChatFiles: React.FC<ChatFilesProps> = ({ chatAttachments, setChatAttachments, chatToEdit, setChatToEdit, inputValue, setInputValue, uploadFiles, handleSubmit }) => {
    const [cursorPosition, setCursorPosition] = useState(0);
    const [message, setMessage] = useState('');
    const [flag, setFlag] = useState(false)

    const handleSelectionChange = (event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
        const { selection } = event.nativeEvent;
        setCursorPosition(selection.start);
    };

    useEffect(() => {
        if (chatToEdit !== null) {
            setInputValue('')
            setMessage(chatToEdit.message)
            setCursorPosition(chatToEdit.message.length)
            setChatAttachments(chatToEdit.files)
        } else {
            setMessage(inputValue)
            setTimeout(() => {
                setInputValue('')
            }, 1000);
        }
    }, [])

    // useEffect(() => {
    //     if (chatToEdit !== null && !flag) {
    //         setInputValue('')
    //         setMessage(chatToEdit.message)
    //         setCursorPosition(chatToEdit.message.length)
    //         setFiles(chatToEdit.files)
    //         setChatAttachments(chatToEdit.files)
    //         setFlag(true)
    //     } else {
    //         if (!flag) {
    //             setMessage(inputValue)
    //             setTimeout(() => {
    //                 setInputValue('')
    //             }, 1000);
    //             setFlag(true)
    //         }
    //         setFiles(chatAttachments)
    //     }
    // }, [chatAttachments])

    return (
        <View style={styles.container}>
            <Modal
                visible={chatAttachments.length > 0 || chatToEdit !== null}
                transparent
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.innerContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ padding: 4 }}>
                            {chatAttachments.map((attachment, index) => (
                                <StyledView key={index} className={`overflow-hidden relative w-32 h-24 flex-row justify-center items-center rounded-md bg-gray-100 ${index !== chatAttachments.length - 1 ? 'mr-3' : ''}`}>
                                    <StyledTouchableOpacity className='w-6 h-6 rounded-full bg-red-500 absolute top-0 right-0 flex-row justify-center items-center z-10' onPress={() => {
                                        if (chatAttachments.length === 1 && chatToEdit === null) {
                                            setInputValue(message)
                                        }
                                        setChatAttachments((prev: ChatFileType[]) => prev.filter((_, i) => i !== index))
                                    }}>
                                        <StyledText className='text-white font-bold mb-[2px]' style={{ fontSize: 13 }} >x</StyledText>
                                    </StyledTouchableOpacity>
                                    {attachment.fileType.includes('image') ?
                                        <StyledImage source={{ uri: attachment.id !== -1 ? `data:image/jpeg;base64,${attachment.data}` : attachment.data }} alt="logo" className='w-full h-full' resizeMode='cover' />
                                        :
                                        <Video
                                            style={{ width: 130, height: 100 }}
                                            source={{ uri: attachment.id !== -1 ? `data:video/mp4;base64,${attachment.data}` : attachment.data }}
                                            useNativeControls
                                            resizeMode={ResizeMode.COVER}
                                        />
                                    }
                                </StyledView>
                            ))}
                        </ScrollView>
                        <TouchableOpacity className='mt-2 ml-auto mr-1' onPress={uploadFiles}>
                            <StyledText className='text-blue-500 font-bold'>Add File</StyledText>
                        </TouchableOpacity>
                        <StyledView className="flex-row w-full px-2 items-center mt-2">
                            <StyledInput
                                className={`flex-1 bg-white h-[31px] border-b-[1px] border-solid border-gray-500 border-r-0 border-l-0 border-t-0 focus:border-gray-500 focus:outline-none`}
                                placeholder="Type a message"
                                value={message}
                                onChangeText={(text: any) => {
                                    setMessage(text)
                                    setCursorPosition((prev: number) => prev + 1);
                                }}
                                onSelectionChange={handleSelectionChange}
                            />
                            <Emoji inputValue={message} setInputValue={setMessage} cursorPosition={cursorPosition} setCursorPosition={setCursorPosition} flag={false} />
                        </StyledView>
                        <StyledView className='flex-row justify-around items-center w-full'>
                            <Button labelStyle={{ fontWeight: 'bold' }} mode="contained" onPress={() => {
                                setInputValue('')
                                setMessage('')
                                setCursorPosition(0)
                                setChatToEdit(null)
                                setChatAttachments([])
                            }} style={{ marginTop: 20 }}>
                                Cancel
                            </Button>
                            <Button labelStyle={{ fontWeight: 'bold' }} mode="contained" onPress={() => handleSubmit(message)} style={{ marginTop: 20 }}>
                                Send
                            </Button>
                        </StyledView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    innerContainer: {
        width: '100%',
        backgroundColor: 'white',
        padding: 15,
        paddingBottom: 20,
        paddingRight: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ChatFiles;