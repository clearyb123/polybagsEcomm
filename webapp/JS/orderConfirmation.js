/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var main = function () {
    let orderData;
    let leadtimeData;
    window.addEventListener('DOMContentLoaded', function () {
        getOrderConfirmationJSON();
    });

    function getOrderConfirmationJSON() {
        $.ajax({
            url: "orderConfirmationData",
            dataType: 'json',
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            },
            success: function (data) {
                orderData = JSON.parse(data[0]);
                leadtimeData = data[1];
                setData(orderData, leadtimeData);
            }
        });
    }


    function setData(data, leadtimeData) {
        let total = data.total.toFixed(2);
        let subtotal = data.subtotal.toFixed(2);
        let discount = subtotal - (total - data.deliveryPrice);
        discount = discount.toFixed(2);
        let itemsTotal = 0;
        let divItem = '<div>'
                + '<h5>Discount</h5>'
                + '</div>'
                + '<div>'
                + '<span id="discountContent">' + "- £" + discount + '</span>'
                + '</div>';

        let products = data.products;
        document.getElementsByClassName("name")[0].innerText = data.firstName + ", ";
        document.getElementsByClassName("name")[1].innerText = data.firstName + " " + data.lastName + ",";
        document.getElementById("orderNumber").innerText = " " + data.POId;
        document.getElementById("orderDate").innerText = " " + data.orderSent.date.day + "/" + data.orderSent.date.month + "/" + data.orderSent.date.year + " " + data.orderSent.time.hour + ":" + data.orderSent.time.minute;
        document.getElementById("estimatedDeliveryDate").innerText = " " + data.dueDate.day + "/" + data.dueDate.month + "/" + data.dueDate.year;
        document.getElementById("firstLineAddress").innerText = data.shipToStreet1 + ",";
        document.getElementById("secondLineAddress").innerText = data.shipToStreet2 + ",";
        document.getElementById("county").innerText = data.county + ",";
        document.getElementById("country").innerText = data.country + ",";
        document.getElementById("postcode").innerText = data.shipToPostcode;
        document.getElementById("subtotalAmount").innerText = '£' + subtotal;
        console.log(discount);
        console.log($(".discountCheckout").hasClass("notVisible"));
        if (discount > 0 && $(".discountCheckout").hasClass("notVisible")) {
            $(".discountCheckout").removeClass("notVisible");
            $(".discountCheckout").append(divItem);
        }
        document.getElementById("totalAmount").innerText = '£' + total;
        document.getElementById("deliveryMethodInformation").innerText = leadtimeData.description;
        document.getElementById("orderConfirmationDeliveryPrice").innerText = '£' + data.deliveryPrice;
        products.forEach(item => {

            item.JSON = JSON.parse(item.JSON);
            let divItem = '<div class="confirmation-cart-item">'
                    + '<div class="confirmation-cart-item-image">'
                    + '<img class="image" src="Images/' + item.JSON.image + '">'
                    + '</div>'
                    + '<div class="confirmation-cart-item-title">'
                    + '<h4 style="color: grey;">' + item.size + '</h4>'
                    + '<h5 class="confirmation-cart-item-price"><strong>&pound;' + item.price + '</strong></h5>'
                    + '<h5 class="cart-item-per"><strong>Per: ' + item.per + '</strong></h5>'
                    + '<h5 class="confirmation-qty">Qty: <strong>' + item.qty + '</strong></h5>'
                    + '<span class="discountApplied" id="discountApplied' + item.id + '" data-id="' + item.id + '"></span>'
                    + '</div>'
                    + '</div>';
            itemsTotal += item.qty;
            $('.orderConfirmationBasketContent').append(divItem);
        });

        let divItem2 = '<h4 class="confirmationItemNumber"><strong>' + itemsTotal + ' ITEMS</strong></h4>';
        $('.orderConfirmationBasketTitle').append(divItem2);
    }

};

$("document").ready(main);
