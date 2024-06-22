import { 
    View, 
    Text, 
    Pressable, 
    StyleSheet,
    SafeAreaView,
    useColorScheme
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite"
import { Picker } from '@react-native-picker/picker';

interface DrinkTypeEntry {
    id: number
    name: string
}

export default function DrinkSelection () {
    var colorScheme = useColorScheme();
    if(!colorScheme){
        colorScheme = "dark"
    }
    const colorThemeStyle = colorScheme=="light" ? styles.lightColorTheme : styles.darkColorTheme

    const db = useSQLiteContext()
    const drinkTypeEntries = db.getAllSync<DrinkTypeEntry>("SELECT * FROM drink_types")  
    var initialId = -1
    if(drinkTypeEntries.length){
        initialId = drinkTypeEntries[0].id
    }
    const [selectedDrinkTypeId, setSelectedDrinkTypeId] = useState(initialId)
    const insertDrankDrink = () => {
        console.log(`Selected ID: ${selectedDrinkTypeId}`)
        if(selectedDrinkTypeId>=0){
            const timestamp = new Date().toISOString()
            db.runSync("INSERT INTO drinks_drank (timestamp, drink_type) VALUES (?, ?)", timestamp, selectedDrinkTypeId)
        } 
        router.navigate("/")
    }

    return (
        <SafeAreaView style={[styles.centered, colorThemeStyle]}>
            <View style={[styles.pickerContainer, colorThemeStyle]}>
                <Picker
                    style={[styles.dropdown, colorThemeStyle]}
                    selectedValue={selectedDrinkTypeId}
                    onValueChange={setSelectedDrinkTypeId}
                >
                    {
                        drinkTypeEntries.map(entry => <Picker.Item 
                            style={styles.item} 
                            key={entry.id} 
                            label={entry.name} 
                            value={entry.id} />
                        )
                    }
                </Picker>
            </View>
            <View style={[styles.buttonContainer, colorThemeStyle]}>
                <View style={[styles.rowContainer, colorThemeStyle]}>
                    <Pressable style={[styles.button, {width:"90%"}, colorThemeStyle]} onPress={() => router.navigate("/newDrinkType")}>
                        <Text style={[styles.buttonText, colorThemeStyle]}>+</Text>
                    </Pressable>
                </View>
                <View style={[styles.rowContainer, colorThemeStyle]}>
                    <Pressable style={[styles.button, {width:"44%"}, colorThemeStyle]} onPress={insertDrankDrink}>
                        <Text style={[styles.buttonText, colorThemeStyle]}>OK</Text>
                    </Pressable>
                    <Pressable style={[styles.button, {width:"44%"}, colorThemeStyle]} onPress={() => router.navigate("/")}>
                        <Text style={[styles.buttonText, colorThemeStyle]}>Cancel</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );   
}

const styles = StyleSheet.create({
    pickerContainer:{
        width: "90%", 
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    pickerBorder: {
        borderWidth:1, 
        width:"100%",
        borderRadius: 50
    },
    button: {
      borderWidth: 1,
      padding: 10,
      borderRadius: 10,
      margin: "1%",
    },
    buttonText: {
        textAlign: "center",
        fontSize: 40
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    buttonContainer: {
        width: "90%"
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    dropdown: {
        borderWidth:1, 
        width: "90%",
    },
    item: {
        fontSize: 32
    },
    darkColorTheme: {
        color: "#fffced",
        backgroundColor: "#1F1F1F",
        borderColor: "#fffced"
    },
    lightColorTheme: {
        color: "#f5f5f5",
        backgroundColor: "#000000",
        borderColor: "#000000"
    }
  })