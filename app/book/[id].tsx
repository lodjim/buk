import { useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import {
  Text,
  Button,
  ProgressBar,
  Chip,
  Card,
  IconButton,
} from "react-native-paper";
import { useRouter } from "expo-router";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("books.db");

export default function BookDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const result = await db.getAllAsync("SELECT * FROM books WHERE id = ?", [
        id,
      ]);
      if (result.length > 0) {
        setBook(result[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching book details:", error);
      setLoading(false);
    }
  };

  const updateProgress = async (newProgress) => {
    try {
      await db.runAsync("UPDATE books SET progress = ? WHERE id = ?", [
        newProgress,
        id,
      ]);
      setBook((prev) => ({ ...prev, progress: newProgress }));
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const handleIncreaseProgress = () => {
    // Increment by 10% but don't exceed 100%
    const newProgress = Math.min(book.progress + 10, 100);
    updateProgress(newProgress);
  };

  const handleDecreaseProgress = () => {
    // Decrement by 10% but don't go below 0%
    const newProgress = Math.max(book.progress - 10, 0);
    updateProgress(newProgress);
  };

  const deleteBook = async () => {
    try {
      await db.runAsync("DELETE FROM books WHERE id = ?", [id]);
      router.back();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading book details...</Text>
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.centered}>
        <Text>Book not found</Text>
        <Button
          mode="contained"
          onPress={() => router.back()}
          style={styles.button}
        >
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title={book.title}
          subtitle={`by ${book.author}`}
          right={(props) => (
            <IconButton {...props} icon="delete" onPress={deleteBook} />
          )}
        />
        <Card.Content>
          {book.pathImage ? (
            <Image
              source={{ uri: book.pathImage }}
              style={styles.cover}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholderCover}>
              <Text style={styles.placeholderText}>No Cover</Text>
            </View>
          )}

          <View style={styles.progressSection}>
            <Text style={styles.sectionTitle}>Reading Progress</Text>
            <View style={styles.progressContainer}>
              <IconButton
                icon="minus"
                size={20}
                onPress={handleDecreaseProgress}
              />
              <ProgressBar
                progress={book.progress / 100}
                style={styles.progressBar}
              />
              <IconButton
                icon="plus"
                size={20}
                onPress={handleIncreaseProgress}
              />
            </View>
            <Text style={styles.progressText}>{book.progress}% Complete</Text>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{book.description}</Text>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button mode="outlined" onPress={() => router.back()}>
            Back to List
          </Button>
          <Button
            mode="contained"
            onPress={() =>
              router.push({ pathname: "/editbook", params: { id: book.id } })
            }
          >
            Edit Book
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cover: {
    width: "100%",
    height: 300,
    marginBottom: 16,
  },
  placeholderCover: {
    width: "100%",
    height: 300,
    backgroundColor: "#e1e1e1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 18,
    color: "#757575",
  },
  progressSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressBar: {
    flex: 1,
    height: 8,
    marginHorizontal: 8,
  },
  progressText: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    marginTop: 16,
  },
});
