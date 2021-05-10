import React from "react";
import { StyleSheet, View } from "react-native";
import ListPhotos from "../components/ListPhotos";

export default function MainScreen() {
  return (
    <View style={styles.container}>
      <ListPhotos />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
