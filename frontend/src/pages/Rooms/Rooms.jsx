import React from 'react'
import styles from './Rooms.module.css'
import RoomCard from '../../components/RoomCard/RoomCard';
import AddRoomModel from '../../components/AddRoomModel/AddRoomModel';
import { useState,useEffect } from 'react';
import {getAllRooms} from '../../http';

// const rooms = [
//   {
//     id: 1,
//     topic: 'Which framework best for frontend ?',
//     speakers: [
//       {
//         id: 1,
//         name: 'John',
//         avatar: '/images/monkey-emoji.png'
//       },
//       {
//         id: 2,
//         name: 'Virat',
//         avatar: '/images/monkey-emoji.png'
//       },
//       {
//         id: 3,
//         name: 'Anushka',
//         avatar: '/images/monkey-emoji.png'
//       },
//     ],
//     totalPeople: 40
//   },
//   {
//     id: 2,
//     topic: 'Which framework best for frontend ?',
//     speakers: [
//       {
//         id: 1,
//         name: 'John',
//         avatar: '/images/monkey-emoji.png'
//       },
//       {
//         id: 2,
//         name: 'Virat',
//         avatar: '/images/monkey-emoji.png'
//       },
//       {
//         id: 3,
//         name: 'Anushka',
//         avatar: '/images/monkey-emoji.png'
//       },
//     ],
//     totalPeople: 40
//   },
//   {
//     id: 3,
//     topic: 'Which framework best for frontend ?',
//     speakers: [
//       {
//         id: 1,
//         name: 'John',
//         avatar: '/images/monkey-emoji.png'
//       },
//       {
//         id: 2,
//         name: 'Virat',
//         avatar: '/images/monkey-emoji.png'
//       },
//       {
//         id: 3,
//         name: 'Anushka',
//         avatar: '/images/monkey-emoji.png'
//       },
//     ],
//     totalPeople: 40
//   },
//   {
//     id: 4,
//     topic: 'Which framework best for frontend ?',
//     speakers: [
//       {
//         id: 1,
//         name: 'John',
//         avatar: '/images/monkey-emoji.png'
//       },
//       {
//         id: 2,
//         name: 'Virat',
//         avatar: '/images/monkey-emoji.png'
//       },
//       {
//         id: 3,
//         name: 'Anushka',
//         avatar: '/images/monkey-emoji.png'
//       },
//     ],
//     totalPeople: 40
//   }
// ]

function Rooms() {

  const [showModel,setShowModel] = useState(false);
  const [rooms,setRooms] = useState([]);
  
  useEffect(() => {
    const fetchRooms = async ()=>{
      const {data} = await getAllRooms();
      setRooms(data);
    }

    fetchRooms();
  }, [])

  function openModel(){
    setShowModel(true);
  }

  
  return<>
    <div className='container'>
      <div className={styles.roomsHeader}>
        <div className={styles.left}>
          <span className={styles.heading}>All Voice Rooms</span>
          <div className={styles.searchBox}>
            <img className={styles.searchImg} src="/images/search-icon.png" alt="search" />
            <input type="text" className={styles.searchInput}/>
          </div>
        </div>
        <div className={styles.right}>
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