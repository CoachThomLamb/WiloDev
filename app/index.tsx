import { Text, StyleSheet, View } from "react-native";
import {Stack, Link} from 'expo-router';


export default function Index() {
  return (
    <View
      style={styles.workoutContainer}
    >
      {/* PUT FLAT LIST HERE WIUTH WORKOUTS  */}
      <Link href={{pathname: 'details', params: {slug:'bhf0knvd70ho9st'}}}>Go to details</Link>
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