import { 
    Text, 
    Pressable,
    useColorScheme,
    StyleSheet
} from "react-native";
import { useSQLiteContext }from "expo-sqlite";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface DrinksDrankEntry {
    id: number,
    timestamp: string,
    drink_type: number
}

interface DrinkTypesEntry {
    id: number,
    name: string
}

export default function ExportButton() {
    var colorScheme = useColorScheme();
    console.log(colorScheme)
    if(!colorScheme){
        colorScheme = "dark"
    }

    const db = useSQLiteContext()

    const exportData = async () => {
        const drinkTypesEntries = db.getAllSync<DrinkTypesEntry>("SELECT * FROM drink_types")
        const drinksDrankEntries = db.getAllSync<DrinksDrankEntry>("SELECT * FROM drinks_drank")

        const drinkIdToNameMap = new Map();
        drinkTypesEntries.map((entry) => {
            drinkIdToNameMap.set(entry.id, entry.name)   
        });

        var outputDataArray = drinksDrankEntries.map((entry) => ({...entry, drink_name: drinkIdToNameMap.get(entry.drink_type)}));
        var outputStrArray = outputDataArray.map(obj => Object.values(obj).join())
        const header = Object.keys(outputDataArray[0]).join()
        outputStrArray.unshift(header) //add header

        var outputStr = outputStrArray.join("\n")

        const outputPath = FileSystem.cacheDirectory + "/drink-tracker-data.csv"
        await FileSystem.writeAsStringAsync(outputPath, outputStr)
        
        await Sharing.shareAsync(outputPath)
    }

    const colorThemeStyle = colorScheme=="light" ? styles.lightColorTheme : styles.darkColorTheme

    return (
        <Pressable onPress={exportData}>
            <Text style={{fontSize: 30}}>Export</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        margin: "1%",
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
        borderColor: "#00000"
    }
})