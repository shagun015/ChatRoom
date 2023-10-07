import React, { useState } from 'react'
import Button from '../../../components/shared/Button/Button'
import Card from '../../../components/shared/Card/Card'
import TextInput from '../../../components/shared/TextInput/TextInput'
import styles from './StepOtp.module.css'
import { verifyOtp } from '../../../http'
import {useSelector} from 'react-redux'
import {setAuth} from '../../../store/authSlice'
import {useDispatch} from 'react-redux'
import Loader from '../../../components/shared/Loader/Loader'
const StepOtp = () => {
  const [otp,setOtp] = useState(''); 
  const {phone,hash} = useSelector((state)=> state.auth.otp);
  const [loading,setLoading] = useState(false);
  const dispatch = useDispatch();
  async function submit(){
    if(!otp || !phone || !hash) return;
    try {
      setLoading(true);
      const { data }= await verifyOtp({otp,phone,hash});
      console.log(data);
      dispatch(setAuth(data));
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false);
    }
  }
  if(loading) return <Loader message={"Authentication in progress..."}/>
  return (
    <>
      <div className={styles.cardWrapper}>
        <Card title="Enter OTP" icon="lock">
          <TextInput value={otp} onChange={(e)=>{
            setOtp(e.target.value)
          }}/>

          <div>
            <p className={styles.bottomText}>
              Didn't receive
            </p>
            <div className={styles.actionButtonWrap}>
              <Button onclick={submit} title="Next"></Button>
            </div>
          </div>
      
        
        </Card>
      </div>
    </>
  )
}

export default StepOtp