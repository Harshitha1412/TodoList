import React, { useState } from 'react';
import '../Styles/CreateTask.css';

const CreateTask = ({ onAddTask, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill in both the title and description.');
      return;
    }
    onAddTask({ title, description, completed: false, timestamp: new Date() });
    setTitle('');
    setDescription('');
  };

  return (
    <div className="CreateTask">
      <h2>Create Task</h2>
      <form className="CreateTask-form" onSubmit={handleSubmit}>
        <div className="inputbox">
        
          <input
            className="CreateTask-input"
            type="text"
            
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            
          />
          <span>Task Title</span>
          <i></i>
        </div>
        <div className="inputbox">
          <textarea
            className="CreateTask-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
          <span>Task Description</span>
          <i></i>
        </div>
        <div>
          <button className="CreateTask-button" type="submit">
            Add Task
          </button>
          <button
            className="CreateTask-button"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;
