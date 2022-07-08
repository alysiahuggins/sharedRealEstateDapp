// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

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
        string name;
        string image;
        string description;
        string location;
        uint price;
        uint sold;
        uint numShares;
        uint bedrooms;
        uint bathrooms;
        Status status;
    }

    enum Status {
        OnSale,
        SaleCancelled,
        SoldOut
    }

    mapping (uint => Property) internal properties;

    function writeProperty(
        string memory _name,
        string memory _image,
        string memory _description, 
        string memory _location, 
        uint _price,
        uint _numShares,
        uint _bedrooms,
        uint _bathrooms
    ) public {
        uint _sold = 0;
        
        properties[propertiesLength] = Property(
            payable(msg.sender),
            _name,
            _image,
            _description,
            _location,
            _price,
            _sold,
            _numShares,
            _bedrooms,
            _bathrooms,
            Status.OnSale
        );
        propertiesLength++;
    }

    function readProperty(uint _index) public view returns (
        address payable,
        string memory, 
        string memory, 
        string memory, 
        string memory, 
        uint, 
        uint,
        uint, 
        uint, 
        uint, 
        Status
    ) {
        return (
            properties[_index].owner,
            properties[_index].name, 
            properties[_index].image, 
            properties[_index].description, 
            properties[_index].location, 
            properties[_index].price,
            properties[_index].sold,
            properties[_index].numShares,
            properties[_index].bedrooms,
            properties[_index].bathrooms,
            properties[_index].status

        );
    }

    function updatePropertyPrice(uint _index, uint _price)
    public
    {
        require(msg.sender==properties[_index].owner, "Only the property owner can cancel the sale");
        require(properties[_index].sold==0, "The sale cannot be updated if some tokens are already issued");
        properties[_index].price = _price;
    }

    function cancelPropertySale(uint _index)
    public
    {
        require(msg.sender==properties[_index].owner, "Only the property owner can cancel the sale");
        require(properties[_index].sold==0, "The sale cannot be cancelled if some tokens are already issued");
        properties[_index].status = Status.SaleCancelled;
    }
    
    function buyProperty(uint _index) public payable  {
         require(
            properties[_index].status!=Status.Cancelled
          ,
          "This property sale is cancelled."
        );
        
        require(
            properties[_index].sold<properties[_index].numShares-1 ||
            properties[_index].status!=Status.SoldOut ||
        , "All shares of this property is sold out."
        )

        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            properties[_index].owner,
            properties[_index].price
          ),
          "Transfer failed."
        );

        properties[_index].sold++;
        if(properties[_index].sold==properties[_index].numShares-1){
            properties[_index].status = Status.SoldOut
        }

        /** TODO
        - transfer property token to buyer */
    }
    
    function getpropertiesLength() public view returns (uint) {
        return (propertiesLength);
    }
}