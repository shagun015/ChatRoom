import React from 'react';
import styles from './TextInput.module.css';

const TextInput = ({ value, onChange, fullWidth }) => {
  return (
    <div>
      <input  
        style={{width: fullWidth==='true'? '100%':'inherit'}}
        className={styles.input}
        type="text"
        value={value} // Pass the 'value' prop here
        onChange={onChange} // Pass the 'onChange' prop here
      />
    </div>
  );
};

export default TextInput;
