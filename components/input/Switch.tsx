import * as React from 'react';
import { Switch } from 'react-native-paper';

interface SwitchInputProps {
    isSwitchOn: boolean;
    setIsSwitchOn: (value: boolean) => void;
}

export const SwitchInput: React.FC<SwitchInputProps> = ({ isSwitchOn, setIsSwitchOn }) => {
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    return <Switch value={isSwitchOn} onValueChange={onToggleSwitch} style={{ height: 20 }} />;
};