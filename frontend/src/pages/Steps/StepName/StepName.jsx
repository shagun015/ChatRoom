import React, { useState } from 'react'
import Button from '../../../components/shared/Button/Button'
import Card from '../../../components/shared/Card/Card'
import TextInput from '../../../components/shared/TextInput/TextInput'
import styles from './StepName.module.css'
import {useDispatch,useSelector} from 'react-redux'
import { setName } from '../../../store/activateSlice'


const StepName = ({onNext}) => {
  const {name} = useSelector(state=>state.activate);
  const dispatch = useDispatch();
  const [fullName,setFullName] = useState(name); 
  async function nextStep(){
    if(!fullName){
      return;
    }
    dispatch(setName(fullName));
    onNext();
  }
  return (
    <>
    <div className={styles.cardWrapper}>
      <Card title="What's your full name?" icon="goggle">
          <TextInput 
            value={fullName}
            onChange={(e)=>{
            setFullName(e.target.value)
            }}
          />

          <div>
            <p className={styles.bottomText}>
              People use real names at ChatRoom
            </p>
            <div className={styles.actionButtonWrap}>
              <Button onclick={nextStep} title="Next"></Button>
            </div>
          </div>
      
        
        </Card>
      </div>
    </>
  )
}

export default StepName