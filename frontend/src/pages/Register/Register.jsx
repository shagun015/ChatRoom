import React, { useState } from 'react'
import styles from './Register.module.css'
import {Link} from 'react-router-dom'
import Button from '../../components/shared/Button/Button'
import StepPhoneEmail from '../Steps/StepPhoneEmail/StepPhoneEmail'
import Stepotp from '../Steps/StepOtp/StepOtp'
import StepName from '../Steps/StepName/StepName'
import StepAvatar from '../Steps/StepAvatar/StepAvatar'
import StepUsername from '../Steps/StepUsername/StepUsername'

const steps = {
  1: StepPhoneEmail,
  2: Stepotp,
  3: StepName,
  4: StepAvatar,
  5: StepUsername
};

const Register = () => {
  const [step,setStep]=useState(1);
  const Step = steps[step];
  function onNext(){
    setStep(step+1)
  }
  return(
    <Step onNext={onNext}/>
  )
}

export default Register;