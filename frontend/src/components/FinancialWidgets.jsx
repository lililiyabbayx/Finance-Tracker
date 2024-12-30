import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const FinancialWidgets = () => {
  const [userType, setUserType] = useState('personal');
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [topPerformers, setTopPerformers] = useState([]);
  const [newPerformer, setNewPerformer] = useState({ name: '', achievement: '', month: '' });
  const [monthlyGoals, setMonthlyGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ description: '', target: '', progress: 0 });
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setTodoList([...todoList, { text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const handleToggleTodo = (index) => {
    const newList = [...todoList];
    newList[index].completed = !newList[index].completed;
    setTodoList(newList);
  };

  const handleDeleteTodo = (index) => {
    setTodoList(todoList.filter((_, i) => i !== index));
  };

  const handleAddPerformer = () => {
    if (newPerformer.name && newPerformer.achievement && newPerformer.month) {
      setTopPerformers([...topPerformers, newPerformer]);
      setNewPerformer({ name: '', achievement: '', month: '' });
      setOpenDialog(false);
    }
  };

  const handleAddGoal = () => {
    if (newGoal.description && newGoal.target) {
      setMonthlyGoals([...monthlyGoals, { ...newGoal, progress: 0 }]);
      setNewGoal({ description: '', target: '', progress: 0 });
      setOpenDialog(false);
    }
  };

  const handleUpdateGoalProgress = (index, progress) => {
    const newGoals = [...monthlyGoals];
    newGoals[index].progress = Math.min(100, Math.max(0, progress));
    setMonthlyGoals(newGoals);
  };

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel>User Type</InputLabel>
          <Select
            value={userType}
            label="User Type"
            onChange={handleUserTypeChange}
            sx={{ mb: 3 }}
          >
            <MenuItem value="personal">Personal User</MenuItem>
            <MenuItem value="business">Business User</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* To-Do List Widget - Common for both user types */}
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              height: '100%',
              background: 'linear-gradient(45deg, #E3F2FD 30%, #BBDEFB 90%)'
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#1976D2' }}>
                To-Do List
              </Typography>
              
              <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Add new task"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                />
                <Button
                  variant="contained"
                  onClick={handleAddTodo}
                  sx={{ 
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white' 
                  }}
                >
                  <AddIcon />
                </Button>
              </Box>

              <List>
                {todoList.map((todo, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      bgcolor: 'background.paper',
                      mb: 1,
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <Checkbox
                      checked={todo.completed}
                      onChange={() => handleToggleTodo(index)}
                      color="primary"
                    />
                    <ListItemText
                      primary={todo.text}
                      sx={{
                        textDecoration: todo.completed ? 'line-through' : 'none'
                      }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteTodo(index)}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Conditional Widgets based on user type */}
        <Grid item xs={12} md={6}>
          {userType === 'business' ? (
            <Card 
              sx={{ 
                height: '100%',
                background: 'linear-gradient(45deg, #E8F5E9 30%, #C8E6C9 90%)'
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: '#2E7D32' }}>
                  Top Performers
                </Typography>
                
                <Button
                  variant="contained"
                  onClick={() => handleOpenDialog('performer')}
                  sx={{ 
                    mb: 2,
                    background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
                    color: 'white'
                  }}
                >
                  Add Top Performer
                </Button>

                <List>
                  {topPerformers.map((performer, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        bgcolor: 'background.paper',
                        mb: 1,
                        borderRadius: 1,
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <EmojiEventsIcon sx={{ mr: 2, color: '#FFD700' }} />
                      <ListItemText
                        primary={performer.name}
                        secondary={`${performer.achievement} - ${performer.month}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          ) : (
            <Card 
              sx={{ 
                height: '100%',
                background: 'linear-gradient(45deg, #F3E5F5 30%, #E1BEE7 90%)'
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: '#7B1FA2' }}>
                  Monthly Goals
                </Typography>
                
                <Button
                  variant="contained"
                  onClick={() => handleOpenDialog('goal')}
                  sx={{ 
                    mb: 2,
                    background: 'linear-gradient(45deg, #9C27B0 30%, #BA68C8 90%)',
                    color: 'white'
                  }}
                >
                  Add New Goal
                </Button>

                <List>
                  {monthlyGoals.map((goal, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        bgcolor: 'background.paper',
                        mb: 1,
                        borderRadius: 1,
                        '&:hover': { bgcolor: 'action.hover' },
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                      }}
                    >
                      <ListItemText
                        primary={goal.description}
                        secondary={`Target: ${goal.target}`}
                      />
                      <Box sx={{ width: '100%', mt: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={goal.progress} 
                          sx={{ 
                            height: 8,
                            borderRadius: 4,
                            bgcolor: '#E1BEE7',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#9C27B0'
                            }
                          }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            Progress: {goal.progress}%
                          </Typography>
                          <TextField
                            size="small"
                            type="number"
                            value={goal.progress}
                            onChange={(e) => handleUpdateGoalProgress(index, parseInt(e.target.value))}
                            sx={{ width: 80 }}
                          />
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Dialog for adding performers/goals */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {dialogType === 'performer' ? 'Add Top Performer' : 'Add Monthly Goal'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'performer' ? (
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Name"
                value={newPerformer.name}
                onChange={(e) => setNewPerformer({ ...newPerformer, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Achievement"
                value={newPerformer.achievement}
                onChange={(e) => setNewPerformer({ ...newPerformer, achievement: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Month"
                value={newPerformer.month}
                onChange={(e) => setNewPerformer({ ...newPerformer, month: e.target.value })}
              />
            </Box>
          ) : (
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Goal Description"
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Target"
                value={newGoal.target}
                onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={dialogType === 'performer' ? handleAddPerformer : handleAddGoal}
            variant="contained"
            sx={{
              background: dialogType === 'performer' 
                ? 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)'
                : 'linear-gradient(45deg, #9C27B0 30%, #BA68C8 90%)',
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FinancialWidgets;
