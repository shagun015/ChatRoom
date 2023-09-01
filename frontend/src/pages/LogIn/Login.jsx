import React, { useState } from 'react'
import StepPhoneEmail from '../Steps/StepPhoneEmail/StepPhoneEmail'
import Stepotp from '../Steps/StepOtp/StepOtp'
const steps = {
  1: StepPhoneEmail,
  2: Stepotp
};
function Login() {
  const [step,setStep]=useState(1);
  const Step = steps[step];
  function onNext(){
    setStep(step+1)
  }
  return(
    <Step onNext={onNext}/>
  )
}

export default Login