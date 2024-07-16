import { Text, StyleSheet, View } from "react-native";
import {Stack, Link} from 'expo-router';


export default function Index() {
  return (
    <View
      style={styles.workoutContainer}
    >
      <Link href={{pathname: 'details'}}>Go to details</Link>
      <Text>React Native</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  workoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});