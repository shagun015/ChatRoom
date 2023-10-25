import React,{useState,useEffect} from 'react'
import { useWebRTC } from '../../hooks/useWebRtc'
import { useParams, useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux';
import styles from './Room.module.css';
import {getRoom} from '../../http';

const Room = () => {
  const {id: roomId} = useParams();

  const user = useSelector((state)=>state.auth.user);

  const {clients,provideRef,handleMute} = useWebRTC(roomId, user);
  //const [ numberOfClients, setNumberOfClients ] = useState(clients);
  const [isMute,setIsMute] = useState(true);

  const [room,setRoom] = useState(null);
  
  const navigate=useNavigate();

  //handling mute fn
  useEffect(() => {
    handleMute(isMute,user.id);
  }, [isMute])
  
  //
  // useEffect(() => {
  //   setNumberOfClients(() => {
  //       return [...new Set(clients)];
  //   })
  // }, [clients])

  const handleManualLeave = ()=>{
    navigate('/rooms');
  }

  //to fetch room details
  useEffect(()=>{
    const fetchRoom = async ()=>{
      const {data} = await getRoom(roomId);
      setRoom((prev)=>data);
    }
    fetchRoom();
  },[roomId])

  const handleMuteClick = (clientId)=>{
    if(clientId !== user.id)return;
    setIsMute((isMute)=>!isMute);
  };

  return (
    <div>
      <div className="container">
        <button onClick={handleManualLeave} className={styles.goBack}>
          <img src='/images/arrow-left.png' alt='arrow-left'/>
          <span>All voice rooms</span>
        </button>
      </div>
      <div className={styles.clientsWrap}>
        <div className={styles.header}>
          <h2 className={styles.topic}>{room?.topic}</h2>
          <div className={styles.actions}>
            <button>
              <img src="/images/palm.png" alt="palm" />
            </button>
            <button onClick={handleManualLeave}>
              <img src="/images/win.png" alt="win" />
              <span>Leave quietly</span>
            </button>
          </div>
        </div>
        <div className={styles.clientsList}>
          {
          clients.map(client=>{
            return <div className={styles.client} key={client.id}>
              
                <div className={styles.userHead}>
                  <audio 
                    ref={(instance)=>provideRef(instance,client.id)} 
                    autoPlay
                  ></audio>
                  <img className={styles.userAvatar} src={client.avatar} alt="avatar"/>
                  <button onClick={()=>handleMuteClick(client.id)} className={styles.micBtn}>
                    {client.muted ?
                    (<img src="/images/mic-mute.png" alt="mic-mute" />)
                    :(<img src="/images/mic.png" alt="mic" />) }
              
                  </button>
                </div>
              <h4>{client.name}</h4>
            </div>
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Room