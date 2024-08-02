import React from 'react';
import TaskItem from './TaskItem';
import '../Styles/TaskList.css';


const TaskList = ({ tasks, onEditTask, onDeleteTask, searchQuery, setTasks }) => {
  const handleToggleComplete = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed, timestamp: new Date().toISOString() } : task
    );

    setTasks(updatedTasks);
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTasks.find(task => task.id === id)),
    }).catch(error => console.error('Error updating task:', error));
  };

  return (
    <div className="Notebook-container">
      <div className="Notebook-binding">
        {Array(6).fill().map((_, index) => (
          <span key={index}></span>
        ))}
      </div>
      <div className="Notebook-content">
        {tasks
          .filter(task => task.title?.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onToggleComplete={handleToggleComplete}
            />
          ))}
      </div>
    </div>
  );
};

export default TaskList;
