import { Text, StyleSheet, View, FlatList } from "react-native";
import {Link} from 'expo-router';


//currently have this displaying an exercise container, but will need to pass in the exercises from the workout
//Also need to style the ListHeaderComponent to display the sets, reps, and weight column headers 
//orderinal ? 

function ExerciseContainer({title}) {

  return(
    <View style={styles.exerciseContainer}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseHeaderText}>{title}</Text>
      </View>

      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseHeaderText}>Sets</Text>
        <Text style={styles.exerciseHeaderText}>Reps</Text>
        <Text style={styles.exerciseHeaderText}>Weight</Text>
      </View>

      <FlatList 
        ListFooterComponent={
          <View style={styles.exerciseItem}>
            <Text>End of workout</Text>
          </View>
        }
        data={[]}
        renderItem={({item}) => (
          <View style={styles.exerciseItem}>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  )
}
export default function Details() {
  return (
  <View style={styles.workoutContainer}>
     <ExerciseContainer title="Exercise 1"/>
     <ExerciseContainer title="Exercise 2"/>
     <ExerciseContainer title="Exercise 3"/>
    <Link href={{pathname: '/'}}>Go to index</Link>
  </View>
  );
}

const styles = StyleSheet.create({
  workoutContainer: {
  flex: 1,
  padding: 16,
  },
  exerciseHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: 'lightgray',
  padding: 8,
  },
  exerciseHeaderText: {
  fontWeight: 'bold',
  },
  exerciseContainer: {
  marginBottom: 16,
  },
  exerciseItem: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: 8,
  borderBottomWidth: 1,
  borderBottomColor: 'lightgray',
  },
});
