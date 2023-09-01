import React from 'react'
import {Link} from 'react-router-dom'
import Button from '../../../components/shared/Button/Button'
const StepAvatar = ({onNext}) => {
  
  return(
    <>
      <div>StepAvatar</div>
      <Button onclick={onNext}>Next</Button>
    </>
  )
}

export default StepAvatar;
