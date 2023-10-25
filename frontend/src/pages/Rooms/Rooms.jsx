import React from 'react'
import styles from './Rooms.module.css'
import RoomCard from '../../components/RoomCard/RoomCard';
import AddRoomModel from '../../components/AddRoomModel/AddRoomModel';
import { useState,useEffect } from 'react';
import {getAllRooms} from '../../http';
import {useNavigate} from 'react-router-dom';

function Rooms() {
  const [showModel,setShowModel] = useState(false);
  const [rooms,setRooms] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const navigate=useNavigate();

  useEffect(() => {
    const fetchRooms = async ()=>{
      const {data} = await getAllRooms();
      setRooms(data);
    }
    fetchRooms();
  }, [])

 

  
  return<>
    <div className='container'>
      <div className={styles.roomsHeader}>
        <div className={styles.left}>
          <span className={styles.heading}>All Voice Rooms</span>
        </div>
        <div className={styles.right}>
        <div className={styles.searchBox}>
            <input 
              type="text" 
              placeholder="Private Rooms(Enter RoomID)" 
              className={styles.searchInput}
              value={inputValue} 
              onChange={(e)=>{
                setInputValue(e.target.value);
              }} 
            />
            <button onClick={()=>{navigate(`/room/${inputValue}`)}} 
              className={styles.joinBtn}>Join
            </button>
          </div>
          <button onClick={()=>setShowModel(true)} className={styles.startRoomButton} >
            <img src='/images/add-room.png' alt='add-room'/>
            <span>Start a room</span>
          </button>
        </div>
      </div>

      <div className={styles.roomList}> 
        {rooms.map((room)=>(
          <RoomCard key={room.id} room={room}/>
        ))}
      </div>
    </div>
    {showModel && <AddRoomModel onClose={()=>setShowModel(false)}/>}
  </>;
}

export default Rooms