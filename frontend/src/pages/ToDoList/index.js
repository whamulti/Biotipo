import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Fade from '@material-ui/core/Fade';
import LinearProgress from '@material-ui/core/LinearProgress';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';

import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import SearchIcon from '@material-ui/icons/Search';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import TodayIcon from '@material-ui/icons/Today';
import UpdateIcon from '@material-ui/icons/Update';
import ListAltIcon from '@material-ui/icons/ListAlt';

import MainContainer from '../../components/MainContainer';
import MainHeader from '../../components/MainHeader';
import MainHeaderButtonsWrapper from '../../components/MainHeaderButtonsWrapper';
import Title from '../../components/Title';

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    border: '1px solid rgba(34, 197, 94, 0.1)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  inputContainer: {
    padding: theme.spacing(3),
    backgroundColor: '#f8fafc',
    borderBottom: '2px solid #e2e8f0',
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
  taskInput: {
    flex: 1,
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: 'white',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      '& fieldset': {
        borderColor: '#e2e8f0',
        borderWidth: '1px',
      },
      '&:hover fieldset': {
        borderColor: '#cbd5e1',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#22c55e',
        borderWidth: '2px',
      },
      '& input': {
        padding: '14px 16px',
        fontSize: '15px',
      },
    },
  },
  searchField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: 'white',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      '& fieldset': {
        borderColor: '#e2e8f0',
        borderWidth: '1px',
      },
      '&:hover fieldset': {
        borderColor: '#cbd5e1',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#22c55e',
        borderWidth: '2px',
      },
      '& input': {
        padding: '12px 14px',
        fontSize: '14px',
      },
    },
  },
  addButton: {
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: 'white',
    borderRadius: '12px',
    padding: '12px 32px',
    fontWeight: 600,
    fontSize: '14px',
    textTransform: 'none',
    boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)',
    transition: 'all 0.3s ease',
    minWidth: '140px',
    '&:hover': {
      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
      boxShadow: '0 6px 20px rgba(34, 197, 94, 0.4)',
      transform: 'translateY(-1px)',
    },
  },
  saveButton: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: 'white',
    borderRadius: '12px',
    padding: '12px 32px',
    fontWeight: 600,
    fontSize: '14px',
    textTransform: 'none',
    boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
    transition: 'all 0.3s ease',
    minWidth: '140px',
    '&:hover': {
      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
      transform: 'translateY(-1px)',
    },
  },
  listContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: theme.spacing(2),
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f5f9',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#cbd5e1',
      borderRadius: '4px',
      '&:hover': {
        background: '#94a3b8',
      },
    },
  },
  listItem: {
    backgroundColor: 'white',
    borderRadius: '12px',
    marginBottom: theme.spacing(1.5),
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
    padding: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#f0fdf4',
      transform: 'translateX(4px)',
      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.1)',
      borderColor: '#bbf7d0',
    },
    '&.completed': {
      opacity: 0.7,
      backgroundColor: '#f8fafc',
      '& $taskText': {
        textDecoration: 'line-through',
        color: '#94a3b8',
      },
    },
  },
  taskContent: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    flex: 1,
  },
  taskText: {
    fontSize: '15px',
    color: '#0f172a',
    fontWeight: 500,
  },
  taskMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(0.5),
  },
  dateChip: {
    height: '24px',
    fontSize: '11px',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    '& .MuiChip-icon': {
      fontSize: '14px',
      color: '#94a3b8',
    },
  },
  actionButton: {
    padding: '8px',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
  editButton: {
    color: '#22c55e',
    backgroundColor: '#f0fdf4',
    marginRight: theme.spacing(0.5),
    '&:hover': {
      backgroundColor: '#dcfce7',
    },
  },
  deleteButton: {
    color: '#ef4444',
    backgroundColor: '#fef2f2',
    '&:hover': {
      backgroundColor: '#fee2e2',
    },
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(8),
    color: '#94a3b8',
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: theme.spacing(2),
    opacity: 0.3,
  },
  statsCard: {
    display: 'flex',
    gap: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    border: '1px solid rgba(34, 197, 94, 0.1)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  },
  statItem: {
    flex: 1,
    textAlign: 'center',
    padding: theme.spacing(2),
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#f0fdf4',
      transform: 'translateY(-2px)',
    },
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '13px',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  checkbox: {
    color: '#cbd5e1',
    '&.Mui-checked': {
      color: '#22c55e',
    },
  },
  loadingBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    zIndex: 1,
  },
}));

