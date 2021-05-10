import React from "react";
import { StyleSheet, View, Text } from "react-native";

export default function MainScreen() {
  return (
    <View style={styles.container}>
      <Text>Main Screen 😀</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
