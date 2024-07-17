import React, {useEffect} from 'react';
import { useLocalSearchParams } from 'expo-router';

import { SafeAreaView, Text, TextInput, StyleSheet, View, FlatList } from "react-native";
import {Link} from 'expo-router';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090/');



//currently have this displaying an exercise container, but will need to pass in the exercises from the workout
//Also need to style the ListHeaderComponent to display the sets, reps, and weight column headers 
//ordinal for ordering stored in db ? 
//timer starts when last set is checked off, when timer is stopped that time entry goes into the next set. 
//manual override so you can document myo-reps or drop sets. 



function ExerciseContainer({title}) {
 

  return(
    <View style={styles.exerciseContainer}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseHeaderText}>{title}</Text>
      </View>

      
    </View>
  )
}
export default function Details() {
  const {slug} = useLocalSearchParams();
  const [workout, setWorkout] = React.useState('loading...'); 
  const [text, setText] = React.useState('asd');
  
  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const record = await pb.collection('workouts').getOne(slug);
        console.log(record);
        setWorkout(record);
        // onChangeText('test')
      } catch (error) {
        console.error(error);
      }
    }
    fetchWorkout();
  }, [slug]);

  const onChangeMyTextCustom = (thing) => {
    console.log(thing);
    setText(thing);

  }
  return (
  <View style={styles.workoutContainer}>
     <FlatList 
        ListFooterComponent={
          <View style={styles.exerciseItem}>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseHeaderText}>Sets</Text>
            <Text style={styles.exerciseHeaderText}>Reps</Text>
            <Text style={styles.exerciseHeaderText}>Weight</Text>
          </View>
        }
        ItemSeperatorComponent={
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseHeaderText}>Sets</Text>
            <Text style={styles.exerciseHeaderText}>Reps</Text>
            <Text style={styles.exerciseHeaderText}>Weight</Text>
          </View>
        }
        data={[{name: 'stuff'}]}
        renderItem={({item}) => (
          <View style={styles.exerciseItem}>
            <Text>{item.name}</Text>
            {/* <TextInput value={text} onChangeText={newText => setText(newText)} keyboardType="numeric"/> */}
            <Text>{item.name}</Text>
          </View>
        )}
      />
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
