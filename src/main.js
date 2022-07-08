import Web3 from 'web3'
// import { newKitFromWeb3 } from '@celo/contractkit'
import BigNumber from "bignumber.js"
import marketplaceAbi from '../contract/marketplace.abi.json'
import erc20Abi from '../contract/erc20.abi.json'


const ERC20_DECIMALS = 18

let kit
const MPContractAddress = "0x769039929b2D060588eA5A05e1c2065D4a2d888d"
const cUSDTokenAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"
let contract
let erc20Contract
let products = []
let web3 
let defaultAccount
let celoTestnetChainId=44787

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

  const getProducts = async function() {
    const _productsLength = await contract.methods.getProductsLength().call()
    const _products = []
    for (let i = 0; i < _productsLength; i++) {
        let _product = new Promise(async (resolve, reject) => {
          let p = await contract.methods.readProduct(i).call()
          resolve({
            index: i,
            owner: p[0],
            name: p[1],
            image: p[2],
            description: p[3],
            location: p[4],
            price: new BigNumber(p[5]),
            sold: p[6],
          })
        })
        _products.push(_product)
      }
      products = await Promise.all(_products)
      renderProducts()
    }
  
// const products = [
//     {
//       name: "Giant BBQ",
//       image: "https://i.imgur.com/yPreV19.png",
//       description: `Grilled chicken, beef, fish, sausages, bacon, 
//         vegetables served with chips.`,
//       location: "Kimironko Market",
//       owner: "0x32Be343B94f860124dC4fEe278FDCBD38C102D88",
//       price: 3,
//       sold: 27,
//       index: 0,
//     },
//     {
//       name: "BBQ Chicken",
//       image: "https://i.imgur.com/NMEzoYb.png",
//       description: `French fries and grilled chicken served with gacumbari 
//         and avocados with cheese.`,
//       location: "Afrika Fresh KG 541 St",
//       owner: "0x3275B7F400cCdeBeDaf0D8A9a7C8C1aBE2d747Ea",
//       price: 4,
//       sold: 12,
//       index: 1,
//     },
//     {
//       name: "Beef burrito",
//       image: "https://i.imgur.com/RNlv3S6.png",
//       description: `Homemade tortilla with your choice of filling, cheese, 
//         guacamole salsa with Mexican refried beans and rice.`,
//       location: "Asili - KN 4 St",
//       owner: "0x2EF48F32eB0AEB90778A2170a0558A941b72BFFb",
//       price: 2,
//       sold: 35,
//       index: 2,
//     },
//     {
//       name: "Barbecue Pizza",
//       image: "https://i.imgur.com/fpiDeFd.png",
//       description: `Barbecue Chicken Pizza: Chicken, gouda, pineapple, onions 
//         and house-made BBQ sauce.`,
//       location: "Kigali Hut KG 7 Ave",
//       owner: "0x2EF48F32eB0AEB90778A2170a0558A941b72BFFb",
//       price: 1,
//       sold: 2,
//       index: 3,
//     },
//   ]

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

  function productTemplate(_product) {
    return `
      <div class="card mb-4">
        <img class="card-img-top" src="${_product.image}" alt="...">
        <div class="position-absolute top-0 end-0 bg-warning mt-4 px-2 py-1 rounded-start">
          ${_product.sold} Sold
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
          <i class="bi bi-geo-alt-fill"></i>
          <span>${_product.location}</span>
        </p>
        <div class="d-grid gap-2">
          <a class="btn btn-lg btn-outline-dark buyBtn fs-6 p-3" id=${
            _product.index
          }>
            Buy for ${parseFloat(web3.utils.fromWei(_product.price.toString(), 'ether')).toFixed(2)} cUSD
          </a>
        </div>
      </div>
    </div>
  `
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
    await getProducts()
    notificationOff()
  });

  //adding the product
  document
  .querySelector("#newProductBtn")
  .addEventListener("click", async (e) => {
    const params = [
      document.getElementById("newProductName").value,
      document.getElementById("newImgUrl").value,
      document.getElementById("newProductDescription").value,
      document.getElementById("newLocation").value,
      web3.utils.toWei(document.getElementById("newPrice").value)
    ]
    notification(`⌛ Adding "${params[0]}"...`)
    try {
        const result = await contract.methods
          .writeProduct(...params)
          .send({ from: defaultAccount })
          console.log(result)
      } catch (error) {
        notification(`⚠️ ${error}.`)
      }
      notification(`🎉 You successfully added "${params[0]}".`)
      getProducts()
    })

 
  

  async function approve(_price) {
    const cUSDContract = new web3.eth.Contract(erc20Abi, cUSDTokenAddress)
  
    const result = await cUSDContract.methods
      .approve(MPContractAddress, _price)
      .send({ from: defaultAccount })
    return result
  }

  document.querySelector("#marketplace").addEventListener("click", async (e) => {
    if (e.target.className.includes("buyBtn")) {
      const index = e.target.id
      notification("⌛ Waiting for payment approval...")
      try {
        await approve(products[index].price)
      } catch (error) {
        notification(`⚠️ ${error}.`)
      }
      notification(`⌛ Awaiting payment for "${products[index].name}"...`)
    try {
      const result = await contract.methods
        .buyProduct(index)
        .send({ from: defaultAccount })
      notification(`🎉 You successfully bought "${products[index].name}".`)
      getProducts()
      getBalance()
    } catch (error) {
      notification(`⚠️ ${error}.`)
    }
  }
})

