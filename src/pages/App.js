import React from 'react'
import Web3Provider, { Connectors } from 'web3-react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

import { CHAIN_ID, PROVIDER_URLS } from '../utils'
import GlobalStyle, { ThemeProvider } from '../theme'
import Web3ReactManager from '../components/Web3ReactManager'
import AppProvider from '../context'
import Main from './Main'

const supportedChainIds = Object.keys(PROVIDER_URLS).map(chainId => parseInt(chainId))

const { NetworkOnlyConnector, InjectedConnector } = Connectors

const Network = new NetworkOnlyConnector({
  providerURL: PROVIDER_URLS[CHAIN_ID],
  defaultNetwork: CHAIN_ID,
  supportedNetworks: supportedChainIds,
  supportedNetworkURLs: PROVIDER_URLS,
})
const Injected = new InjectedConnector({ supportedChainIds })

const connectors = { Network, Injected }

export default function App() {
  return (
    <ThemeProvider>
      <>
        <GlobalStyle />
        <Web3Provider connectors={connectors} libraryName={'ethers.js'}>
          <Web3ReactManager>
            <AppProvider>
              <BrowserRouter>
                <Switch>
                  <Route exact strict path="/" render={() => <Main />} />
                  <Route exact strict path="/status" render={() => <Main status />} />
                  <Route exact strict path="/stats" render={() => <Main stats />} />
                  <Redirect to="/" />
                </Switch>
              </BrowserRouter>
            </AppProvider>
          </Web3ReactManager>
        </Web3Provider>
      </>
    </ThemeProvider>
  )
}
