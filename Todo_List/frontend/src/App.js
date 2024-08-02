import React, { useState, useEffect } from 'react';
import CreateTask from './Components/CreateTask';
import EditTask from './Components/EditTask';
import TaskList from './Components/TaskList';
import './Styles/App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState('list');
  const [taskToEdit, setTaskToEdit] = useState(null);
  
  
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(4); 

  
  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const addTask = (task) => {
    task.id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
    fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })
      .then(response => response.json())
      .then(newTask => setTasks([...tasks, newTask]))
      .catch(error => console.error('Error adding task:', error));
    setCurrentView('list');
  };

  const updateTask = (updatedTask) => {
    fetch(`http://localhost:5000/api/tasks/${updatedTask.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    })
      .then(response => response.json())
      .then(() => {
        setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
        setCurrentView('list');
      })
      .catch(error => console.error('Error updating task:', error));
  };

  const deleteTask = (id) => {
    fetch(`http://localhost:5000/api/tasks/${id}`, { method: 'DELETE' })
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setCurrentView('edit');
  };

  const cancelEdit = () => {
    setTaskToEdit(null);
    setCurrentView('list');
  };

  
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const paginatedTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  return (
    <div className="App">
      <h1>Todo List</h1>
      {currentView === 'list' && (
        <>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search Tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={() => setCurrentView('create')}>Create Task</button>
          </div>
          <TaskList 
            tasks={paginatedTasks} 
            onEditTask={handleEditTask}
            onDeleteTask={deleteTask}
            searchQuery={searchQuery}
            setTasks={setTasks} 
          />
        </>
      )}
      {currentView === 'create' && (
        <CreateTask onAddTask={addTask} onCancel={() => setCurrentView('list')} />
      )}
      {currentView === 'edit' && taskToEdit && (
        <EditTask task={taskToEdit} onUpdateTask={updateTask} onCancel={cancelEdit} />
      )}

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button 
            key={index + 1} 
            onClick={() => handlePageChange(index + 1)}
            className={index + 1 === currentPage ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
