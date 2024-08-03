import {useState} from 'react'
import WalletConnector from './components/WalletConnector'
import {ethers} from 'ethers-ts'
import WrapUnwrap from './components/WrapUnwrap'

const App = () => {
    // State to store the signer from the connected wallet
    const [signer, setSigner] = useState<ethers.Signer | null>(null)

    const onConnect = (connectedSigner: ethers.Signer) => {
        setSigner(connectedSigner)
    }

    return (
        <div>
            <h1>Wrap/Unwrap ETH</h1>
            <WalletConnector onConnect={onConnect} />
            {signer && <WrapUnwrap signer={signer} />}
        </div>
    )
}

export default App
