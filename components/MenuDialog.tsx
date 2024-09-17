import React, { useState } from 'react';
import { KeyboardTypeOptions, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { Colors } from '@/constants/Colors';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { View } from 'react-native';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';
import { Icon } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput)

interface MenuDialogProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    menu: { id: number; name: string; category: string; price: number; quantity: number, image: string } | undefined;
}

interface InputGroupProps {
    flag: boolean;
    title: string;
    value: string;
    setValue: (value: string) => void;
    placeholder: string;
    setWarning: (value: string) => void;
    keyboardType: KeyboardTypeOptions;
}

interface ImageInputProps {
    uploadImage: any;
    imgStream: string;
}

interface SelectInputProps {
    flag: boolean;
    title: string;
    value: string;
    setValue: (value: string) => void;
    placeholder: string;
    setWarning: (value: string) => void;
    texts: string[];
    values: string[];
}

export const InputGroup: React.FC<InputGroupProps> = ({ flag, title, value, setValue, placeholder, setWarning, keyboardType = "default" }) => {
    return (
        <StyledView className={`overflow-x-hidden mt-2 flex-row items-center justify-between mr-[6px]`}>
            <StyledText className="pl-1 font-bold mb-[6px] mr-3 text-gray-700" style={{ fontSize: 16 }}>
                {title}:{flag && <StyledText className="text-red-500">*</StyledText>}
            </StyledText>
            <StyledInput
                className="border-b-[1px] border-gray-400 mb-4 w-[55%] pl-1 outline-none cursor-pointer bg-white"
                placeholder={placeholder}
                keyboardType={keyboardType}
                value={value}
                style={{ fontSize: 14 }}
                onChangeText={(text) => {
                    setValue(text);
                    setWarning("");
                }}
            />
        </StyledView>
    )
}

export const ImageInput: React.FC<ImageInputProps> = ({ imgStream, uploadImage }) => {
    return (
        <StyledView className={`overflow-x-hidden mt-4 flex-row items-center justify-between mr-[6px]`}>
            <StyledText className="pl-1 font-bold mb-[6px] mr-3 text-gray-700" style={{ fontSize: 16 }}>
                Image:
            </StyledText>
            <TouchableOpacity className='w-[55%] bg-slate-500 rounded-md' onPress={uploadImage}>
                <StyledView className="w-full flex-row justify-center items-center">
                    <StyledView className="py-[3px] w-full flex-row justify-center items-center cursor-pointer rounded-md border-[1px] border-gray-900 overflow-hidden">
                        <StyledText className="mr-1 h-full text-white flex-row justify-center items-center text-center font-bold mb-[1.5px]" style={{ fontSize: 14 }}>
                            {imgStream === "" ? "No image" : "Image chosen"}
                        </StyledText>
                        <Icon
                            source="camera"
                            color={'white'}
                            size={17}
                        />
                    </StyledView>
                </StyledView>
            </TouchableOpacity>
        </StyledView>
    )
}

