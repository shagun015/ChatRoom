import React from 'react'
import styles from './AddRoomModel.module.css'
import TextInput from '../shared/TextInput/TextInput'
import { useState } from 'react'
import { createRoom as create } from '../../http'
import {useNavigate} from 'react-router-dom';
import RoomPopup from '../RoomPopUp/RoomPopUp'
function AddRoomModel({onClose}) {

  const navigate=useNavigate();

  const [roomType,setRoomType] = useState('open');
  const [topic,setTopic] = useState('');

  //
  const [roomId, setRoomId] = useState('652ee249ae32df67ddadcefd');
  const [showPopup, setShowPopup] = useState(false);
  

  async function createRoom(){
    //server call
    try {
      if(!topic) return;
      const {data} = await create({topic,roomType});
      setRoomId(data.id);
      if(roomType==='social'||roomType==='closed'){
        setShowPopup(true);
      }
      else{
        navigate(`/room/${data.id}`)
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  return (
    <div className={styles.modalMask}>
      <div className={styles.modelBody}>
        <button onClick={onClose} className={styles.closeButton}>
          <img src="images/Close.png" alt="close" /> 
        </button>
        <div className={styles.modelHeader}>
          <h2>Enter the topic to be discussed</h2>
          <TextInput value={topic} onChange={(e)=>setTopic(e.target.value)} fullWidth='true'/>
          <h2>Room Type</h2>
          <div className={styles.roomTypes}>
            <div onClick={()=>setRoomType('open')} className={`${styles.typeBox} ${roomType === 'open' ?styles.active:''}`}>
              <img src='/images/Globe.png' alt='global'/>
              <span>Open</span>
            </div>
            <div onClick={()=>setRoomType('social')} className={`${styles.typeBox} ${roomType === 'social' ?styles.active:''}`}>
              <img src='/images/Social.png' alt='Social'/>
              <span>Social</span>
            </div>
            <div onClick={()=>setRoomType('closed')} className={`${styles.typeBox} ${roomType === 'closed' ?styles.active:''}`}>
              <img src='/images/Closed.png' alt='Closed'/>
              <span>Closed</span>
            </div>
          </div>
        </div>
        <div className={styles.modelFooter}>
          <h3>Start a room, open to everyone</h3>
          <button onClick={createRoom} className={styles.startRoomButton} >
            <img src='/images/Celebration.png' alt='add-room'/>
            <span>Let's go</span>
          </button>
        </div>
        {showPopup && <RoomPopup roomId={roomId} onClose={() => {
          setShowPopup(false);
          navigate(`/room/${roomId}`);
        }} />}
      </div>
    </div>
  )
}

export default AddRoomModel