// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HouseToken is ERC20 {
    constructor(string memory tokenName, string memory symbol, uint supply) ERC20(tokenName, symbol) {
        _mint(msg.sender, 21 * supply ** decimals());
    }
}


interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract PropertyMarketplace {

    uint internal propertiesLength = 0;
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Property {
        address payable owner;
        PropertyLabel label;
        PropertyStockData stockData;
        uint bedrooms;
        uint bathrooms;
        Status status;
    }

    struct PropertyLabel{
        string name;
        string image;
        string description;
        string location;
    }

    struct PropertyStockData{
        uint price;
        uint sold;
        uint numShares;
    }

    enum Status {
        OnSale,
        SaleCancelled,
        SoldOut
    }

    mapping (uint => Property) internal properties;

    function writeProperty(
        PropertyLabel memory _label, 
        PropertyStockData memory _stockData,
        uint _bedrooms,
        uint _bathrooms
    ) public {
        uint _sold = 0;
        _stockData.sold = _sold;
        
        properties[propertiesLength] = Property(
            payable(msg.sender),
            _label,
            _stockData,
            _bedrooms,
            _bathrooms,
            Status.OnSale
        );
        propertiesLength++;
        
        HouseToken propertyToken = new HouseToken(_label.name, "HTK", _stockData.numShares);

    }

    function readProperty(uint _index) public view returns (
        address payable,
        PropertyLabel memory,
        PropertyStockData memory,
        uint, 
        uint, 
        Status
    ) {
        return (
            properties[_index].owner,
            properties[_index].label, 
            properties[_index].stockData,
            properties[_index].bedrooms,
            properties[_index].bathrooms,
            properties[_index].status

        );
    }

    function updatePropertyPrice(uint _index, uint _price)
    public
    {
        require(msg.sender==properties[_index].owner, "Only the property owner can cancel the sale");
        require(properties[_index].stockData.sold==0, "The sale cannot be updated if some tokens are already issued");
        properties[_index].stockData.price = _price;
    }

    function cancelPropertySale(uint _index)
    public
    {
        require(msg.sender==properties[_index].owner, "Only the property owner can cancel the sale");
        require(properties[_index].stockData.sold==0, "The sale cannot be cancelled if some tokens are already issued");
        properties[_index].status = Status.SaleCancelled;
    }
    
    function buyProperty(uint _index) public payable  {
         require(
            properties[_index].status!=Status.SaleCancelled
          ,
          "This property sale is cancelled."
        );
        
        require(
            properties[_index].stockData.sold<properties[_index].stockData.numShares-1 ||
            properties[_index].status!=Status.SoldOut
        , "All shares of this property is sold out."
        );

        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            properties[_index].owner,
            properties[_index].stockData.price
          ),
          "Transfer failed."
        );

        properties[_index].stockData.sold++;
        if(properties[_index].stockData.sold==properties[_index].stockData.numShares-1){
            properties[_index].status = Status.SoldOut;
        }

        /** TODO
        - transfer property token to buyer
        - make sure that there are property tokens left */
    }
    
    function getpropertiesLength() public view returns (uint) {
        return (propertiesLength);
    }
}