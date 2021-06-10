import React from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { useWeb3Context } from 'web3-react'

import { TRADE_TYPES } from '../utils'
import { useAppContext } from '../context'
import Button from './Button'

const RedeemButtonFrame = styled.div`
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
export default function RedeemButton({ balancePINO }) {
  const { account } = useWeb3Context()
  const [, setState] = useAppContext()

  function handleToggleCheckout(tradeType) {
    setState(state => ({ ...state, visible: !state.visible, tradeType }))
  }

  return (
    <RedeemButtonFrame>
      <ButtonFrame
        disabled={
          account === null || !balancePINO || balancePINO.lt(ethers.BigNumber.from(10).pow(ethers.BigNumber.from(18)))
        }
        text={'Redeem'}
        type={'cta'}
        onClick={() => {
          handleToggleCheckout(TRADE_TYPES.REDEEM)
        }}
      />
    </RedeemButtonFrame>
  )
}
