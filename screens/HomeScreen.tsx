import React from "react";
import { View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Sapiens from "@/assets/images/sapiens.jpg";
import {
  Text,
  BottomNavigation,
  Avatar,
  Button,
  Card,
  ProgressBar,
} from "react-native-paper";

const storeData = async (value) => {
  try {
    await AsyncStorage.setItem("my-key", value);
  } catch (e) {}
};

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem("my-key");
    if (value !== null) {
    }
  } catch (e) {}
};
export default function HomeScreen() {
  const [lastBook, setLastBook] = React.useState({
    title: "Sapiens",
    author: "Yuval Noah Harari",
    description:
      "Il y a 100 000 ans, la Terre était habitée par au moins six espèces différentes d’hominidés. Une seule a survécu. Nous, les ’Homo Sapiens’",
    pathImage: "../assets/images/sapiens.jpg",
    Progress: 45,
  });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Last Opened 📖</Text>
      <Card style={styles.book}>
        <Card.Title title={lastBook.title} subtitle={lastBook.author} />
        <Card.Content>
          <Text variant="labelMedium">{lastBook.description}</Text>
        </Card.Content>
        <Card.Cover source={{ uri: lastBook.pathImage }} />
        <ProgressBar progress={lastBook.Progress / 100} />
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
