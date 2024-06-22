import { StyleSheet, useColorScheme } from "react-native"
import { Stack } from "expo-router";
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colorThemeStyle = colorScheme=="light" ? styles.lightColorTheme : styles.darkColorTheme
  
  const initializeDB = async (db: SQLiteDatabase) => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS drink_types (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS drinks_drank (id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp TEXT NOT NULL, drink_type INTEGER NOT NULL);
    `)
  }

  return (
    <SQLiteProvider databaseName="data.db" onInit={initializeDB}>
      <Stack>
        <Stack.Screen name="index" options={{title: "Drink Tracker"}}/>
        <Stack.Screen name="drinkSelection" options={{title: "Select Drink"}}/>
        <Stack.Screen name="newDrinkType" options={{title: "Enter Drink Info"}}/>
      </Stack>
    </SQLiteProvider>
    
  );
}

const styles = StyleSheet.create({
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