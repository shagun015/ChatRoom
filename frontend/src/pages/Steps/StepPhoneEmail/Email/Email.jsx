import React, { useState } from 'react'
import Button from '../../../../components/shared/Button/Button'
import Card from '../../../../components/shared/Card/Card'
import TextInput from '../../../../components/shared/TextInput/TextInput'
import styles from '../StepPhoneEmail.module.css'
function Email({onNext}) {
  const [email,setEmail] = useState(''); 
  return (
    <Card title="Enter Your Email" icon="mail">
      <TextInput value={email} onChange={()=>{
        setEmail(e.target.value)
       }}/>

      <div>
        <div className={styles.actionButtonWrap}>
          <Button title="Next" onclick={onNext}></Button>
        </div>
        <p className={styles.bottomText}>
          By entering your Email, you're agreeing to our Terms of Service and Privacy Policy. Thanks!
        </p>
      </div>
     
      
    </Card>
  )
}

export default Email