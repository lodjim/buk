import React, { useEffect, useState } from "react"; // Added useEffect and useState
import { View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, Card, ProgressBar, Button } from "react-native-paper";

export default function HomeScreen() {
  const [lastBook, setLastBook] = useState(null); // Initial state is null

  const getLastOpenedBook = async () => {
    try {
      const book = await AsyncStorage.getItem("lastOpenedBook");
      if (book !== null) {
        setLastBook(JSON.parse(book));
      } else {
        setLastBook({
          title: "Sapiens",
          author: "Yuval Noah Harari",
          description:
            "Il y a 100 000 ans, la Terre était habitée par au moins six espèces différentes d’hominidés. Une seule a survécu. Nous, les ’Homo Sapiens’",
          pathImage: "../assets/images/sapiens.jpg",
          progress: 45, // Note: changed Progress to lowercase to match your BookList schema
        });
      }
    } catch (error) {
      console.error("Error getting last opened book:", error);
    }
  };

  useEffect(() => {
    getLastOpenedBook();
  }, []);

  if (!lastBook) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading last book...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Last Opened 📖</Text>
      <Card style={styles.book}>
        <Card.Title title={lastBook.title} subtitle={lastBook.author} />
        <Card.Content>
          <Text variant="labelMedium">{lastBook.description}</Text>
        </Card.Content>
        <Card.Cover source={{ uri: lastBook.pathImage }} />
        <ProgressBar progress={lastBook.progress / 100} />{" "}
        <Card.Actions>
          <Button>Delete</Button>
          <Button>Resume</Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignSelf: "center",
    width: "100%",
  },
  title: {
    fontSize: 20,
    marginTop: 20,
    marginLeft: 20,
  },
  book: {
    width: "90%",
    marginTop: 20,
    marginLeft: 20,
  },
});
