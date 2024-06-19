import { useState } from "react"
import {
    TextInput,
    View,
    Pressable,
    Text,
    StyleSheet
} from "react-native"
import { Link, router } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"

export default function NewDrink(){
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
        <View style={styles.componentContainer}>
            <Text style={styles.infoText}>Drink Name</Text>
            <TextInput 
                style={styles.input}
                onChangeText={setDrinkName}
            />
            <View style={styles.rowContainer}>
                <Pressable style={styles.button} onPress={submitDrinkType}>
                    <Text style={styles.buttonText}>Submit</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => router.navigate("/drinkSelection")}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
            </View> 
        </View>   
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
    }
})