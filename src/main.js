import Web3 from 'web3'
// import { newKitFromWeb3 } from '@celo/contractkit'
import BigNumber from "bignumber.js"
import marketplaceAbi from '../contract/propertyMarketplace.abi.json'
import erc20Abi from '../contract/erc20.abi.json'


const ERC20_DECIMALS = 18

let kit
const MPContractAddress = "0x3E9B8e9a28Af97e5B468131b2484C4156C693709"//"0xcaebdebB4D9094729362638931d7C9dB10B4a059"//"0x769039929b2D060588eA5A05e1c2065D4a2d888d"
const cUSDTokenAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"
let contract
let erc20Contract
let products = []
let properties = []
let viewerIsOwner = false
let web3 
let defaultAccount
let celoTestnetChainId=44787


// ["Best House","https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2021/08/download-23.jpg","Best house on the block","London, UK"]
// [300000000000000000000000,0,10]


ethereum.on('chainChanged', (_chainId) => window.location.reload());

const connectMetamaskWallet = async function () {
    if (window.ethereum) {
        notification("⚠️ Please approve this DApp to use it.")
        try{
            const chainId = await ethereum.request({ method: 'eth_chainId' });
            if(parseInt(chainId,16)!=celoTestnetChainId){
                throw "⚠️ Please switch to the Celo Alfajores Testnet to use this app."
            }
            
            web3 = new Web3(window.ethereum);

            await window.ethereum.enable();
            notificationOff()

            const accounts = await web3.eth.getAccounts()
            defaultAccount = accounts[0];    
            

            contract = new web3.eth.Contract(marketplaceAbi, MPContractAddress)
            erc20Contract = new web3.eth.Contract(erc20Abi, cUSDTokenAddress)

        } catch (error) {
            notification(`⚠️ ${error}.`)
          }
        
      }else {
        notification("⚠️ Please install the Metamask.")
      }
  }

const connectCeloWallet = async function () {
    if (window.celo) {
        notification("⚠️ Please approve this DApp to use it.")
      try {
        await window.celo.enable()
        notificationOff()
  
        const web3 = new Web3(window.celo)
        kit = newKitFromWeb3(web3)

        const accounts = await kit.web3.eth.getAccounts()
        kit.defaultAccount = accounts[0]
  
        contract = new kit.web3.eth.Contract(marketplaceAbi, MPContractAddress)
      } catch (error) {
        notification(`⚠️ ${error}.`)
      }
    } else {
      notification("⚠️ Please install the CeloExtensionWallet.")
    }
  }

  const getBalance = async function () {
    const cUSDBalance = await erc20Contract.methods.balanceOf(defaultAccount).call()
    document.querySelector("#balance").textContent = parseFloat(web3.utils.fromWei(cUSDBalance, 'ether')).toFixed(2)
  }

  

    const getProperties =  async function() {
      const _propertiesLength = await contract.methods.getPropertiesLength().call()
      const _properties = []
      for (let i = 0; i < _propertiesLength; i++) {
          let _property = new Promise(async (resolve, reject) => {
            let p = await contract.methods.readProperty(i).call()
            let name = p[1][0]
            let image = p[1][1]
            let description = p[1][2]
            let location = p[1][3]
            let price = p[2][0]
            let sold = p[2][1]
            let numShares = p[2][2]
            resolve({
              index: i,
              owner: p[0],
              name: name,
              image: image,
              description: description,
              location: location,
              price: price,
              sold: sold,
              numShares: numShares,
              bedrooms: p[3],
              bathrooms: p[4],
              status: p[5],
              houseTokenAddress: p[6],
            })
            })
            _properties.push(_property)
        }
        properties = await Promise.all(_properties)
        renderProperties()
      }

