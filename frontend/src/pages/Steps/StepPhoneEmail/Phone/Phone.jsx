import React, { useState } from 'react'
import Card from '../../../../components/shared/Card/Card'
import TextInput from '../../../../components/shared/TextInput/TextInput'
import Button from '../../../../components/shared/Button/Button'
import styles from '../StepPhoneEmail.module.css'
import {sendOtp} from '../../../../http/index'
import {useDispatch} from 'react-redux'
import {setOtp} from '../../../../store/authSlice'
function Phone({onNext}) {
  const [phoneNumber, setPhoneNumber] = useState(''); 
  const dipatch = useDispatch();

  async function submit() {
    if(!phoneNumber) return
    const {data} = await sendOtp({ phone: phoneNumber });
    console.log('Response:', data);
    dipatch(setOtp({phone:data.phone,hash:data.hash}));
    onNext();
  }

  return (
    <Card title="Enter Your Phone Number" icon="phone">
      <TextInput
        value={phoneNumber}
        onChange={(e) => {
          setPhoneNumber(e.target.value);
        }}
      />

      <div>
        <div className={styles.actionButtonWrap}>
          <Button title="Next" onclick={submit}> {/* Corrected attribute name */}
          </Button>
        </div>
        <p className={styles.bottomText}>
          By entering your number, you're agreeing to our Terms of Service and Privacy Policy. Thanks!
        </p>
      </div>
    </Card>
  );

  
}

export default Phone;

