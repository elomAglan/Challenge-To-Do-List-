import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [filter, setFilter] = useState('all');
  const [editTaskId, setEditTaskId] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tasksArray = [];
        querySnapshot.forEach((doc) => {
          tasksArray.push({ id: doc.id, ...doc.data() });
        });
        setTasks(tasksArray);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const addTask = async () => {
    if (newTask && newDescription && user) {
      try {
        await addDoc(collection(db, 'tasks'), {
          text: newTask,
          description: newDescription,
          completed: false,
          userId: user.uid,
        });
        setNewTask('');
        setNewDescription('');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      const taskDoc = doc(db, 'tasks', id);
      await updateDoc(taskDoc, { completed: !completed });
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const saveTask = async (id, text, description) => {
    try {
      const taskDoc = doc(db, 'tasks', id);
      await updateDoc(taskDoc, { text, description });
      setEditTaskId(null); // Exit edit mode
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  return (
    <Container style={{ marginTop: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom style={{ color: '#1976d2' }}>
        Task Manager
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="New Task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            multiline
            rows={3}
            InputProps={{ style: { wordBreak: 'break-word' } }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={addTask}
            style={{ marginBottom: 16 }}
          >
            Add Task
          </Button>
        </Grid>
      </Grid>

      <TextField
        select
        label="Filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        fullWidth
        margin="normal"
        SelectProps={{ native: true }}
        variant="outlined"
      >
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="incomplete">Incomplete</option>
      </TextField>

      <List>
        {filteredTasks.map((task) => (
          <ListItem
            key={task.id}
            style={{
              background: '#f9f9f9',
              margin: '10px 0',
              borderRadius: '10px',
              padding: '20px',
            }}
            secondaryAction={
              <>
                {editTaskId === task.id ? (
                  <>
                    <IconButton edge="end" aria-label="save" onClick={() => saveTask(task.id, task.text, task.description)}>
                      <SaveIcon style={{ color: '#4caf50' }} />
                    </IconButton>
                    <IconButton edge="end" aria-label="cancel" onClick={() => setEditTaskId(null)}>
                      <CancelIcon style={{ color: '#f44336' }} />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton edge="end" aria-label="edit" onClick={() => setEditTaskId(task.id)}>
                      <EditIcon style={{ color: '#1976d2' }} />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(task.id)}>
                      <DeleteIcon style={{ color: '#dc004e' }} />
                    </IconButton>
                  </>
                )}
              </>
            }
          >
            {editTaskId === task.id ? (
              <>
                <TextField
                  value={task.text}
                  onChange={(e) =>
                    setTasks(tasks.map((t) =>
                      t.id === task.id ? { ...t, text: e.target.value } : t
                    ))
                  }
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  value={task.description}
                  onChange={(e) =>
                    setTasks(tasks.map((t) =>
                      t.id === task.id ? { ...t, description: e.target.value } : t
                    ))
                  }
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={2}
                />
              </>
            ) : (
              <ListItemText
                primary={
                  <Typography
                    variant="h6"
                    style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                  >
                    {task.text}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      style={{ wordBreak: 'break-word' }}
                    >
                      {task.description}
                    </Typography>
                    <IconButton onClick={() => toggleComplete(task.id, task.completed)}>
                      {task.completed ? (
                        <CheckBoxIcon style={{ color: '#4caf50' }} />
                      ) : (
                        <CheckBoxOutlineBlankIcon />
                      )}
                    </IconButton>
                  </>
                }
              />
            )}
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default TaskList;
