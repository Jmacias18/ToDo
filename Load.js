import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Load = () => {
    const navigation = useNavigation();

    const handleFullScreenAndNavigate = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
        navigation.navigate('App');
    };
        
    return (
        <View style={styles.container}>
            <Button title="Iniciar" onPress={handleFullScreenAndNavigate} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
});

export default Load;