import {
    StyleSheet,
    Text,
    View,
} from "react-native";

import ResumeGameButton from "../atoms/resumeGameButton";
import QuitButton from "../atoms/quitButton";

export default function PauseScreen() {
    return (
        <View style={styles.container} >
            <Text style={styles.mainText}>Game Paused</Text>
            <View style={styles.buttonView}>
                <ResumeGameButton />
                <QuitButton />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainText: {
        flexDirection: 'row',
        justifyContent: 'center',
        fontSize: 48,
        fontWeight: 'bold'
    },
    buttonView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '25%',
    }
});