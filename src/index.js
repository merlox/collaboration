setupWeb3()

let contract

async function setupWeb3() {
    console.log('Setting up web3');
    const ethereum = window.ethereum;
    if (typeof ethereum !== 'undefined') {
    try {
        await ethereum.enable();
    } catch (e) {
        return warningNotification('Metamask permission error', 'You must accept the connection request to continue');
    }
    window.web3 = new Web3(ethereum);
    } else if (typeof window.web3 !== 'undefined') {
    window.web3 = new Web3(window.web3.currentProvider);
    } else {
    return warningNotification('Metamask not detected', 'You must login to metamask to use this application');
    }
    window.web3.eth.defaultAccount = window.web3.eth.accounts[0];
    
    setupContract()
}

async function setupContract() {
    contract = window.web3.eth.contract(contractAbi).at(contractAddress);
}

function mintToken() {
    console.log('Mint token')
    contract.mintToken('123456789', {
        gas: 8e6,
    }, (err, res) => {
        console.log('Err ->', err, 'Res ->', res)
    })
}