export const SelectInput: React.FC<SelectInputProps> = ({ flag, title, value, setValue, placeholder, setWarning, texts, values }) => {
    const [visible, setVisible] = useState(false);
    const [textValue, setTextValue] = useState('');
    return (
        <StyledView className={`overflow-x-hidden mt-5 mb-4 flex-row items-center justify-between mr-[6px]`}>
            <StyledText className="pl-1 font-bold mb-[6px] mr-3 text-gray-700" style={{ fontSize: 16 }}>
                {title}:{flag && <StyledText className="text-red-500">*</StyledText>}
            </StyledText>
            <StyledView className='relative w-[55%]'>
                <TouchableOpacity className='w-full flex-row items-center justify-between px-[6px] py-[3px] border-[1.5px] border-gray-300 bg-white rounded-md' onPress={() => {
                    setVisible((prev) => !prev)
                    setWarning('')
                }}>
                    <StyledText className="text-gray-500 mb-[1.5px]" style={{ fontSize: 14 }}>
                        {value === "" ? placeholder : textValue}
                    </StyledText>
                    <FontAwesome5 name={visible ? "chevron-down" : "chevron-up"} size={12} color="gray" />
                </TouchableOpacity>
                {visible &&
                    <StyledView className='w-full min-h-[50px] absolute top-[100%] rounded-md left-0 z-10 bg-slate-100'>
                        {texts.map((text, index) => (
                            <TouchableOpacity key={index} className={`w-full flex-row items-center justify-between px-3 py-[2.5px] ${index !== texts.length - 1 ? 'border-b-[0.5px] border-b-gray-400' : ''}`}
                                onPress={() => {
                                    setValue(values[index])
                                    setTextValue(text)
                                    setVisible(false)
                                    setWarning("")
                                }}
                            >
                                <StyledText className={`text-gray-500 mb-[1.5px]`} style={{ fontSize: 14 }}>
                                    {text}
                                </StyledText>
                            </TouchableOpacity>
                        ))}
                    </StyledView>
                }
            </StyledView>
        </StyledView>
    )
}

const MenuDialog: React.FC<MenuDialogProps> = ({ visible, setVisible, menu }) => {
    const hideDialog = () => setVisible(false);
    const [name, setName] = useState(menu?.id === 0 ? "" : menu?.name);
    const [category, setCategory] = useState(menu?.id === 0 ? "" : menu?.category);
    const [warning, setWarning] = useState("");
    const [price, setPrice] = useState(menu?.id === 0 ? "" : menu?.price);
    const [quantity, setQuantity] = useState(menu?.id === 0 ? "" : menu?.quantity);
    const [imgStream, setImgStream] = useState(menu?.id === 0 ? "" : menu?.image);
    const [flag, setFlag] = useState(false);
    const { light } = Colors;
    const router = useRouter();

    const uploadImage = async () => {
        setWarning('')
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            setImgStream(imageUri);
            setFlag(true);
        }
    };

    const handleSubmit = () => {

    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog} style={{ backgroundColor: 'white' }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <StyledView className='flex-row justify-center items-center gap-3 mb-4'>
                        <MaterialIcons name="list-alt" size={35} color={light.primaryGray} style={{ textAlign: 'center' }} />
                        <StyledText style={styles.title}>{menu?.id === 0 ? "Add Menu" : "Update Menu"}</StyledText>
                    </StyledView>
                    <Dialog.Content>
                        {warning !== "" && <Text variant="bodyMedium" className='text-red-400 text-center mb-2'>{warning}</Text>}
                        <InputGroup flag={true} title='Name' value={name ? name : ''} setValue={setName} placeholder='Enter name' setWarning={setWarning} keyboardType='default' />
                        <SelectInput flag={true} title='Category' value={category ? category : ''} setValue={setCategory} placeholder='Select category' setWarning={setWarning} texts={["Veg", "Non-veg", "Vegan", "Drink"]} values={['VEG', 'NON_VEG', 'VEGAN', 'DRINK',]} />
                        <InputGroup flag={true} title='Price' value={price ? price.toString() : ''} setValue={setPrice} placeholder='Enter price' setWarning={setWarning} keyboardType='numeric' />
                        <InputGroup flag={true} title='Quantity' value={quantity ? quantity.toString() : ''} setValue={setQuantity} placeholder='Enter quantity' setWarning={setWarning} keyboardType='numeric' />
                        <ImageInput imgStream={imgStream ? imgStream : ''} uploadImage={uploadImage} />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={handleSubmit} style={{ marginTop: -8 }}>{menu?.id === 0 ? 'Add Menu' : 'Update Menu'}</Button>
                    </Dialog.Actions>
                </ScrollView>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        color: Colors.light.primaryGray,
        fontSize: 24,
        fontWeight: 'bold',
    },
})

export default MenuDialog;