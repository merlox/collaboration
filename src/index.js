setupWeb3()

let contract
let token
let amount

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

    contract.TokenMint((err, res) => {
        console.log('New Event')
        console.log('Err ->', err, 'Res ->', res)

        // New token minted contract
        const tokenAddress = res.args.token
        token = window.web3.eth.contract(tokenAbi).at(tokenAddress);
        console.log('token', token)
        document.querySelector('#token-address').innerHTML = tokenAddress
    });
}

function mintToken() {
    console.log('Mint token')
    contract.mintToken(amount, {
        gas: 8e6,
        gasPrice: web3.toWei(30, 'gwei'),
    }, (err, res) => {
        console.log('Err ->', err, 'Res ->', res)
    })
}

function callToken(type) {
    console.log('Call token')
    let callData
    switch (type) {
        case 'mint':
            callData = token.mint.getData(contractAddress, amount)
            break
        case 'pause':
            callData = token.pause.getData()
            break
        case 'unpause':
            callData = token.unpause.getData()
            break
    }
    document.querySelector('#response').innerHTML = callData
    contract.callToken(callData, {
        gas: 8e6,
        gasPrice: web3.toWei(30, 'gwei'),
    }, (err, res) => {
        console.log('Err ->', err, 'Res ->', res)
    })
}

function setAmount(_amount) {
    amount = _amount
}