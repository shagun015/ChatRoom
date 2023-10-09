import React,{useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import styles from './StepAvatar.module.css'
import Button from '../../../components/shared/Button/Button'
import Card from '../../../components/shared/Card/Card'
import {useDispatch,useSelector} from 'react-redux'
import { setAvatar } from '../../../store/activateSlice'
import { activate } from '../../../http'
import { setAuth } from '../../../store/authSlice'
import Loader from '../../../components/shared/Loader/Loader'

const StepAvatar = ({onNext}) => {
  const {name,avatar} = useSelector(state=>state.activate);
  const [image,setImage] = useState('/images/logo.png');
  const [loading,setLoading] = useState(false);
  const [unMounted,setUnMounted] = useState(false);
  const dispatch = useDispatch();
  function captureImage(e){
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function(){
      console.log(reader.result);
      setImage(reader.result);
      dispatch(setAvatar(reader.result));
    };

  }
  async function submit(){
    if(!name || !avatar) return;
    setLoading(true);
    try{
      const {data} = await activate({name,avatar});
      if(data.auth){
        if(!unMounted){
          dispatch(setAuth(data));
        }
      }
      
    }
    catch (err) {
      console.log(err);
    }
    finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    return ()=>{
      setUnMounted(true);
    }
  });

  if(loading) return <Loader message={"Activation in progress..."}/>
  return(
    <>
      <div className={styles.cardWrapper}>
      <Card title={`Okay, ${name}`} icon="monkey-emoji">
          <p className={styles.subHeading}>How's this photo?</p>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatarWrapper2} >
              <img className={styles.avatarImage} src={image} alt='avatar' ></img>
            </div>
          </div>
          <div>
            <input 
              onChange={captureImage}
              id="avatarInput"
              type="file" 
              className={styles.avatarInput}/>
            <label 
              className={styles.avatarLabel} 
              htmlFor='avatarInput'>
              Choose a different photo
            </label>
          </div>
          <div className={styles.actionButtonWrap}>
            <Button onclick={submit} title="Next"></Button>
          </div>
        </Card>
      </div>
    </>
  )
}

export default StepAvatar;
