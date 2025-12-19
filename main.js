// Wait for the document to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", ready);

// VARIABLES for UI elements
const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const closeCart = document.querySelector("#close-cart"); 

// Toggle the mobile navigation menu (Hamburger)
let menu = document.querySelector('#menu-bars');
let navbar = document.querySelector('.navbar');

// 🌟 NEW: VARIABLES for Search elements 🌟
const searchIcon = document.querySelector("#search-icon");
const searchForm = document.querySelector("#search-form");
const closeSearch = document.querySelector("#close-search"); 

menu.onclick = () => {
    menu.classList.toggle('fa-xmark'); // Use X icon when open
    navbar.classList.toggle('active');
}

// Close the menu, cart, AND search form when scrolling
window.onscroll = () => {
    menu.classList.remove('fa-xmark');
    navbar.classList.remove('active');
    cart.classList.remove("active"); 
    
    // 🌟 FIXED: Added this line to close the search form on scroll 🌟
    searchForm.classList.remove("active"); 
}

// Functions to show/hide the cart
cartIcon.onclick = () => {
    cart.classList.add("active"); 
};

closeCart.onclick = () => {
    cart.classList.remove("active"); 
};

// 🌟 NEW: Functions to show/hide the search form 🌟
searchIcon.onclick = () => {
    searchForm.classList.add("active"); // Adds 'active' class to slide the search form down
};

closeSearch.onclick = () => {
    searchForm.classList.remove("active"); // Removes 'active' class to slide the search form up
};
// 🌟 END OF NEW CODE 🌟


// Main function to run when the page loads
function ready() {
    // 1. Remove Item From Cart
    var removeCartButtons = document.getElementsByClassName("cart-remove");
    for (var i = 0; i < removeCartButtons.length; i++) {
        var button = removeCartButtons[i];
        button.addEventListener("click", removeCartItem);
    }

    // 2. Quantity Changes
    var quantityInputs = document.getElementsByClassName("cart-quantity");
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }

    // 3. Add to Cart Buttons
    var addCart = document.getElementsByClassName("add-cart");
    for (var i = 0; i < addCart.length; i++) {
        var button = addCart[i];
        button.addEventListener("click", addCartClicked);
    }

    // 4. Buy Button Event
    document.getElementsByClassName("btn-buy")[0].addEventListener("click", buyButtonClicked);
    
    // Initial update to ensure total is correct
    updateTotal();
}

// --- Cart Logic Functions ---

function buyButtonClicked() {
    alert("Your order is placed successfully!");
    // Clear the cart content
    var cartContent = document.getElementsByClassName("cart-content")[0];
    while (cartContent.hasChildNodes()) {
        cartContent.removeChild(cartContent.firstChild);
    }
    updateTotal(); // Reset total to $0
    // Optional: Hide the cart after purchase
    cart.classList.remove("active");
}

function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove(); // Removes the entire 'cart-box' div
    updateTotal(); // Recalculate total
}

function quantityChanged(event) {
    var input = event.target;
    // Validation: ensure the input value is a positive number
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal(); // Recalculate total based on new quantity
}

function addCartClicked(event) {
    var button = event.target;
    // Traverse the DOM to get product info from the parent box
    var shopProducts = button.closest(".box"); 
    var title = shopProducts.getElementsByClassName("product-title")[0].innerText;
    var price = shopProducts.getElementsByClassName("price")[0].innerText;
    var productImg = shopProducts.getElementsByTagName("img")[0].src;
    
    // Call the function to construct and insert the cart item
    addProductToCart(title, price, productImg);
    updateTotal();
    cart.classList.add("active"); // Open the cart when an item is added
}

function addProductToCart(title, price, productImg) {
    var cartItems = document.getElementsByClassName("cart-content")[0];
    var cartItemsNames = cartItems.getElementsByClassName("cart-product-title");

    // Check for duplicate items
    for (var i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText == title) {
            alert("You have already added this item to the cart.");
            return;
        }
    }

    // Create the new cart element HTML structure
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");

    // Template for a single cart item
    var cartBoxContent = `
        <img src="${productImg}" alt="" class="cart-img">
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" value="1" class="cart-quantity">
        </div>
        <i class="fas fa-trash cart-remove"></i>`; // Changed to use 'fas fa-trash' for consistency
    
    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox);

    // *IMPORTANT*: Re-bind events to the newly created elements
    cartShopBox.getElementsByClassName("cart-remove")[0].addEventListener("click", removeCartItem);
    cartShopBox.getElementsByClassName("cart-quantity")[0].addEventListener("change", quantityChanged);
}

// Update Total Price
function updateTotal() {
    var cartContent = document.getElementsByClassName("cart-content")[0];
    var cartBoxes = cartContent.getElementsByClassName("cart-box");
    var total = 0;

    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName("cart-price")[0];
        var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];

        // 1. Clean the price string (e.g., "₹129" -> 129)
        // **FIXED:** Replaced "$" with "₹" to match your currency symbol in the HTML
        var price = parseFloat(priceElement.innerText.replace("₹", "")); 
        // 2. Get the quantity (ensure it's treated as a number)
        var quantity = quantityElement.value;
        // 3. Add to total
        total = total + (price * quantity);
    }
    
    // Format the total price to two decimal places and use the correct symbol
    document.getElementsByClassName("total-price")[0].innerText = "₹" + total.toFixed(2);
}