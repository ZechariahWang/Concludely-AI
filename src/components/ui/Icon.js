import React from 'react';
import {
    Feather,
    MaterialIcons,
    Ionicons,
    AntDesign
} from '@expo/vector-icons';
import { THEMES } from '../../constants/app';

const Icon = ({
    name,
    size = 24,
    color,
    library = 'Feather',
    theme = 'light',
    style,
    ...props
}) => {
    const colors = THEMES[theme];
    const iconColor = color || colors.foreground;

    const getIconComponent = () => {
        switch (library) {
            case 'MaterialIcons':
                return MaterialIcons;
            case 'Ionicons':
                return Ionicons;
            case 'AntDesign':
                return AntDesign;
            case 'Feather':
            default:
                return Feather;
        }
    };

    const IconComponent = getIconComponent();

    return (
        <IconComponent
            name={name}
            size={size}
            color={iconColor}
            style={style}
            {...props}
        />
    );
};

export default Icon;