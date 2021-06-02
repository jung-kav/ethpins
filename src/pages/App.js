import React from 'react'
import Web3Provider, { Connectors } from 'web3-react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

import GlobalStyle, { ThemeProvider } from '../theme'
import Web3ReactManager from '../components/Web3ReactManager'
import AppProvider from '../context'
import Main from './Main'

const PROVIDER_URL = `https://eth-.alchemyapi.io/v2/${process.env.ALCHEMY_PROJECT_ID}`

const { NetworkOnlyConnector, InjectedConnector } = Connectors
const Network = new NetworkOnlyConnector({
  providerURL: PROVIDER_URL,
  defaultNetwork: 3,
  supportedNetworks: [3, 31337],
  supportedNetworkURLs: {
    3: PROVIDER_URL,
    31337: 'http://localhost:8545',
  },
})
const Injected = new InjectedConnector({ supportedNetworks: [3, 31337], defaultNetwork: 3 })

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
