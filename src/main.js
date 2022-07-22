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
let _properties = []
let properties = []
let web3 
let defaultAccount
let celoTestnetChainId=44787

let properties1 = [
  {
    owner: "0x32Be343B94f860124dC4fEe278FDCBD38C102D88",
    name: "Best House",
    image: "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2021/08/download-23.jpg",
    description: `Best house on the block`,
    location: "London, UK",
    price: 3000000,
    numShares: 10,
    bedrooms: 4,
    bathrooms: 4,
    sold: 0,
    index: 0,
  },
]
let _properties2 = [
  {
    owner: "0x32Be343B94f860124dC4fEe278FDCBD38C102D88",
    label: ["Best House",
    "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2021/08/download-23.jpg",
    `Best house on the block`, "London, UK"],
    stockData: [3000000,0,10],
    bedrooms: 4,
    bathrooms: 4,
    houseToken: "0x32Be343B94f860124dC4fEe278FDCBD38C102D88",
    index: 0,
  },
]

_properties = [[
  "0x32Be343B94f860124dC4fEe278FDCBD38C102D88",
    ["Best House",
    "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2021/08/download-23.jpg",
    `Best house on the block`, "London, UK"],
   [3000000,0,10],
   4,
     4,
    "0x32Be343B94f860124dC4fEe278FDCBD38C102D88",
    0
]]

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

    const getProperties2 =  async function() {
      // const _productsLength = await contract.methods.getPropertiesLength().call()
      const _propertiesLength = _properties.length
      // const _products = []
      for (let i = 0; i < _propertiesLength; i++) {
          // let _properties = new Promise(async (resolve, reject) => {
            // let p = await contract.methods.readProperty(i).call()
            let p = _properties[i]
            let owner = p[0]
            let name = p.label[0]
            let image = p.label[1]
            let description = p.label[2]
            let location = p.label[3]
            let price = p.stockData[0]
            let sold = p.stockData[1]
            let numShares = p.stockData[2]

            let _property = {
              index: i,
              owner: p[0],
              name: name,
              image: image,
              description: description,
              location: location,
              price: price,
              sold: sold,
              numShares: numShares,
              bedrooms: p.bedrooms,
              bathrooms: p[4],
              status: p[5],
              houseTokenAddress: p[6],
            }
          // })
           properties.push(_property)
        }
        // products = await Promise.all(_products)
        renderProperties()
      }

      const getProperties =  async function() {
        // const _productsLength = await contract.methods.getPropertiesLength().call()
        const _propertiesLength = _properties.length
        // const _products = []
        for (let i = 0; i < _propertiesLength; i++) {
            // let _properties = new Promise(async (resolve, reject) => {
              // let p = await contract.methods.readProperty(i).call()
              let p = _properties[i]
              let owner = p[0]
              let name = p[1][0]
              let image = p[1][1]
              let description = p[1][2]
              let location = p[1][3]
              let price = p[2][0]
              let sold = p[2][1]
              let numShares = p[2][2]
  
              let _property = {
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
              }
            // })
             properties.push(_property)
          }
          // products = await Promise.all(_products)
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

  function productTemplate(_product) {
    let viewerIsOwner = true
    if (viewerIsOwner){
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
    let viewerIsOwner = true
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
            Buy for ${parseFloat(web3.utils.fromWei(_product.price.toString(), 'ether')).toFixed(2)} cUSD
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
    // await getProducts()
    await getProperties()
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

