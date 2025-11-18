import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ColorSelectScreen({ navigation }) {
    const[selected, setSelected]=useState(null);

    const handleContinue = () => {
        if (!selected) return;
        navigation.navigate("GameScreen", {palyer1:selected});
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Jugador 1, elige tu ColorSelectScreen</Text>

        <TouchableOpacity>
            style={[styles.option, selected ==="white" && styles.selected]}
            onPress={() => setSelected("white")}
        {'>'}
            <Text style={styles.optionText}>Blancas</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.option, selected ==="black" && styles.selected]}
            onPress={() => setSelected("black")}
        >
            <Text style={styles.optionText}>Negras</Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={[styles.button, !selected && styles.disabled]}
            disabled={!selected}
            onPress={handleContinue}
        >
            <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
    </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    title: {
        color: "White",
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    option: {
        width: '80%',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#444',
        marginBottom: 15,
        alignItems: 'center',
    },
    selected: {
        backgroundColor: '#888',
    },
    optionText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    button: {
        marginTop: 30,
        backgroundColor: '#1E90FF',
        padding: 15,
        borderRadius: 10,
        width: '60%',
        alignItems: 'center',
    },
    disabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
        