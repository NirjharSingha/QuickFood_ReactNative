import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
// @ts-ignore
import DatePicker from 'react-native-modern-datepicker';

interface ModernDatePickerProps {
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    isDatePickerVisible: boolean;
    setDatePickerVisibility: (isVisible: boolean) => void;
}

const ModernDatePicker: React.FC<ModernDatePickerProps> = ({ selectedDate = '', setSelectedDate = () => { }, isDatePickerVisible = false, setDatePickerVisibility = () => { } }) => {
    const handleConfirm = (value: any) => {
        const date = new Date(value.replace(/\//g, '-'));
        const isoString = date.toISOString();
        setSelectedDate(isoString);
        setDatePickerVisibility(false);
    };

    return (
        <View style={styles.container}>
            <Modal
                visible={isDatePickerVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setDatePickerVisibility(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.innerContainer}>
                        <DatePicker
                            mode="calendar"
                            onDateChange={handleConfirm}
                            current={selectedDate}
                            selected={selectedDate}
                        />
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
        padding: 20,
        paddingTop: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ModernDatePicker;
