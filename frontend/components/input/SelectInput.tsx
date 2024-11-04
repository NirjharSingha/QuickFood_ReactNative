import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

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

export const SelectInput: React.FC<SelectInputProps> = ({ flag, title, value, setValue, placeholder, setWarning, texts, values }) => {
    const [visible, setVisible] = useState(false);
    const [textValue, setTextValue] = useState('');

    useEffect(() => {
        if (value !== "") {
            const index = values.indexOf(value);
            setTextValue(texts[index]);
        }
    }, [value, values, texts])

    return (
        <StyledView className={`overflow-x-hidden mt-5 mb-4 flex-row items-center justify-between mr-[6px]`}>
            <StyledText className="pl-1 font-bold mb-[6px] mr-3 text-gray-700" style={{ fontSize: 16 }}>
                {title}:{flag && <StyledText className="text-red-500">*</StyledText>}
            </StyledText>
            <StyledView className='relative w-[55%]'>
                <TouchableOpacity className='w-full flex-row items-center justify-between px-[6px] py-[3px] border-[1.5px] border-gray-300 bg-white rounded-md' onPress={() => {
                    setVisible((prev) => !prev)
                    setWarning('')
                    setValue('')
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
