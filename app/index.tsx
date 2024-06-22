import { 
  Text, 
  View, 
  StyleSheet,
  FlatList,
  Pressable,
  useColorScheme,
  SafeAreaView
} from "react-native";
import { router } from "expo-router";
import { useSQLiteContext }from "expo-sqlite"
import DrinkInfoListItem from "./components/drinkInfoListItem";
import { StatusBar } from 'expo-status-bar';

interface DrinksDrankEntry {
  id: number,
  timestamp: string,
  drink_type: number
}

export default function Index() {
  var colorScheme = useColorScheme();
  console.log(colorScheme)
  if(!colorScheme){
    colorScheme = "dark"
  }
  const colorThemeStyle = colorScheme=="light" ? styles.lightColorTheme : styles.darkColorTheme

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
      <SafeAreaView style={[styles.centered, colorThemeStyle]}>
        <StatusBar style={colorScheme}/>
        <FlatList
            style={[styles.drinkList, colorThemeStyle]}
            data={drinksDrankEntries}
            renderItem={
                ({item}) => <DrinkInfoListItem drinkTypeId={item.drink_type} timestamp={item.timestamp} drankId={item.id} onDelete={() => router.replace("/")}/>
            }
        />
        <Pressable style={[styles.button, colorThemeStyle]} onPress={() => router.navigate("/drinkSelection")}>
            <Text style={[styles.buttonText, colorThemeStyle]}>+</Text>
        </Pressable>
      </SafeAreaView>
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
