/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var main = function () {
    let cart = [];


    window.addEventListener('DOMContentLoaded', function () {
        const products = new Products();
        products.getJSON().then(data => {
            products.displayProducts(data[0]);
            Storage.saveProducts(data[0]);
            Storage.saveDiscounts(data[1]);
            setupAPP(products);
        });

        if (window.location.pathname === "/Polybags/") {
            products.getLatestProducts().then(data => {
                products.displayLatestReleases(data);
            });
        }
        if (window.location.pathname === "/Polybags/product") {
            const product = new Product();
            product.getProduct().then(product =>
                ProductPage.setUpProductPage(product)
            );
            products.getLatestProducts().then(data => {
                products.displayLatestReleases(data);
            });
        }
    });

    $('body').on('click', '.fa-chevron-up', function () {
        let id = $(this).attr('data-id');
        let qty = increaseQuantity(id);
        this.nextElementSibling.innerText = qty;
    });

    $('body').on('click', '.fa-chevron-down', function () {
        let id = $(this).attr('data-id');
        let currentElement = this;
        let qty = decreaseQuantity(id, currentElement);
        this.previousElementSibling.innerText = qty;
    });

    $('body').on('click', '.remove', function () {
        let id = $(this).attr('data-id');
        removeCartItem(id);
        document.getElementById('cartContent').removeChild(this.parentElement.parentElement);

    });

    $('body').on("click", ".fa-window-close", function () {
        closeCart();
    });

    $('body').on("click", ".clear-cart", function () {
        clearCart();
    });

    $('body').on("click", ".addToBasket", function () {
        let currentElement = $(this).attr("id");
        let id = $(this).attr("data-id");
        let LNo = (cart.length + 1) * 10;
        let qty = parseInt($("#qty_product_page").val());
        if (!$("#" + currentElement).hasClass("selected")) {
            let cartItem = {...Storage.getProduct(id), qty: qty, LNo: LNo};
            cart = [...cart, cartItem];
            Storage.saveCart(cart);
            Storage.sendItem(Storage.getProductFromCart(id));
            addToCart(cartItem);
            showCart(cart);
        }
    });

    $('body').on("click", "#myBasketNav", function () {
        showCart(cart);
    });

    $('body').on("click", ".checkout-cart", function () {
        submitCart();
    });

    $('body').on("change", "#per", function () {
        perDataChange(2);
    });

    $('.submitNewsletter').click(function () {
        const newsletter = new Newsletter();
        let emailaddress = $('#newsletterInput').val();
        newsletter.sendNewsletterEmailAddress(emailaddress);
    });

    /* Individual product page */

    class Products {
        async getJSON() {
            try {
                let result = await fetch("JSON");
                let data = await result.json();

                return data;
            } catch (error) {
                console.log(error);
            }
        }

        displayProducts(products) {
            let queryString = window.location.search;
            if(queryString != ""){ 
                queryString = queryString.replace("?id=",""); 
                products = products.filter(item => item.id != queryString)
                products = products.slice(0,3);
            };
            let result = '';
            products = products.filter(product => {
                return product.enableDisplay == 'Y';
            });

            products.forEach(product => {
                result += '<div class="product">'
                        + '<a class="get_product_link" href="product?id=' + product.id + '"></a>'
                        + '<div class="productImage">'
                        + '<img class="image" src="Images/' + product.image + '">'
                        + '</div>'
                        + '<div class="size">'
                        + '<p><strong>' + product.size + '</strong></p>'
                        + '</div>'
                        + '<div class="middle">'
                        + '<div class="price">'
                        + '<p>&pound;' + product.price + '</p>'
                        + '</div>'
                        + '</div>'
                        + '</div>'
                        + '</div>';
            });
            $(".products .containerS").append(result);
        }

        displayNumberOfProducts() {
            let products = JSON.parse(localStorage.getItem("products"));
            products = products.filter(product => {
                return product.enableDisplay == 'Y';
            });
            $('#number').text(products.length);
        }

        async getLatestProducts() {
            try {
                let result = await fetch("latestReleases");
                let data = await result.json();
                let latestProducts = data;

                return latestProducts;
            } catch (error) {
                console.log(error);
            }
        }

        displayLatestReleases(latestProducts) {            
            let result = '';
            latestProducts.forEach(product => {
                result += '<div class="product">'
                        + '<a class="get_product_link" href="product?id=' + product.id + '"></a>'
                        + '<div class="productImage">'
                        + '<img class="image" src="Images/' + product.image + '">'
                        + '</div>'
                        + '<div class="size">'
                        + '<p><strong>' + product.size + '</strong></p>'
                        + '</div>'
                        + '</div>'
                        + '</div>';
            });
            $(".latestproducts").append(result);

        }
        ;
    }


    function showCart() {
        $("#Basket").addClass("showCart");
        $("#transparentBasket").addClass("transparentBcg");
        if (cart.length > 0) {
            $(".checkout-cart").removeClass("notVisible");
        } else {
            $(".checkout-cart").addClass("notVisible");
        }
        setCartValues(cart);
    }

    function increaseQuantity(id) {
        let tempItem = cart.find(item => item.id == id);
        tempItem.qty = tempItem.qty + 1;
        Storage.saveCart(cart);
        setCartValues(cart);
        updateQuantity(tempItem);
        return tempItem.qty;
    }

    function decreaseQuantity(id, currentElement) {
        let tempItem = cart.find(item => item.id == id);
        tempItem.qty = tempItem.qty - 1;
        if (tempItem.qty > 0) {
            Storage.saveCart(cart);
            setCartValues(cart);
            updateQuantity(tempItem);
            return tempItem.qty;
        } else {
            document.getElementById('cartContent').removeChild(currentElement.parentElement.parentElement);
            removeCartItem(tempItem.id);
        }

    }



    function removeCartItem(id) {
        $.ajax({
            method: "POST",
            url: "removeFromCart",
            data: {
                product: JSON.stringify(Storage.getProductFromCart(id))
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            },
            success: function () {
            }
        });
        cart = cart.filter(item => item.id != id);
        Storage.saveCart(cart);
        setCartValues(cart);
        revertCartButton(id);
    }

    function clearCart() {
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => removeCartItem(id));
        while (document.getElementById('cartContent').children.length > 0) {
            document.getElementById('cartContent').removeChild(document.getElementById('cartContent').children[0]);
        }
        closeCart();
    }

    function closeCart() {
        $("#Basket").removeClass("showCart");
        $("#transparentBasket").removeClass("transparentBcg");
    }

    function amendCartButton(currentElement) {
        $("#" + currentElement).children().eq(1).addClass("visible");
        $("#" + currentElement).children().eq(0).addClass("notVisible");
        $("#" + currentElement).addClass("selected");

    }
    function revertCartButton(currentElement) {
        $("#" + currentElement).children().eq(1).removeClass("visible");
        $("#" + currentElement).children().eq(0).removeClass("notVisible");
        $("#" + currentElement).removeClass("selected");
    }


    function addToCart(item) {
        let divItem = '<div class="cart-item">'
                + '<div class="cart-item-image">'
                + '<img class="image" src="Images/' + item.image + '">'
                + '</div>'
                + '<div class="cart-item-title">'
                + '<h4>' + item.size + '</h4>'
                + '<h5 class="cart-item-per"><strong>Per: ' + item.per + '</strong></h5>'
                + '<h5 class="cart-item-price"><strong>&pound;' + item.price + '</strong></h5>'
                + '<span class="remove" data-id="' + item.id + '">remove</span>'
                + '<span class="discountApplied" id="discountApplied' + item.id + '" data-id="' + item.id + '"></span>'
                + '</div>'
                + '<div class="qty">'
                + '<i class="fa fa-chevron-up" data-id="' + item.id + '"></i>'
                + '<p class="item-amount">'
                + item.qty
                + '</p>'
                + '<i class="fa fa-chevron-down" data-id="' + item.id + '"></i>'
                + ' </div>'
                + '</div>';
        $('.cartContent').append(divItem);
    }

    function applyDiscountCart(item) {
        let discount = Storage.getDiscount(item.id, item.qty);
        if (typeof discount !== "undefined") {
            document.getElementById('discountApplied' + item.id).innerText = discount.discount + '% discount applied';
            return discount.discount;
        } else {
            document.getElementById('discountApplied' + item.id).innerText = '';
            return 0;
        }
    }

    function setCartValues(cart) {
        let temptotal = 0;
        let subtotal = 0;
        let itemsTotal = 0;
        let discountNum = 0;
        cart.map(item => {
            discountNum = applyDiscountCart(item);
            subtotal += item.qty * item.price;
            temptotal += (item.qty * item.price) - ((item.qty * item.price) * (discountNum / 100));
            itemsTotal += item.qty;
            amendCartButton(item.id);
        });

        temptotal = temptotal.toFixed(2);
        subtotal = subtotal.toFixed(2);
        document.getElementById('totalAmount').innerText = temptotal;
        document.getElementById('subTotalAmount').innerText = subtotal;
        document.getElementById('cartItems').innerText = itemsTotal;

    }
    ;

    function setupAPP(products) {
        cart = Storage.getCart();
        if (cart.length == 0) {
            populateCart(cart);
            setCartValues(cart);
        }
        if (!cart.length == 0) {
            if (Storage.getCookie("cart") == cart[0].sessionId) {
                populateCart(cart);
                setCartValues(cart);
            } else {
                cart = [];
                Storage.saveCart(cart);
                Storage.clearLocalCart();
                document.getElementById('cartItems').innerText = 0;
            }
        }
        products.displayNumberOfProducts();
    }



    function populateCart(cart) {
        cart.forEach(item => addToCart(item));
    }

    function submitCart() {
        window.location.assign("checkOut");
    }

    function updateQuantity(item) {
        $.ajax({
            method: "POST",
            url: "updateQuantity",
            data: {
                product: JSON.stringify(item)
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            },
            success: function () {
            }
        });
    }

    function perDataChange(id) {
        let product = Storage.getProduct(id);
        let perValue = $("#per").val();
        product = Storage.getProductUsingPer(perValue, product.size);
        ProductPage.displayPerChange(product);
        setCartValues(cart);
    }

    class Storage {
        static saveProducts(products) {
            localStorage.setItem("products", JSON.stringify(products));
        }

        static sendItem(item) {
            $.ajax({
                method: "POST",
                url: "addToCart",
                data: {
                    product: JSON.stringify(item)
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr.status);
                    console.log(thrownError);
                },
                success: function () {
                    console.log("Item sent to the server");
                }
            });
        }

        static getDiscount(id, qty) {
            let discounts = JSON.parse(localStorage.getItem("discounts"));
            let discountSelect = discounts.filter(discount => discount.productId == id && qty >= discount.per);
            if (discountSelect.length >= 2) {
                if (qty >= discountSelect[0].per && qty >= discountSelect[1].per) {
                    return discountSelect[1];
                } else {
                    return discountSelect[0];
                }
            } else {
                return discountSelect[0];
            }
        }

        static getProduct(id) {
            let products = JSON.parse(localStorage.getItem("products"));
            return products.find(product => product.id == id);
        }

        static getProductUsingPer(per, size) {
            let products = JSON.parse(localStorage.getItem("products"));
            return products.find(product => product.per == per && product.size == size);
        }

        static getProducts() {
            return JSON.parse(localStorage.getItem("products"));
        }

        static getProductFromCart(id) {
            let products = JSON.parse(localStorage.getItem("cart"));
            return products.find(product => product.id == id);
        }
        static saveDiscounts(discountsData) {
            localStorage.setItem("discounts", JSON.stringify(discountsData));

        }
        static saveCart(cart) {
            localStorage.setItem("cart", JSON.stringify(cart));
        }

        static getCart() {
            return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
        }

        static getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }

        static clearLocalCart() {
            localStorage.removeItem("cart");
        }
    }


    class Product {
        async getProduct() {
            try {
                let result = await fetch("productData" + window.location.search);
                let data = await result.json();
                let product = data;

                return product;
            } catch (error) {
                console.log(error);
            }
        }

        calculateProductsPer(id) {
            let products = Storage.getProducts();
            let tempItem = products.find(item => item.id == id);
            let itemDescription = tempItem.size;
            products = products.filter(function (item) {
                return item.size == itemDescription;
            });

            return products;
        }
    }

    class ProductPage {
        static ProductPage() {
        }

        static setUpProductPage(product) {
            this.displayProductDetails(product);
            setCartValues(cart);
        }

        static displayProductDetails(product) {
            let addToBasket = '<div class="addToBasket" id="' + product.id + '" data-id="' + product.id + '">'
                    + '<p  class="add"><b>ADD TO CART</b></p>'
                    + '<p  class="inBasket"><b>IN CART</b></p>'
                    + '</div>';
            let qtyInput = '<p><b>Quantity:</b></p>'
                    + '<input name="quantity" id="qty_product_page" min="1" type="number" value="1" data-id=' + product.id + '>'
                    + '<p style="margin-top:10px">Get <span style="color:red;">5%</span> off when ordering quantities of 3 or more.</p>'
                    + '<p>Get <span style="color:red">10%</span> off when ordering quantities of 5 or more.</p>'
            let dropdown = this.initiateDropdown(product);

            if (dropdown !== undefined)
                $(".per_Dropdown").append(dropdown);
            console.log(product.price);
            $("#product_Price_Span").text(decodeURIComponent(escape('£'+ product.price)));
            $("#product_Title_Span").text(product.size);
            $("#main_image").attr("src", "Images/" + product.image);
            $(".addToBasketContainer").append(addToBasket);
            $(".Quantity").append(qtyInput);
            //Provide secondary images data when ready
            /*$("#secondary_image_first").attr("src", "Images/"+product.image);
             $("#secondary_image_second").attr("src", "Images/"+product.image);
             $("#secondary_image_third").attr("src", "Images/"+product.image);
             $("#secondary_image_fourth").attr("src", "Images/"+product.image);*/

        }

        static displayPerChange(product) {
            let addToBasket = '<div class="addToBasket" id="' + product.id + '" data-id="' + product.id + '">'
                    + '<p  class="add"><b>ADD TO CART</b></p>'
                    + '<p  class="inBasket"><b>IN CART</b></p>'
                    + '</div>';

            document.getElementById("product_Price_Span").innerText = decodeURIComponent(escape('£' + product.price));
            $(".addToBasket").replaceWith(addToBasket);

        }

        static initiateDropdown(product) {
            const productObj = new Product();
            let perDropdown;
            let productsPer = productObj.calculateProductsPer(product.id);
            if (productsPer !== undefined) {
                perDropdown = '<label for="per">Per:</label>'
                        + '<select name="per" id="per">';

                productsPer.forEach(product => {
                    let option = '<option value="' + product.per + '">' + product.per + '</option>';
                    perDropdown = perDropdown + option;
                });
                perDropdown = perDropdown + '</select><p>Tax included.<span style="color:green"> Free </span> shipping on orders of 1000 or more.</p>';
                return perDropdown;
            } else {
                return undefined;
            }
        }

    }

    class Newsletter {
        async sendNewsletterEmailAddress(emailaddress) {
            console.log(emailaddress);
            fetch('newsletter', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    emailaddress: emailaddress
                })
            })
                    .catch(err => {
                        this.displayError();
                    }).then(response => {
                if (response.ok)
                    this.displaySuccessfullySent();
            });
        }

        displaySuccessfullySent() {
            $(".formNewsletter").replaceWith('<p style="color:green">Email added to mailing list!</p>');
        }

        displayError(err) {
            alert('There has been an error: ' + err);
        }
    }

};

$(document).ready(main);


