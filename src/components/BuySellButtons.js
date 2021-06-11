import React from 'react'
import styled from 'styled-components'

import Button from './Button'
import { TOKEN_ADDRESSES } from '../utils'

const ButtonsContainerFrame = styled.div`
  margin: 0.5rem 0rem 0.5rem 0rem;
  display: flex;
  align-items: center;
  flex-direction: center;
  flex-direction: row;
  color: ${props => props.theme.black};

  div {
    width: 100%;
  }
`
const ButtonFrame = styled(Button)`
  width: 100%;
`

const Shim = styled.div`
  width: 1rem !important;
  height: 1rem;
`

export default function RedeemButton({ balancePINO }) {
  return (
    <ButtonsContainerFrame>
      <ButtonFrame
        disabled={false}
        text={'Buy'}
        type={'secondary'}
        onClick={() => {
          window.location.href = `https://app.uniswap.org/#/swap?use=V2&outputCurrency=${TOKEN_ADDRESSES.PINO}&inputCurrency=ETH&exactAmount=1&exactField=output`
        }}
      />
      <Shim />
      <ButtonFrame
        disabled={balancePINO > 0 ? false : true}
        text={'Sell'}
        type={'secondary'}
        onClick={() => {
          window.location.href = `https://app.uniswap.org/#/swap?use=V2&inputCurrency=${TOKEN_ADDRESSES.PINO}&outputCurrency=ETH&exactAmount=1&exactField=input`
        }}
      />
    </ButtonsContainerFrame>
  )
}
