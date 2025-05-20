
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function RemindersScreen() {
    const [tasks, setTasks] = useState([]);
    const [taskText, setTaskText] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const addTask = () => {
        if (taskText.trim()) {
            setTasks([...tasks, { text: taskText, date: selectedDate.toLocaleString() }]);
            setTaskText('');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reminders</Text>

            <Text style={styles.sectionTitle}>Recommended Activities</Text>
            <Text style={styles.activity}>• Draw/Doodle</Text>
            <Text style={styles.activity}>• Poem</Text>
            <Text style={styles.activity}>• Walking</Text>
            <Text style={styles.activity}>• Singing/Listening to Music</Text>
            <Text style={styles.activity}>• Seek Professional Help</Text>

            <Text style={styles.sectionTitle}>Add Task</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter task..."
                value={taskText}
                onChangeText={setTaskText}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                <Text style={styles.dateButtonText}>Pick Date & Time</Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="datetime"
                    display="default"
                    onChange={(event, date) => {
                        setShowDatePicker(false);
                        if (date) setSelectedDate(date);
                    }}
                />
            )}

            <TouchableOpacity style={styles.addButton} onPress={addTask}>
                <Text style={styles.addButtonText}>Add Task</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Appointments & Tasks</Text>
            <FlatList
                data={tasks}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.taskItem}>
                        <Text style={styles.taskText}>{item.text}</Text>
                        <Text style={styles.taskDate}>{item.date}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    activity: {
        fontSize: 16,
        marginLeft: 10,
        marginVertical: 3,
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    dateButton: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    dateButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#27ae60',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    taskItem: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        elevation: 3,
    },
    taskText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    taskDate: {
        fontSize: 14,
        color: 'gray',
    },
});
