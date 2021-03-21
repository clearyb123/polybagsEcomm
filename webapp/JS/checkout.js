/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var main = function () {

    let originalTotal;
    let cart = [];
    let address = {};
    let totals = [];
    let leadtime = [];
    let deliveryLeadTime;
    let deliveryPrice;
    let userSelect = false;
    window.addEventListener('DOMContentLoaded', function () {
        if (performance.navigation.type == 2) {
            window.location.assign("collection");
        }
        setUpApp();

    });
    //Edit basket????
    //give products discount notification
    //set form data in stone before placing order 
    //email confirmation to customer and dad
    //promocode functionality
    //set promocode database
    //apply promocode to totals

    $('body').on('click', '.deliveryMethodSelect', function () {
        deliveryPrice = this.getAttribute("data-price");
        displayBasketDelivery(this.getAttribute("data-displayPrice"));
        if (deliveryPrice !== null) {
            if (deliveryPrice != 0 && totals[0] === originalTotal) {
                totals[0] = (parseFloat(totals[0]) + parseFloat(deliveryPrice)).toFixed(2);
                userSelect = true;
            } else if (deliveryPrice == 0) {
                totals[0] = originalTotal;
                userSelect = false;
            }
            displayTotals(totals);

        }
    });

    $(".applyPromo").click(function () {
        let promoCode = $("#promoCodeInput").val();
        applyPromoCode(promoCode);
    });


    $("#sameAsShippingAddress").click(function () {
        sameAsDeliveryAddress(this.checked);
    });

    $(".placeOrderButton").click(function () {
        var emailAddressinput = $("#emailAddress").val();
        var firstNameinput = document.getElementById("firstName").value;
        var lastNameinput = document.getElementById("lastName").value;
        var firstLineAddressinput = document.getElementById("firstLineAddress").value;
        var secondLineAddressinput = document.getElementById("secondLineAddress").value;
        var thirdLineAddressinput = document.getElementById("thirdLineAddress").value;
        var countryinput = document.getElementById("country").value;
        var cityinput = document.getElementById("city").value;
        var postcodeinput = document.getElementById("postalcode").value;
        var countyinput = document.getElementById("county").value;
        deliveryLeadTime = $(".deliveryMethodSelect:checked").val();
        deliveryPrice = $(".deliveryMethodSelect:checked").attr("data-price");
        var billingSecondLineAddress = document.getElementById("billingSecondLineAddress").value;
        var billingThirdLineAddress = document.getElementById("billingThirdLineAddress").value;
        if (emailAddressinput === "" || firstNameinput === "" || lastNameinput === "" || firstLineAddressinput === "" || postcodeinput === "" || countryinput === "") {
            if (emailAddressinput === "") {
                $("#emailValidationError").text('*Please enter your email address');
            }
            if (!Boolean(firstNameinput)) {
                $("#firstNameValidationError").text('*Please enter your First Name');
            }
            if (!Boolean(lastNameinput)) {
                $("#lastNameValidationError").text('*Please enter your Last Name');
            }
            if (!Boolean(firstLineAddressinput)) {
                $("#firstLineAddressValidationError").text('*Please enter your address details');
            }
            if (!Boolean(postcodeinput)) {
                $("#postcodeValidationError").text('*Please enter a valid postcode');
            }
            if (countryinput === "0") {
                $("#countryValidationError").text('*Please enter a country');
            }
            $("#masterValidationError").text('*Please fill in your details');
        } else {
            address.email = emailAddressinput;
            address.firstName = firstNameinput;
            address.lastName = lastNameinput;
            address.shipToStreet1 = firstLineAddressinput;
            if (secondLineAddressinput !== "") {
                address.shipToStreet2 = secondLineAddressinput;
            }
            if (thirdLineAddressinput !== "") {
                address.shipToStreet3 = thirdLineAddressinput;
            }
            address.country = countryinput;
            if (countyinput !== "") {
                address.county = countyinput;
            }
            address.city = cityinput;
            address.shipToPostcode = postcodeinput;
            address.leadtime = deliveryLeadTime;
            address.deliveryPrice = deliveryPrice;
            if (!document.getElementById("sameAsShippingAddress").checked) {
                address.billingAddressFirstLine = document.getElementById("billingFirstLineAddress").value;
                if (billingSecondLineAddress !== null) {
                    address.billingAddressSecondLine = billingSecondLineAddress;
                }
                if (billingThirdLineAddress !== null) {
                    address.billingAddressThirdLine = billingThirdLineAddress;
                }
                address.billingAddressCity = document.getElementById("billingAddressCity").value;
                address.billingAddressCounty = document.getElementById("billingAddressCounty").value;

            } else {
                address.firstLineBillingAddress = firstLineAddressinput;
                if (secondLineAddressinput !== null) {
                    address.billingSecondLineAddress = secondLineAddressinput;
                }
                if (thirdLineAddressinput !== null) {
                    address.billingThirdLineAddress = thirdLineAddressinput;
                }
                address.billingAddressCity = cityinput;
                address.billingAddressCounty = countyinput;
                address.billingAddressCountry = countryinput;
            }
            //Initiate payment and place order after billing address and ship to address is set
            onGetCardNonce(event);

        }
    });


    /*Displays billing address input when same as delivery address is checked or unchecked*/
    function sameAsDeliveryAddress(checked) {
        if (checked) {
            $(".billingAddressInput").addClass("displayNot");
            $(".billingAddressInput").removeClass("display");

        } else {
            $(".billingAddressInput").removeClass("displayNot");
            $(".billingAddressInput").addClass("display");
        }
    }

    function setUpApp() {
        $.ajax({
            url: "returnCart",
            dataType: 'json',
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            },
            success: function (data) {
                leadtime = data[2];
                if (data[3] !== null) {
                    removePromoInputBox(data[3].description);
                }
                displayDeliveryOptions(data[2]);
                totals = data.filter(function (item) {
                    return item !== leadtime;
                });
                totals[0] = totals[0].toFixed(2);
                originalTotal = totals[0];
                totals[1] = totals[1].toFixed(2);
                displayTotals(totals);
                cart = Storage.getCart();
                displayCheckoutBasket(cart, totals);
            }

        });


    }

    function applyPromoCode(promoCode) {
        $.ajax({
            method: "POST",
            url: "returnCart",
            dataType: 'json',
            data: {
                promocode: JSON.stringify(promoCode)
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            },
            success: function (data) {
                console.log(data[2]);
                if (data[2] != null) {
                    removePromoInputBox(data[2].description);
                } else {
                    $(".promocodeSuccessMessage").text("Promo code does not exist. Please try again.");
                }

                totals = data.filter(function (item) {
                    return item !== leadtime;
                });
                totals[0] = totals[0].toFixed(2);
                originalTotal = totals[0];
                totals[1] = totals[1].toFixed(2);
                displayTotals(totals);
            }

        });

    }

    function removePromoInputBox(promocode) {
        $(".promocodeInput").addClass("displayNot");
        $(".promocodeSuccessMessage").text(promocode + " promocode applied!");
    }

    function displayDeliveryOptions(leadtime) {
        let checked = "checked";
        let displayPrice = "";
        for (var i = 0; i < leadtime.length; i++)
        {
            if (leadtime.length >= 2 && leadtime[i].leadtime === 1) {
                leadtime[i].autoselect = leadtime[i].price;
                displayPrice = leadtime[i].autoselect;
                checked = "";
            } else {
                checked = "checked";
            }
            if (leadtime[i].autoselect === 0) {
                displayPrice = 'Free';
            } else {
                ;
                displayPrice = decodeURIComponent(escape('£' + leadtime[i].autoselect));
            }
            if (checked == "checked") {
                displayBasketDelivery(displayPrice);
            }
            let divitem = '<div class="deliveryMethod">'
                    + '<div class="deliveryMethodPrice">'
                    + '<p>' + displayPrice + '</p>'
                    + '</div>'
                    + '<div class="deliveryMethodDetails">'
                    + '<div class="deliveryMethodDescription">'
                    + '<label class="title">' + leadtime[i].description + '</label>'
                    + '<div class="deliveryInfo"><i class="fa fa-info-circle"></i>' + leadtime[i].info + '</div>'
                    + '</div>'
                    + '</div>'
                    + '<div >'
                    + '<input type="radio"' + checked + ' value="' + leadtime[i].leadtime + '" data-displayPrice = "' + displayPrice + '" data-price = "' + leadtime[i].autoselect + '" class="deliveryMethodSelect" id="deliveryMethodSelect"' + leadtime[i].leadtime + ' name="deliveryMethodSelect">'
                    + '</div>'
                    + '</div>';
            $(".deliveryMethodContent").append(divitem);
        }

    }

    function displayBasketDelivery(price) {
        if (price !== null) {
            $('#checkoutDeliveryPrice').text(price);
        }

    }

    function displayCheckoutBasket(cart) {
        let itemsTotal = 0;

        cart.forEach(item => {
            let divItem = '<div class="cart-item">'
                    + '<div class="cart-item-image">'
                    + '<img class="image" src="Images/' + item.image + '">'
                    + '</div>'
                    + '<div class="cart-item-title">'
                    + '<h4 class="cart-item-price"><strong>&pound;' + item.price + '</strong></h5>'
                    + '<h4 style="color: grey;">' + item.size + '</h4>'
                    + '<h5 class="cart-item-per"><strong>Per: ' + item.per + '</strong></h5>'
                    + '<h5 class="qty">Qty: <strong>' + item.qty + '</strong></h5>'
                    + '<span class="discountApplied" id="discountApplied' + item.id + '" data-id="' + item.id + '"></span>'
                    + '</div>'
                    + '</div>';
            itemsTotal += item.qty;
            $('.checkoutBasketContent').append(divItem);
        });

        let divItem2 = '<h4 class="checkoutItemNumber"><strong>' + itemsTotal + ' ITEMS</strong></h4>';
        $('.checkoutBasketTitle').append(divItem2);

    }

    function displayTotals(totals) {
        let total = totals[0];
        let subtotal = totals[1];
        let discount = subtotal - total;
        discount = discount.toFixed(2);

        let divItem = '<div>'
                + '<h5>Discount</h5>'
                + '</div>'
                + '<div>'
                + '<span id="discountContent">' + "- " + decodeURIComponent(escape('£' + discount)) + '</span>'
                + '</div>';
        document.getElementById('totalAmount').innerText = decodeURIComponent(escape('£' + total));
        document.getElementById('subTotalAmount').innerText = decodeURIComponent(escape('£' + subtotal));
        if (discount > 0 && $(".discountCheckout").hasClass("notVisible")) {
            $(".discountCheckout").removeClass("notVisible");
            $(".discountCheckout").append(divItem);
        }
    }

    function displayLoader(element) {
        let divitem = '<div class="loader"></div><span id="processingOrder">...Processing Order</span>';
        $(".placeOrderText").addClass("hide");
        $("#" + element).append(divitem);
    }

    function placeOrder(address) {
        $.ajax({
            method: "POST",
            url: "placeOrder",
            data: {
                cart: JSON.stringify(cart),
                customer: JSON.stringify(address)
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            },
            success: function () {
                Storage.clearLocalStorage();
                Storage.deleteAllCookies();
                window.location.assign("orderConfirmation");
            }
        });
    }



    class Storage {
        static getProductFromCart(id) {
            let products = JSON.parse(localStorage.getItem("cart"));
            return products.find(product => product.id == id);
        }

        static clearLocalStorage() {
            localStorage.removeItem("cart");
            localStorage.removeItem("products");
            localStorage.removeItem("discounts");
        }

        static getCart() {
            return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
        }

        static deleteAllCookies() {
            var cookies = document.cookie.split(";");

            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                var eqPos = cookie.indexOf("=");
                var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
        }
    }

