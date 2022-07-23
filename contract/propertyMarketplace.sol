// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HouseToken is ERC20 {
    constructor(
        string memory tokenName,
        string memory symbol,
        uint supply,
        address owner
    ) ERC20(tokenName, symbol) {
        _mint(owner, supply * 10**decimals());
    }
}

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract PropertyMarketplace {
    uint private propertiesLength = 0;
    address internal cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Property {
        address payable owner;
        PropertyLabel label;
        PropertyStockData stockData;
        uint bedrooms;
        uint bathrooms;
        Status status;
        HouseToken houseToken;
    }

    struct PropertyLabel {
        string name;
        string image;
        string description;
        string location;
    }

    struct PropertyStockData {
        uint price;
        uint sold;
        uint numShares;
    }

    enum Status {
        OnSale,
        SaleCancelled,
        SoldOut
    }

    mapping(uint => Property) internal properties;
    mapping(uint => bool) private exists;

    /// @dev checks if a property exist
    modifier exist(uint _index) {
        require(exists[_index], "Query of non existent property");
        _;
    }
    /// @dev checks if caller is the property owner
    modifier onlyPropertyOwner(uint _index) {
        require(properties[_index].owner == msg.sender, "Unauthorised caller");
        _;
    }
    /// @dev checks if any property's shares have been sold
    modifier onlySharesNotSold(uint _index) {
        require(
            properties[_index].stockData.sold == 0,
            "The sale cannot be updated if some tokens are already issued"
        );
        _;
    }
    /// @dev checks if sale of property has been cancelled
    modifier isNotCancelled(uint _index) {
        require(
            properties[_index].status != Status.SaleCancelled,
            "The property sale is cancelled"
        );
        _;
    }

    /// @dev creates a property
    function writeProperty(
        PropertyLabel calldata _label,
        PropertyStockData memory _stockData,
        uint _bedrooms,
        uint _bathrooms
    ) public {
        _stockData.sold = 0;
        require(
            _stockData.numShares > 0,
            "Number of shares needs to be at least one"
        );
        require(_stockData.price > 0, "Invalid share price");
        //create a house token - there will be as many tokens as there are shares to be sold
        HouseToken _houseToken = new HouseToken(
            _label.name,
            "HTK",
            _stockData.numShares,
            address(this)
        );
        exists[propertiesLength] = true;
        properties[propertiesLength] = Property(
            payable(msg.sender),
            _label,
            _stockData,
            _bedrooms,
            _bathrooms,
            Status.OnSale,
            _houseToken
        );
        propertiesLength++;
    }

    /// @dev returns the data of a property
    function readProperty(uint _index)
        public
        view
        exist(_index)
        returns (Property memory)
    {
        return (properties[_index]);
    }

    function getPropertiesLength() public view returns (uint) {
        return propertiesLength;
    }

    /// @dev returns the number of tokens spender has been approved for
    function getAllowance(address spender, uint _index)
        public
        view
        exist(_index)
        returns (uint)
    {
        return
            properties[_index].houseToken.allowance(
                properties[_index].owner,
                spender
            );
    }

    /// @dev returns the number of shares of address owner
    function getBalance(uint _index, address owner)
        public
        view
        exist(_index)
        returns (uint)
    {
        return properties[_index].houseToken.balanceOf(owner);
    }

    /// @dev approves address spender to use a specified number of tokens
    function approveSpender(
        address spender,
        uint _index,
        uint amount
    ) external exist(_index) onlyPropertyOwner(_index) {
        require(spender != address(0), "invalid spender");
        require(amount <= properties[_index].houseToken.totalSupply());
        properties[_index].houseToken.approve(spender, amount);
    }

    function getPropertyPricePerToken(uint _index)
        public
        view
        exist(_index)
        returns (uint)
    {
        return
            properties[_index].stockData.price /
            properties[_index].stockData.numShares;
    }

    /// @dev returns the number of shares available for sale
    function getPropertyTokensRemaining(uint _index)
        public
        view
        exist(_index)
        returns (uint)
    {
        return
            properties[_index].stockData.numShares -
            properties[_index].stockData.sold;
    }

    /// @dev returns a bool on if changes can be made to a property
    function canModifyProperty(uint _index)
        public
        view
        exist(_index)
        returns (bool)
    {
        return (msg.sender == properties[_index].owner &&
            properties[_index].stockData.sold == 0 &&
            properties[_index].status != Status.SaleCancelled);
    }

    /// @dev updates the property price
    function updatePropertyPrice(uint _index, uint _price)
        public
        exist(_index)
        onlyPropertyOwner(_index)
        onlySharesNotSold(_index)
        isNotCancelled(_index)
    {
        require(_price > 0);
        properties[_index].stockData.price = _price;
    }

    /// @dev cancels the sale of a property
    function cancelPropertySale(uint _index)
        public
        exist(_index)
        onlyPropertyOwner(_index)
        onlySharesNotSold(_index)
        isNotCancelled(_index)
    {
        properties[_index].status = Status.SaleCancelled;
    }

    /// @dev updates teh number of shares allocated
    function updatePropertyShares(uint _index, uint _shares)
        external
        exist(_index)
        onlyPropertyOwner(_index)
        onlySharesNotSold(_index)
        isNotCancelled(_index)
    {
        require(_shares > 0, "Invalid number of shares");
        properties[_index].stockData.numShares = _shares;
    }

    /// @dev buys a share from a property
    function buyPropertyShare(uint _index)
        external
        payable
        exist(_index)
        isNotCancelled(_index)
    {
        require(
            properties[_index].owner != msg.sender,
            "You can't buy shares off your own property"
        );
        //check if the property is already sold out
        require(
            properties[_index].stockData.sold <
                properties[_index].stockData.numShares ||
                properties[_index].status != Status.SoldOut,
            "All shares of this property is sold out."
        );

        //transfer tokens from buyer to seller
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                properties[_index].owner,
                properties[_index].stockData.price /
                    properties[_index].stockData.numShares
            ),
            "Transfer of assets from buyer to seller failed."
        );

        /*
        - transfer property token to buyer*/
        require(
            properties[_index].houseToken.transfer(msg.sender, 1 ether),
            "Transfer of hosue tokens from app to buyer failed"
        );

        properties[_index].stockData.sold++;
        if (
            properties[_index].stockData.sold ==
            properties[_index].stockData.numShares
        ) {
            properties[_index].status = Status.SoldOut;
        }
    }
}
