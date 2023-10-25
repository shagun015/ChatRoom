import React from 'react';
import styles from './RoomPopUp.module.css';
function RoomPopup({ roomId, onClose }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomId);
    alert('Room ID copied to clipboard!');
  };

  return (
    <div className={styles.popupMask}>
      <div className={styles.popupBody}>
        <h2>Your Room ID:</h2>
        <div className={styles.popup}>
          <p>{roomId}</p>
          <button className={styles.copyBtn} onClick={copyToClipboard}>
            <img src="/images/copy.png" alt="copy" />
          </button>
        </div>
        <button className={styles.closeBtn} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default RoomPopup