//******* Square Payment Form **********    

    //TODO: paste code from step 2.1.1
    const idempotency_key = uuidv4();

    // Create and initialize a payment form object
    const paymentForm = new SqPaymentForm({
        // Initialize the payment form elements

        //TODO: Replace with your sandbox application ID
        applicationId: "sandbox-sq0idb-3b-DYDB9_Hd4YQlW1dtETg",
        inputClass: 'sq-input',
        autoBuild: false,
        // Customize the CSS for SqPaymentForm iframe elements
        inputStyles: [{
                fontSize: '16px',
                lineHeight: '10px',
                padding: '10px',
                placeholderColor: '#a0a0a0',
                backgroundColor: 'transparent'
            }],
        // Initialize the credit card placeholders
        cardNumber: {
            elementId: 'sq-card-number',
            placeholder: 'Card Number'
        },
        cvv: {
            elementId: 'sq-cvv',
            placeholder: 'CVV'
        },
        expirationDate: {
            elementId: 'sq-expiration-date',
            placeholder: 'MM/YY'
        },
        postalCode: {
            elementId: 'sq-postal-code',
            placeholder: 'Postal Code'
        },
        // SqPaymentForm callback functions
        callbacks: {
            /*
             * callback function: cardNonceResponseReceived
             * Triggered when: SqPaymentForm completes a card nonce request
             */
            cardNonceResponseReceived: function (errors, nonce, cardData) {
                if (errors) {
                    // Log errors from nonce generation to the browser developer console.
                    $("#ccValidationError").text("Please enter your correct card details and postcode");

                    console.error('Encountered errors:');
                    errors.forEach(function (error) {
                        console.error('  ' + error.message);
                    });
                    return;
                }

                //TODO: Replace alert with code in step 2.1
                displayLoader("sq-creditcard"),
                        fetch('process-payment', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                nonce: nonce,
                                idempotency_key: idempotency_key,
                                location_id: 'XMAC4NKSWPDKM',
                                amount: totals[0],
                                delivery: JSON.stringify({
                                    delivery_leadtime: deliveryLeadTime,
                                    user_select: userSelect})
                            })
                        })
                        .catch(err => {
                            alert('Network error: ' + err);
                        })
                        .then(response => {
                            if (!response.ok) {
                                return response.json().then(
                                        errorInfo => Promise.reject(errorInfo));
                            }
                            return response.json();
                        })
                        .then(data => {

                            placeOrder(address);
                        })
                        .catch(err => {
                            console.error(err.error);
                            alert('Payment failed to complete!\nCheck browser developer console for more details' + err.error);
                        });
            }
        }
    });
    //TODO: paste code from step 1.1.4
    //TODO: paste code from step 1.1.5
    paymentForm.build();

    //TODO: paste code from step 2.1.2
    // Generate a random UUID as an idempotency key for the payment request
    // length of idempotency_key should be less than 45
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // onGetCardNonce is triggered when the "Pay $1.00" button is clicked
    function onGetCardNonce(event) {
        // Don't submit the form until SqPaymentForm returns with a nonce
        event.preventDefault();
        // Request a nonce from the SqPaymentForm object
        paymentForm.requestCardNonce();
    }

    /*$("body").bind('scroll', function() {
     if ($("body").scrollTop() > 150) {
     $('.checkoutBasket').attr("style","position: fixed; top:0;");
     }
     if($("body").scrollTop() > 700){
     $('.checkoutBasket').attr("style"," margin-top: 400px;");
     }
     else {
     $('.checkoutBasket').removeAttr("style","position: fixed");
     }
     });*/
};

$(document).ready(main);