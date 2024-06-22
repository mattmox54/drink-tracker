import { useState } from "react"
import {
    TextInput,
    View,
    Pressable,
    Text,
    StyleSheet,
    SafeAreaView,
    useColorScheme
} from "react-native"
import { Link, router } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { StatusBar } from 'expo-status-bar';

export default function NewDrink(){
    var colorScheme = useColorScheme();
    if(!colorScheme){
        colorScheme = "dark"
    }
    const colorThemeStyle = colorScheme=="light" ? styles.lightColorTheme : styles.darkColorTheme

    const [drinkName, setDrinkName] = useState("")

    const db = useSQLiteContext()

    const submitDrinkType = () => {
        if(drinkName){
            db.runSync("INSERT INTO drink_types (name) VALUES (?)", drinkName)
            console.log(`INSERTED ${drinkName}`)
        }   
        router.navigate("/drinkSelection")
    }

    return (
        <SafeAreaView style={[styles.componentContainer, colorThemeStyle]}>
            <StatusBar />
            <Text style={[styles.infoText, colorThemeStyle]}>Drink Name</Text>
            <TextInput 
                style={[styles.input, colorThemeStyle]}
                onChangeText={setDrinkName}
            />
            <View style={[styles.rowContainer, colorThemeStyle]}>
                <Pressable style={[styles.button, colorThemeStyle]} onPress={submitDrinkType}>
                    <Text style={[styles.buttonText, colorThemeStyle]}>Submit</Text>
                </Pressable>
                <Pressable style={[styles.button, colorThemeStyle]} onPress={() => router.navigate("/drinkSelection")}>
                    <Text style={[styles.buttonText, colorThemeStyle]}>Cancel</Text>
                </Pressable>
            </View> 
        </SafeAreaView>   
    )
}

const styles = StyleSheet.create({
    componentContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    rowContainer: {
        flexDirection: "row"
    },
    input: {
        width: "80%",
        borderWidth: 1,
        fontSize: 32
    },
    button: {
        borderWidth: 1,
        padding: 10,
        borderColor: "#00000",
        borderRadius: 10,
        margin: "2%"
    },
    buttonText: {
        fontSize: 42
    },
    infoText: {
        fontSize: 20,
        textAlign: "left",
        width: "80%"
    },
    darkColorTheme: {
        color: "#fffced",
        backgroundColor: "#1F1F1F",
        borderColor: "#fffced"
    },
    lightColorTheme: {
        color: "#000000",
        backgroundColor: "#f5f5f5",
        borderColor: "#000000"
    }
})