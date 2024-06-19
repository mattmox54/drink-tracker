import { Alert, Pressable, StyleSheet, Text, View } from "react-native"
import { useSQLiteContext }from "expo-sqlite"

interface Props {
    timestamp: string,
    drinkTypeId: number,
    drankId: number,
    onDelete?: () => void
}

interface DrinkTypeEntry {
    id: number
    name: string
}

export default function DrinkInfoListItem(props: Props){
    var drinkName = "ERROR: UNKNOWN DRINK"

    const db = useSQLiteContext()

    const drinkEntry = db.getFirstSync<DrinkTypeEntry>("SELECT * FROM drink_types WHERE id=?", props.drinkTypeId)
    if(drinkEntry){
        drinkName = drinkEntry.name    
    }

    const date_str = new Date(props.timestamp).toLocaleDateString()
    const time_str = new Date(props.timestamp).toLocaleTimeString()

    console.log(`DrinkInfoListItem = {name: ${drinkName}, timestamp: ${props.timestamp}}`)

    const showDeletePrompt = () => {
        Alert.alert(
            "Warning",
            "Are you sure you want to delete?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        db.runSync("DELETE FROM drinks_drank WHERE id=?", props.drankId)
                        if(props.onDelete){
                            props.onDelete()
                        }
                    }
                },
                {
                    text: "No"
                }
            ],
            {
                cancelable: false
            }
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                <Text style={styles.primaryText}>{drinkName}</Text>
                <Pressable onPress={showDeletePrompt}>
                    <Text style={styles.subText}>X</Text>
                </Pressable>
            </View>
            <View style={styles.rowContainer}>
                <Text style={styles.subText}>{date_str} {time_str}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    subText: {
        fontSize: 20,
    },
    primaryText: {
        fontSize: 28,
        width: "80%",
        fontWeight: "bold"
    },
    container: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        // width: 300
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    }
})