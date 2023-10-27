import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import './Toggle.css'

/* eslint-disable */

// console.log(window.location)
// const origin = window.location.origin

const Toggle = () => {
  let history = useHistory()
  const checkbox = document.getElementById('checkbox')
  const v1Farm = document.querySelector('.v1Toggle')
  const v2Farm = document.querySelector('.v2Toggle')

  if (v1Farm?.classList == ' toggleActive') {
    v1Farm?.classList.remove('toggleActive')
  }

  checkbox?.addEventListener('change', function () {
    if (this.checked) {
      // History instance allows us to navigate to either V1 Farms or V2
      history.push('/bsc/farms/v2')
      for (let i = 0; i < v2Farm?.classList.length; i++) {
        if (v2Farm.classList[i] == 'toggleActive') {
          return
        } else {
          if (v1Farm != null && v2Farm != null) {
            v2Farm.className = 'form-check-label v2Farm toggleActive'
            v1Farm.className = 'form-check-label v1Farm'
          }
        }
      }
    } else if (!this.checked) {
      history.push('/farms')
      for (let i = 0; i < v1Farm?.classList.length; i++) {
        if (v1Farm.classList[i] == 'toggleActive') {
          return
        } else {
          if (v1Farm != null && v2Farm != null) {
            v1Farm.className = 'form-check-label v1Farm toggleActive'
            v2Farm.className = 'form-check-label v2Farm'
          }
        }
      }
    }
  })

  return (
    <div className="sokuswap__toggleContainer">
      <p className="form-check-label v1Farm toggleActive">V1</p>
      <CheckBoxWrapper>
        <CheckBox id="checkbox" type="checkbox" defaultChecked={false} />
        <CheckBoxLabel htmlFor="checkbox" />
      </CheckBoxWrapper>
      <p className="form-check-label v2Farm">V2</p>
    </div>
  )
}

const CheckBoxWrapper = styled.div`
  position: relative;
`
const CheckBoxLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 25px;
  border-radius: 15px;
  background: #ebebeb;
  cursor: pointer;
  &::after {
    content: '';
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background: #04bbfb;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`
const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 40px;
  height: 25px;
  &:checked + ${CheckBoxLabel} {
    background: #fff;
    &::after {
      content: '';
      display: block;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-left: 26px;
      transition: 0.2s;
    }
  }
`

export default Toggle
