import { View, Text, StyleSheet, TouchableOpacity, PixelRatio, Dimensions } from "react-native"

const fontScale = PixelRatio.getFontScale();
const getFontSize = size => size / fontScale;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function QuitButton() {
    return (
        <TouchableOpacity style={styles.quitButton} /*onPress={() => MainMenu}*/>
            <Text style={styles.buttonText}>Quit</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    quitButton: {
        width: width * .12,
        height: height * .1,
        justifyContent: "center",
        backgroundColor: "black",
        color: "black",
        borderRadius: 10,
    },
    buttonText: {
        fontSize: getFontSize(16),
        textAlign: "center",
        color: "#ffffff"
    }
})