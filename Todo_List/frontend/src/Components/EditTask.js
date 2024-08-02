import React, { useState, useEffect } from 'react';
import '../Styles/EditTask.css';

const EditTask = ({ task, onUpdateTask, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateTask({ ...task, title, description });
    onCancel();
  };

  return (
    <div className="EditTask">
      <h2>Edit Task</h2>
      <form className="EditTask-form" onSubmit={handleSubmit}>
        <input
          className="EditTask-input"
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="EditTask-textarea"
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div>
          <button className="EditTask-button" type="submit">Save Changes</button>
          <button className="EditTask-cancel-button" type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditTask;
