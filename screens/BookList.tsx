import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as SQLite from "expo-sqlite";
import { Text, List, Button, Avatar, IconButton } from "react-native-paper";

// Initialize database
const db = SQLite.openDatabaseSync("books.db");

export default function BookList() {
  const [books, setBooks] = useState([]);
  const router = useRouter();

  const fetchBooks = async () => {
    try {
      const allBooks = await db.getAllAsync("SELECT * FROM books");
      setBooks(allBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const deleteBook = async (id) => {
    try {
      await db.runAsync("DELETE FROM books WHERE id = ?", [id]);
      // Refresh the book list after deletion
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  useEffect(() => {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        description TEXT NOT NULL,
        pathImage TEXT,
        progress INTEGER DEFAULT 0
      );
    `);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchBooks();
    }, []),
  );

  return (
    <View style={styles.container}>
      <List.Section style={{ marginLeft: 10 }}>
        <List.Subheader>All my Books</List.Subheader>
        {books.length === 0 ? (
          <Text>No books found</Text>
        ) : (
          books.map((item) => (
            <List.Item
              key={item.id}
              title={item.title}
              description={item.author}
              left={() => <List.Icon icon="book" />}
              right={() => (
                <View style={styles.rightContainer}>
                  {item.pathImage ? (
                    <Avatar.Image
                      size={50}
                      source={{ uri: item.pathImage }}
                      style={styles.avatar}
                    />
                  ) : (
                    <Avatar.Icon size={50} icon="book" style={styles.avatar} />
                  )}
                  <IconButton
                    icon="delete"
                    size={24}
                    onPress={() => deleteBook(item.id)}
                    style={styles.deleteButton}
                  />
                </View>
              )}
            />
          ))
        )}
      </List.Section>
      <Button
        icon="book-plus"
        mode="contained"
        onPress={() => router.push("/addnewbook")}
      >
        Add New
      </Button>
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
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    marginRight: 8,
  },
  deleteButton: {
    margin: 0,
  },
});
