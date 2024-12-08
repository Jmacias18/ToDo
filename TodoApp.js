import React from 'react';
import {
  SafeAreaView,
  TextInput,
  FlatList,
  Alert,
  View, // Import View from react-native
} from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = { primary: '#1f145c', white: '#fff', lightGray: '#f5f5f5', darkGray: '#a9a9a9' };

const TodoApp = () => {
  const [todos, setTodos] = React.useState([]);
  const [textInput, setTextInput] = React.useState('');

  React.useEffect(() => {
    getTodosFromUserDevice();
  }, []);

  React.useEffect(() => {
    saveTodoToUserDevice(todos);
  }, [todos]);

  const addTodo = () => {
    if (textInput.trim() === '') {
      Alert.alert('Error', 'Por favor, ingrese una tarea válida');
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput.trim(),
        completed: false,
        dateTime: new Date().toLocaleString(), // Add the current date and time
      };
      setTodos([...todos, newTodo]);
      setTextInput('');
    }
  };

  const saveTodoToUserDevice = async (todos) => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', stringifyTodos);
    } catch (error) {
      console.log(error);
    }
  };

  const getTodosFromUserDevice = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem('todos');
      if (storedTodos != null) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const markTodoComplete = (todoId) => {
    const updatedTodos = todos.map((item) => {
      if (item.id === todoId) {
        return { ...item, completed: true };
      }
      return item;
    });

    setTodos(updatedTodos);
  };

  const deleteTodo = (todoId) => {
    const updatedTodos = todos.filter((item) => item.id !== todoId);
    setTodos(updatedTodos);
  };

  const clearAllTodos = () => {
    Alert.alert('Confirma', 'Quieres Borrar todas las tareas?', [
      { text: 'Yes', onPress: () => setTodos([]) },
      { text: 'No' },
    ]);
  };

  const ListItem = ({ todo }) => (
    <TaskCard>
      <View style={{ flex: 1 }}>
        <TaskTitle
          style={{
            textDecorationLine: todo?.completed ? 'line-through' : 'none',
          }}
        >
          {todo?.task}
        </TaskTitle>
        <TaskDateTime>{todo?.dateTime}</TaskDateTime>
      </View>
      {!todo?.completed && (
        <Icon name="done" size={20} color={COLORS.primary} onPress={() => markTodoComplete(todo.id)} />
      )}
      <Icon name="delete" size={20} color={COLORS.darkGray} onPress={() => deleteTodo(todo.id)} />
    </TaskCard>
  );

  return (
    <Container>
      <Header>
        <Title>App De Tareas</Title>
        <Icon name="delete" size={25} color={COLORS.primary} onPress={clearAllTodos} />
      </Header>
      <TaskList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ListItem todo={item} />}
      />
      <Footer>
        <InputContainer>
          <TextInput
            value={textInput}
            placeholder="Agregar tarea"
            onChangeText={(text) => setTextInput(text)}
            style={{ height: 50, color: COLORS.primary }}
          />
        </InputContainer>
        <IconContainer onPress={addTodo}>
          <Icon name="add" color={COLORS.white} size={30} />
        </IconContainer>
      </Footer>
    </Container>
  );
};

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${COLORS.lightGray};
  padding: 20px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${COLORS.white};
  padding: 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${COLORS.darkGray};
  border-radius: 10px;
  margin-bottom: 20px;
`;

const Title = styled.Text`
  font-weight: bold;
  font-size: 24px;
  color: ${COLORS.primary};
`;

const TaskList = styled(FlatList)`
  flex: 1;
`;

const TaskCard = styled.View`
  padding: 20px;
  background-color: ${COLORS.white};
  flex-direction: row;
  border-radius: 10px;
  margin: 10px 0;
  align-items: center;
  justify-content: space-between;
  border-width: 1px;
  border-color: ${COLORS.darkGray};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 5;
`;

const TaskTitle = styled.Text`
  font-weight: bold;
  font-size: 18px;
  color: ${COLORS.primary};
`;

const TaskDateTime = styled.Text`
  font-size: 14px;
  color: ${COLORS.darkGray};
`;

const Footer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
  background-color: ${COLORS.white};
  border-top-width: 1px;
  border-top-color: ${COLORS.darkGray};
  border-radius: 10px;
  margin-top: 20px;
`;

const InputContainer = styled.View`
  flex: 1;
  margin-right: 20px;
  border-radius: 30px;
  background-color: ${COLORS.white};
  border-width: 1px;
  border-color: ${COLORS.darkGray};
  padding: 0 20px;
`;

const IconContainer = styled.TouchableOpacity`
  height: 50px;
  width: 50px;
  background-color: ${COLORS.primary};
  border-radius: 25px;
  justify-content: center;
  align-items: center;
`;

export default TodoApp;