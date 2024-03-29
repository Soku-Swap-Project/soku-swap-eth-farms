/* eslint-disable */

import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Slider as AntSlider } from 'antd'

const StyledRangeInput = styled.input<{ size: number }>`
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: transparent; /* Otherwise white in Chrome */
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &::-moz-focus-outer {
    border: 0;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: ${({ size }) => size}px;
    width: ${({ size }) => size}px;
    background-color: #fff;
    border-radius: 100%;
    border: 1px solid #04bbfb;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.invertedContrast};

    &:hover,
    &:focus {
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.08), 0px 16px 24px rgba(0, 0, 0, 0.06),
        0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }

  &::-moz-range-thumb {
    height: ${({ size }) => size}px;
    width: ${({ size }) => size}px;
    background-color: #565a69;
    border-radius: 100%;
    border: none;
    color: #05195a;

    &:hover,
    &:focus {
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.08), 0px 16px 24px rgba(0, 0, 0, 0.06),
        0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }

  &::-ms-thumb {
    height: ${({ size }) => size}px;
    width: ${({ size }) => size}px;
    background-color: #565a69;
    border-radius: 100%;
    color: #05195a;

    &:hover,
    &:focus {
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.08), 0px 16px 24px rgba(0, 0, 0, 0.06),
        0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }

  &::-webkit-slider-runnable-track {
    background: #04bbfb;
    height: 2px;
  }

  &::-moz-range-track {
    background: #05489c;

    );
    height: 2px;
  }

  &::-ms-track {
    width: 100%;
    border-color: transparent;
    color: transparent;

    background: #05195a
    height: 2px;
  }
  &::-ms-fill-lower {
    background: #05195a
  }
  &::-ms-fill-upper {
    background: #05489c;
  }
`

interface InputSliderProps {
  value: number
  name: string
  valueLabel: string
  onChange: (value: number) => void
  step?: number
  min?: number
  max?: number
  size?: number
}

export default function Slider({ value, onChange, min = 0, step = 1, max = 100, size = 28 }: InputSliderProps) {
  const changeCallback = useCallback(
    (e) => {
      onChange(parseInt(e.target.value))
    },
    [onChange],
  )

  return (
    <StyledRangeInput
      className="hover_shadow_icon"
      size={size}
      type="range"
      value={value}
      style={{ width: '95%', padding: '15px 0' }}
      onChange={changeCallback}
      aria-labelledby="input slider"
      step={step}
      min={min}
      max={max}
    />
  )
}
