import React, { useState } from 'react';
import './EditableField.css';

function EditableField({ value, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
    onUpdate(inputValue);
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="editable-field" onClick={!editing ? handleEdit : undefined}>
      {editing ? (
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
        />
      ) :(
        <span>{inputValue}</span>
      )}
    </div>
  );
}

export default EditableField;
