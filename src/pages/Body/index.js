import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { useWeb3Context } from 'web3-react'
import { Link } from 'react-router-dom'

import { useAppContext } from '../../context'
import Card from '../../components/Card'
import BuyButtons from '../../components/Buttons'
import RedeemButton from '../../components/RedeemButton'
import Checkout from '../../components/Checkout'
import { amountFormatter } from '../../utils'

export function Header({ totalSupply, ready, balancePINO, setShowConnect }) {
  const { account, setConnector } = useWeb3Context()

  function handleAccount() {
    setConnector('Injected', { suppressAndThrowErrors: true }).catch(error => {
      setShowConnect(true)
    })
  }

  return (
    <HeaderFrame balancePINO={balancePINO}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <Unicorn>
          <span role="img" aria-label="unicorn">
            🦖
          </span>{' '}
          Ethpins
        </Unicorn>
      </Link>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {totalSupply && (
          <Link to="/stats" style={{ textDecoration: 'none' }}>
            <Burned>
              <span role="img" aria-label="fire">
                🔥
              </span>{' '}
              {1000 - totalSupply} <HideMobile>redeemed</HideMobile>
            </Burned>
          </Link>
        )}
        <Account onClick={() => handleAccount()} balancePINO={balancePINO}>
          {account ? (
            balancePINO > 0 ? (
              <EthCount>{balancePINO && `${amountFormatter(balancePINO, 18, 0)}`} PINO</EthCount>
            ) : (
              <EthCount>{account.slice(0, 6)}...</EthCount>
            )
          ) : (
            <EthCount>Connect Wallet</EthCount>
          )}

          <Status balancePINO={balancePINO} ready={ready} account={account} />
        </Account>
      </div>
    </HeaderFrame>
  )
}

const HeaderFrame = styled.div`
  position: fixed;
  width: 100%;
  box-sizing: border-box;
  margin: 0px;
  font-size: 1.25rem;
  color: ${props => (props.balancePINO ? props.theme.primary : 'white')};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1rem;
`

const Account = styled.div`
  background-color: ${props => (props.balancePINO ? '#f1f2f6' : props.theme.blue)};
  padding: 0.75rem;
  border-radius: 6px;
  cursor: ${props => (props.balancePINO ? 'auto' : 'pointer')};

  transform: scale(1);
  transition: transform 0.3s ease;

  :hover {
    transform: ${props => (props.balancePINO ? 'scale(1)' : 'scale(1.02)')};
    text-decoration: underline;
  }
`

const Burned = styled.div`
  background-color: none;
  border: 1px solid red;
  margin-right: 1rem;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transform: scale(1);
  transition: transform 0.3s ease;
  line-height: 1;

  :hover {
    transform: scale(1.02);
  }

  font-weight: 500;
  font-size: 14px;
  color: red;
`

const HideMobile = styled.span`
  @media only screen and (max-width: 480px) {
    display: none;
  }
`

const EthCount = styled.p`
  /* color: #6c7284; */
  font-weight: 500;
  margin: 0px;
  font-size: 14px;
  float: left;
`

const Status = styled.div`
  display: ${props => (props.balancePINO ? 'initial' : 'none')};
  width: 12px;
  height: 12px;
  border-radius: 100%;
  margin-left: 12px;
  margin-top: 2px;
  float: right;
  background-color: ${props =>
    props.account === null ? props.theme.orange : props.ready ? props.theme.green : props.theme.orange};
  // props.account === null ? props.theme.orange : props.theme.green};
`

export default function Body({
  ready,
  unlock,
  burn,
  dollarize,
  dollarPrice,
  balancePINO,
  reservePINOToken,
  totalSupply,
}) {
  const { account } = useWeb3Context()
  const [currentTransaction, _setCurrentTransaction] = useState({})
  const setCurrentTransaction = useCallback((hash, type, amount) => {
    _setCurrentTransaction({ hash, type, amount })
  }, [])
  const clearCurrentTransaction = useCallback(() => {
    _setCurrentTransaction({})
  }, [])
  const [state, setState] = useAppContext()
  const [showConnect, setShowConnect] = useState(false)
  const [showWorks, setShowWorks] = useState(false)

  return (
    <AppWrapper overlay={state.visible}>
      <Header
        totalSupply={totalSupply}
        ready={ready}
        dollarPrice={dollarPrice}
        balancePINO={balancePINO}
        setShowConnect={setShowConnect}
      />
      <Content>
        <Card totalSupply={totalSupply} dollarPrice={dollarPrice} reservePINOToken={reservePINOToken} />{' '}
        <Info>
          <div style={{ marginBottom: '4px' }}>Buy and sell limited edition pins with digital currency.</div>
          <div style={{ marginBottom: '4px' }}>
            Delivered on demand.{' '}
            <a
              href="/"
              onClick={e => {
                e.preventDefault()
                setState(state => ({ ...state, visible: !state.visible }))
                setShowWorks(true)
              }}
            >
              Learn more
            </a>
          </div>
        </Info>
        <BuyButtons balancePINO={balancePINO} />
        <RedeemButton balancePINO={balancePINO} />
        {!!account && (
          <Link style={{ textDecoration: 'none' }} to="/status">
            <OrderStatusLink>Check order status?</OrderStatusLink>
          </Link>
        )}
      </Content>
      <Checkout
        ready={ready}
        unlock={unlock}
        burn={burn}
        balancePINO={balancePINO}
        dollarPrice={dollarPrice}
        reservePINOToken={reservePINOToken}
        dollarize={dollarize}
        showConnect={showConnect}
        setShowConnect={setShowConnect}
        currentTransactionHash={currentTransaction.hash}
        currentTransactionType={currentTransaction.type}
        currentTransactionAmount={currentTransaction.amount}
        setCurrentTransaction={setCurrentTransaction}
        clearCurrentTransaction={clearCurrentTransaction}
        showWorks={showWorks}
        setShowWorks={setShowWorks}
      />
    </AppWrapper>
  )
}

const AppWrapper = styled.div`
  width: 100vw;
  height: 100%;
  margin: 0px auto;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  overflow: ${props => (props.overlay ? 'hidden' : 'scroll')};
  scroll-behavior: smooth;
  position: ${props => (props.overlay ? 'fixed' : 'initial')};
`

const Content = styled.div`
  width: calc(100vw - 32px);
  max-width: 375px;
  margin-top: 72px;
`

const Info = styled.div`
  color: ${props => props.theme.text};
  font-weight: 500;
  margin: 0px;
  font-size: 14px;
  padding: 20px;
  padding-top: 32px;
  border-radius: 0 0 8px 8px;
  /* border-radius: 8px; */
  margin-bottom: 12px;
  margin-top: -12px;
  /* margin-top: 16px; */
  background-color: ${props => '#f1f2f6'};
  a {
    color: ${props => props.theme.uniswapPink};
    text-decoration: none;
    /* padding-top: 8px; */
    /* font-size: 14px; */
  }
  a:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

const OrderStatusLink = styled.p`
  color: ${props => props.theme.uniswapPink};
  text-align: center;
  font-size: 0.6rem;
`

const Unicorn = styled.p`
  color: ${props => props.theme.uniswapPink};
  font-weight: 600;
  margin: auto 0px;
  font-size: 16px;
`
