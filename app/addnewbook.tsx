import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { TextInput, Button, Text, Card, HelperText } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as SQLite from "expo-sqlite";
import PropTypes from "prop-types";

// Initialize database
const db = SQLite.openDatabaseSync("books.db");

export default function AddNewBook({ navigation }) {
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    description: "",
    pathImage: null,
    Progress: 0,
  });

  const [errors, setErrors] = useState({});

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

  const handleChange = (field, value) => {
    setBookData({
      ...bookData,
      [field]: value,
    });

    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setBookData({
        ...bookData,
        pathImage: result.assets[0].uri,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!bookData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!bookData.author.trim()) {
      newErrors.author = "Author is required";
    }

    if (!bookData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await db.runAsync(
          `INSERT INTO books (title, author, description, pathImage, progress)
           VALUES (?, ?, ?, ?, ?)`,
          [
            bookData.title,
            bookData.author,
            bookData.description,
            bookData.pathImage,
            bookData.Progress,
          ],
        );

        // Reset form
        setBookData({
          title: "",
          author: "",
          description: "",
          pathImage: null,
          Progress: 0,
        });

        // Navigate back if navigation is available
        if (navigation?.goBack) {
          navigation.goBack();
        } else {
          console.log("Book saved successfully - no navigation available");
        }
      } catch (error) {
        console.error("Error saving book:", error);
        setErrors({ ...errors, submit: "Failed to save book" });
      }
    }
  };

  const handleCancel = () => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else {
      console.log("Cancel clicked - no navigation available");
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Title title="Add New Book" />
          <Card.Content>
            <TextInput
              label="Book Title"
              value={bookData.title}
              onChangeText={(text) => handleChange("title", text)}
              style={styles.input}
              error={!!errors.title}
            />
            {errors.title && (
              <HelperText type="error">{errors.title}</HelperText>
            )}

            <TextInput
              label="Author"
              value={bookData.author}
              onChangeText={(text) => handleChange("author", text)}
              style={styles.input}
              error={!!errors.author}
            />
            {errors.author && (
              <HelperText type="error">{errors.author}</HelperText>
            )}

            <TextInput
              label="Description"
              value={bookData.description}
              onChangeText={(text) => handleChange("description", text)}
              multiline
              numberOfLines={4}
              style={styles.input}
              error={!!errors.description}
            />
            {errors.description && (
              <HelperText type="error">{errors.description}</HelperText>
            )}

            <Text style={styles.progressLabel}>Reading Progress (%)</Text>
            <TextInput
              label="Progress"
              value={bookData.Progress.toString()}
              onChangeText={(text) => {
                const value = parseInt(text) || 0;
                handleChange("Progress", Math.min(100, Math.max(0, value)));
              }}
              keyboardType="numeric"
              style={styles.input}
            />

            <Button
              mode="outlined"
              icon="image"
              onPress={pickImage}
              style={styles.imageButton}
            >
              {bookData.pathImage ? "Change Cover Image" : "Select Cover Image"}
            </Button>

            {bookData.pathImage && (
              <Text style={styles.successText}>
                Image selected successfully
              </Text>
            )}

            {errors.submit && (
              <HelperText type="error">{errors.submit}</HelperText>
            )}

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={handleCancel}
                style={styles.button}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
              >
                Save Book
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

AddNewBook.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }),
};

AddNewBook.defaultProps = {
  navigation: null,
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  progressLabel: {
    marginTop: 8,
    marginBottom: 4,
  },
  imageButton: {
    marginTop: 8,
    marginBottom: 8,
  },
  successText: {
    color: "green",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    width: "48%",
  },
});