const ToDoList = () => {
  const classes = useStyles();

  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [searchParam, setSearchParam] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleTaskChange = (event) => {
    setTask(event.target.value);
  };

  const handleAddTask = () => {
    if (!task.trim()) {
      return;
    }

    const now = new Date();
    if (editIndex >= 0) {
      const newTasks = [...tasks];
      newTasks[editIndex] = {
        ...newTasks[editIndex],
        text: task,
        updatedAt: now,
      };
      setTasks(newTasks);
      setTask('');
      setEditIndex(-1);
    } else {
      setTasks([...tasks, {
        text: task,
        createdAt: now,
        updatedAt: now,
        completed: false,
      }]);
      setTask('');
    }
  };

  const handleEditTask = (index) => {
    setTask(tasks[index].text);
    setEditIndex(index);
  };

  const handleDeleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const handleToggleComplete = (index) => {
    const newTasks = [...tasks];
    newTasks[index] = {
      ...newTasks[index],
      completed: !newTasks[index].completed,
      updatedAt: new Date(),
    };
    setTasks(newTasks);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchParam)
  );

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  };

  const { total, completed, pending } = getTaskStats();

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <MainContainer>
      <MainHeader>
        <Title>Lista de Tarefas</Title>
        <MainHeaderButtonsWrapper>
          <TextField
            placeholder="Buscar tarefas..."
            type="search"
            value={searchParam}
            onChange={handleSearch}
            className={classes.searchField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: '#94a3b8', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
        </MainHeaderButtonsWrapper>
      </MainHeader>

      <Box className={classes.statsCard}>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber}>{total}</Typography>
          <Typography className={classes.statLabel}>Total de Tarefas</Typography>
        </Box>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber} style={{ color: '#22c55e' }}>
            {completed}
          </Typography>
          <Typography className={classes.statLabel}>Concluídas</Typography>
        </Box>
        <Box className={classes.statItem}>
          <Typography className={classes.statNumber} style={{ color: '#f59e0b' }}>
            {pending}
          </Typography>
          <Typography className={classes.statLabel}>Pendentes</Typography>
        </Box>
      </Box>

      <Paper className={classes.mainPaper} variant="outlined">
        {loading && (
          <LinearProgress className={classes.loadingBar} color="primary" />
        )}
        
        <Box className={classes.inputContainer}>
          <TextField
            className={classes.taskInput}
            placeholder="Digite uma nova tarefa..."
            value={task}
            onChange={handleTaskChange}
            variant="outlined"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddTask();
              }
            }}
          />
          <Button
            variant="contained"
            className={editIndex >= 0 ? classes.saveButton : classes.addButton}
            onClick={handleAddTask}
            startIcon={editIndex >= 0 ? <SaveIcon /> : <AddIcon />}
          >
            {editIndex >= 0 ? 'Salvar' : 'Adicionar'}
          </Button>
        </Box>

        <div className={classes.listContainer}>
          {filteredTasks.length === 0 ? (
            <Box className={classes.emptyState}>
              <ListAltIcon className={classes.emptyStateIcon} />
              <Typography variant="h6" style={{ marginBottom: 8 }}>
                {searchParam ? 'Nenhuma tarefa encontrada' : 'Nenhuma tarefa criada'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {searchParam ? 'Tente buscar com outros termos' : 'Adicione sua primeira tarefa acima'}
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredTasks.map((task, index) => (
                <Fade in key={index}>
                  <ListItem
                    className={`${classes.listItem} ${task.completed ? 'completed' : ''}`}
                  >
                    <Box className={classes.taskContent}>
                      <Checkbox
                        checked={task.completed || false}
                        onChange={() => handleToggleComplete(index)}
                        className={classes.checkbox}
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<CheckCircleIcon />}
                      />
                      <Box flex={1}>
                        <Typography className={classes.taskText}>
                          {task.text}
                        </Typography>
                        <Box className={classes.taskMeta}>
                          <Chip
                            size="small"
                            icon={<TodayIcon />}
                            label={`Criada: ${formatDate(task.createdAt)}`}
                            className={classes.dateChip}
                          />
                          {task.updatedAt && task.updatedAt !== task.createdAt && (
                            <Chip
                              size="small"
                              icon={<UpdateIcon />}
                              label={`Atualizada: ${formatDate(task.updatedAt)}`}
                              className={classes.dateChip}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                    <ListItemSecondaryAction>
                      <Tooltip title="Editar tarefa">
                        <IconButton
                          className={`${classes.actionButton} ${classes.editButton}`}
                          onClick={() => handleEditTask(tasks.indexOf(task))}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir tarefa">
                        <IconButton
                          className={`${classes.actionButton} ${classes.deleteButton}`}
                          onClick={() => handleDeleteTask(tasks.indexOf(task))}
                          size="small"
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Fade>
              ))}
            </List>
          )}
        </div>
      </Paper>
    </MainContainer>
  );
};

export default ToDoList;