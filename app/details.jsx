import React, {useEffect} from 'react';
import { useLocalSearchParams } from 'expo-router';

import { Pressable,Modal, Text, TextInput, StyleSheet, View, FlatList } from "react-native";
import {Link} from 'expo-router';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090/');
//TODO
//ordinal for ordering stored in db ? 
//timer starts when last set is checked off, when timer is stopped that time entry goes into the next set. 
//manual override so you can document myo-reps or drop sets. 
function groupSetsByExerciseId(setsArray) {
  const groupedSets = setsArray.reduce((acc, currentSet) => {
    const key = currentSet.expand.field.title;
    let group = acc.find(item => item.title === key);
    if (!group) {
      group = { title: key, sets: [] };
      acc.push(group);
    }
    group.sets.push(currentSet);
    return acc;
  }, []);

  return groupedSets;
}
function MyButton(props){
  const { onPress, title = 'Add Exercise'} = props;
 
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

export default function WorkoutContainer() {
  const { slug } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = React.useState(false);

  const [workout, setWorkout] = React.useState('loading...');
  const [newExerciseName, setNewExerciseName] = React.useState('');

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const record = await pb.collection('workouts').getOne(slug, {
          expand: "sets", expand: "sets.field"
        });
        setWorkout(groupSetsByExerciseId(record.expand.sets));
        console.log("GROUPED", JSON.stringify(groupSetsByExerciseId(record.expand.sets), 0 ,4));
        // console.log("data", workout);
      } catch (error) {
        console.error(error);
      }
    }
    fetchWorkout();
  }, [slug]);

  //this is what is borked 

  useEffect(() => {
    const updateWorkout = async () => {
      try {
    const record = await pb.collection('workouts').update(slug, {
      workout: workout
     })
     console.log("record", record);
    } catch (error) {
      console.error(error);
      }
    } 
    updateWorkout();
  }, [workout]);

    


  useEffect(() => {
    console.log("workout", JSON.stringify(workout, 0, 4));
    //TODO add way to write workout to 
  }, [workout]);
  
  const handleAddSet = async () => {
    try {
      // Create a new set in PocketBase
      const newSet = await pb.collection('sets').create({
        // Set the necessary properties for the new set
        // For example:
        exerciseId: exercise.id,
        reps: 0,
        load: 0,
      });

     
    } catch (error) {
      console.error(error);
    }
  };
  const handleAddExercise = async () => {
    setModalVisible(true);


  }
  const handleUpdateExerciseName = () => {
    setWorkout([...workout, {title: newExerciseName, sets: [{reps: 0, load: 0}] }]);
    console.log("workout", JSON.stringify(workout, 0, 4));
  }

  return (
    <View style={styles.workoutContainer}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        >
           <View style={styles.modalView}>
          <TextInput
            style={styles.modalText}
            value={newExerciseName }
            onChangeText={setNewExerciseName}
            
            />
          <MyButton
            title="Add Exercise"
            onPress={handleUpdateExerciseName}
          />
          <MyButton
            title="Hide Modal"
            onPress={() => setModalVisible(!modalVisible)}
          />
        </View>
      </Modal>
      {workout !== 'loading...' ? (
        <>
          <FlatList
            data={workout}
            renderItem={({ item, index }) => (
              <View>
                <ExerciseContainer exercise={item} order={index} handleAddSet={handleAddSet} />
              </View>
            )}
            ListFooterComponent={() => (
              <MyButton title="Add Exercise" onPress={handleAddExercise} />
            )

            }
          />
          <Link href={{ pathname: '/' }}>Go to index</Link>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  )
}

function ExerciseContainer({exercise, order}) {
  const [sets, setSets] = React.useState(exercise.sets);
  const [exerciseTitle, setExerciseTitle] = React.useState(exercise.title); 
  
  return(
    <View style={styles.exerciseContainer}>
      <View style={styles.table}>
        <View style={styles.tableRow}>
        <Text style={styles.tableHeaderText}>{exerciseTitle}</Text>
        <Text style={styles.tableHeaderText}>Previous</Text>
        <Text style={styles.tableHeaderText}>Reps</Text>
        <Text style={styles.tableHeaderText}>Load</Text>
        </View>

          <FlatList
            ListFooterComponent={() => (
              <MyButton title="add set" onPress={() => setSets([...sets, {reps: 0, load: 0}])} />
            )}
            data={sets}
            renderItem={({ item, index }) => (<SetContainer set={item} order={index} />
        
            )}
            
          />
      </View>
    </View>
  )
}
function SetContainer({set, order}) {
  const [reps, setReps] = React.useState(set.reps); 
  const [load, setLoad] = React.useState(set.load);
  useEffect(() => {
    console.log("sets", JSON.stringify(reps, 0, 4));
  }, [reps, load]);

  return (
    <View style={styles.tableRow}>
    <Text style={styles.tableHeaderText}>{order}</Text>
    <Text style={styles.tableHeaderText}>{`${set.load} X ${set.reps}`}</Text>
    <TextInput 
      style={styles.tableHeaderText}
      value={reps}
      onChangeText={setReps}
    />
    <TextInput
      style={styles.tableHeaderText}
      value={load}
      onChangeText={setLoad}
      
    />
  </View>
  )
}



const styles = StyleSheet.create({
  workoutContainer: {
    flex: 1,
    padding: 16,
  },
  exerciseContainer: {
    marginBottom: 16,
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
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  table: {
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: 'lightgray',
  },
  tableCell: {
    flex: 1,
    padding: 8,
  },
  tableHeader: {
    backgroundColor: 'lightgray',
  },
  tableHeaderText: {
    fontWeight: 'bold',
  },
});