import { 
    View, 
    Text, 
    Pressable, 
    StyleSheet
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
        <View style={styles.centered}>
            <View style={styles.pickerContainer}>
                <View style={styles.pickerBorder}>
                    <Picker
                        style={styles.dropdown}
                        selectedValue={selectedDrinkTypeId}
                        onValueChange={setSelectedDrinkTypeId}
                    >
                        {
                            drinkTypeEntries.map(entry => <Picker.Item style={styles.item} key={entry.id} label={entry.name} value={entry.id} />)
                        }
                    </Picker>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <View style={styles.rowContainer}>
                    <Pressable style={{...styles.button, ...{width:"90%"}}} onPress={() => router.navigate("/newDrinkType")}>
                        <Text style={styles.buttonText}>+</Text>
                    </Pressable>
                </View>
                <View style={styles.rowContainer}>
                    <Pressable style={{...styles.button, ...{width:"44%"}}} onPress={insertDrankDrink}>
                        <Text style={styles.buttonText}>OK</Text>
                    </Pressable>
                    <Pressable style={{...styles.button, ...{width:"44%"}}} onPress={() => router.navigate("/")}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </Pressable>
                </View>
                
            </View>
        </View>
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
        fontSize: 44
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
    }
  })