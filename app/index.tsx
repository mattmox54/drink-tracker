import { 
  Text, 
  View, 
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { useSQLiteContext }from "expo-sqlite"
import DrinkInfoListItem from "./components/drinkInfoListItem";


interface DrinksDrankEntry {
  id: number,
  timestamp: string,
  drink_type: number
}

export default function Index() {
  const db = useSQLiteContext()
  const drinksDrankEntries = db.getAllSync<DrinksDrankEntry>("SELECT * FROM drinks_drank")
  console.log(`Drank ${drinksDrankEntries.length} Drinks`)
  
  const DrinksDrankCompare = (a:DrinksDrankEntry, b:DrinksDrankEntry): number => {
      const date_a = new Date(a.timestamp)
      const date_b = new Date(b.timestamp)
      if(date_a>date_b){
          return -1
      }else if(date_a<date_b){
          return 1
      }else{
          return 0
      }
  }

  drinksDrankEntries.sort(DrinksDrankCompare)

  return (
      <View style={styles.centered}>
          <FlatList
              style={styles.drinkList}
              data={drinksDrankEntries}
              renderItem={
                  ({item}) => <DrinkInfoListItem drinkTypeId={item.drink_type} timestamp={item.timestamp} drankId={item.id} onDelete={() => router.replace("/")}/>
              }
          />
          <Pressable style={styles.button} onPress={() => router.navigate("/drinkSelection")}>
              <Text style={styles.buttonText}>+</Text>
          </Pressable>
      </View>
  );
}

const styles = StyleSheet.create({
  button: {
      borderWidth: 1,
      padding: 10,
      borderRadius: 10,
      margin: "1%",
      width: "80%"
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
  drinkList: {
      flex:1
  }
})