//   const getBalance = function () {
//     document.querySelector("#balance").textContent = 21
//   }



  function renderProducts() {
    document.getElementById("marketplace").innerHTML = ""
    products.forEach((_product) => {
      const newDiv = document.createElement("div")
      newDiv.className = "col-md-4"
      newDiv.innerHTML = productTemplate(_product)
      document.getElementById("marketplace").appendChild(newDiv)
    })
  }



  function renderProperties() {
    document.getElementById("marketplace").innerHTML = ""
    properties.forEach((_property) => {
      const newDiv = document.createElement("div")
      newDiv.className = "col-md-4"
      newDiv.innerHTML = propertiesTemplate(_property)
      document.getElementById("marketplace").appendChild(newDiv)
    })
  }


  function propertiesTemplate(_product) {
    let viewerIsOwner = _product.owner==defaultAccount
    if (viewerIsOwner){
      return `
      <div class="card mb-4">
        <img class="card-img-top" src="${_product.image}" alt="...">
        <div class="position-absolute top-0 end-0 bg-warning mt-1 px-2 py-1 rounded-start">
          ${_product.sold} Sold
        </div>
        <div class="position-absolute top-0 end-0 bg-warning mt-5 px-2 py-1 rounded-start">
          ${_product.numShares} Shares
        </div>
        <div class="card-body text-left p-4 position-relative">
        <div class="translate-middle-y position-absolute top-0">
        ${identiconTemplate(_product.owner)}
        </div>
        <h2 class="card-title fs-4 fw-bold mt-2">${_product.name}</h2>
        <p class="card-text mb-4" style="min-height: 82px">
          ${_product.description}             
        </p>
        <p class="card-text mt-4">
          <i class="bi bi-door-open"></i>
          <span>${_product.bedrooms} Bedrooms</span>
        </p>
        <p class="card-text mt-4">
          <i class="bi bi-door-closed"></i>
          <span>${_product.bathrooms} Bathrooms</span>
        </p>
        <p class="card-text mt-4">
          <i class="bi bi-geo-alt-fill"></i>
          <span>${_product.location}</span>
        </p>
        <div class="d-grid gap-2">
          <a class="btn btn-lg btn-outline-dark buyBtn fs-6 p-3" id=${
            _product.index
          }>
            Buy for ${parseFloat(web3.utils.fromWei(_product.price.toString(), 'ether')/_product.numShares).toFixed(2)} cUSD per share
          </a>
          <a class="btn btn-lg btn-outline-dark updatePriceBtn fs-6 p-3" id=${
            _product.index
          }>
            Update Price
          </a>
          <a class="btn btn-lg btn-outline-dark cancelSaleBtn fs-6 p-3" id=${
            _product.index
          }>
            Cancel Sale
          </a>
        </div>
      </div>
    </div>`
    }
    //Not property owner so do not show cancel or update price
    return `
    <div class="card mb-4">
    <img class="card-img-top" src="${_product.image}" alt="...">
    <div class="position-absolute top-0 end-0 bg-warning mt-1 px-2 py-1 rounded-start">
      ${_product.sold} Sold
    </div>
    <div class="position-absolute top-0 end-0 bg-warning mt-5 px-2 py-1 rounded-start">
      ${_product.numShares} Shares
    </div>
    <div class="card-body text-left p-4 position-relative">
    <div class="translate-middle-y position-absolute top-0">
    ${identiconTemplate(_product.owner)}
    </div>
    <h2 class="card-title fs-4 fw-bold mt-2">${_product.name}</h2>
    <p class="card-text mb-4" style="min-height: 82px">
      ${_product.description}             
    </p>
    <p class="card-text mt-4">
      <i class="bi bi-door-open"></i>
      <span>${_product.bedrooms} Bedrooms</span>
    </p>
    <p class="card-text mt-4">
      <i class="bi bi-door-closed"></i>
      <span>${_product.bathrooms} Bathrooms</span>
    </p>
    <p class="card-text mt-4">
      <i class="bi bi-geo-alt-fill"></i>
      <span>${_product.location}</span>
    </p>
    <div class="d-grid gap-2">
      <a class="btn btn-lg btn-outline-dark buyBtn fs-6 p-3" id=${
        _product.index
      }>
        Buy for ${parseFloat(web3.utils.fromWei(_product.price.toString(), 'ether')/_product.numShares).toFixed(2)} cUSD per share
      </a>
    </div>
  </div>
</div>`
}

function identiconTemplate(_address) {
    const icon = blockies
      .create({
        seed: _address,
        size: 8,
        scale: 16,
      })
      .toDataURL()
  
    return `
    <div class="rounded-circle overflow-hidden d-inline-block border border-white border-2 shadow-sm m-0">
      <a href="https://alfajores-blockscout.celo-testnet.org/address/${_address}/transactions"
          target="_blank">
          <img src="${icon}" width="48" alt="${_address}">
      </a>
    </div>
    `
  }

  function notification(_text) {
    document.querySelector(".alert").style.display = "block"
    document.querySelector("#notification").textContent = _text
  }
  
  function notificationOff() {
    document.querySelector(".alert").style.display = "none"
  }

  window.addEventListener('load', async () => {
    notification("⌛ Loading...")
    // await connectCeloWallet()
    await connectMetamaskWallet()
    await getBalance()
    await getProperties()
    notificationOff()
  });

  //adding the product
  document
  .querySelector("#newPropertyBtn")
  .addEventListener("click", async (e) => {
    const params = [
      [
        document.getElementById("newPropertyName").value,
        document.getElementById("newImgUrl").value,
        document.getElementById("newPropertyDescription").value,
        document.getElementById("newLocation").value
      ],
      [
        web3.utils.toWei(document.getElementById("newPrice").value),
        0,
        document.getElementById("numShares").value
      ],
      document.getElementById("numBedrooms").value,
      document.getElementById("numBathrooms").value
    ]
    notification(`⌛ Adding "${params[0]}"...`)
    try {
        const result = await contract.methods
          .writeProperty(...params)
          .send({ from: defaultAccount })
          console.log(result)
      } catch (error) {
        notification(`⚠️ ${error}.`)
      }
      notification(`🎉 You successfully added "${params[0]}".`)
      await getProperties()
    })


    

 
  

  async function approve(_price) {
    const cUSDContract = new web3.eth.Contract(erc20Abi, cUSDTokenAddress)
    console.log("toApprove")
  
    const result = await cUSDContract.methods
      .approve(MPContractAddress, _price)
      .send({ from: defaultAccount })
      console.log(result)
    return result
  }

  document.querySelector("#marketplace").addEventListener("click", async (e) => {
    if (e.target.className.includes("buyBtn")) {
      const index = e.target.id
      try{
        let walletBalance = await getBalance()
        console.log(walletBalance)
        if (walletBalance<properties[index].price/properties[index].numShares){
          notification(`You do not have enough cUSD to buy this propertyShare.`)
          return
        }
      } catch (error) {
        notification(`⚠️ ${error}.`)
      }
      


      notification("⌛ Waiting for payment approval...")
      try {
        await approve(properties[index].price)
      
      } catch (error) {
        notification(`⚠️ ${error}.`)
      }
      notification(`⌛ Awaiting payment for "${properties[index].name}"...`)
    try {
      const result = await contract.methods
        .buyProperty(index)
        .send({ from: defaultAccount })
      notification(`🎉 You successfully bought "${properties[index].name}".`)
      getProperties()
      getBalance()
    } catch (error) {
      notification(`⚠️ ${error}.`)
    }
  }
})

