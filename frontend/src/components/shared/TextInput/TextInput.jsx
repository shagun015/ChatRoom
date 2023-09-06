import React from 'react';
import styles from './TextInput.module.css';

const TextInput = ({ value, onChange }) => {
  return (
    <div>
      <input
        className={styles.input}
        type="text"
        value={value} // Pass the 'value' prop here
        onChange={onChange} // Pass the 'onChange' prop here
      />
    </div>
  );
};

export default TextInput;
