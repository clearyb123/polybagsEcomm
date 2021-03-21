<%-- 
    Document   : Home
    Created on : 04-Mar-2021, 20:39:32
    Author     : bencleary
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<jsp:include page="_header.jsp"></jsp:include>  

    <div class="hero_large">
        <div class="landingImage">
            <div class="hero_large_inner">
                <h1>Clear Poly Bags with Suffocation Warning </h1>
                <div type="button" class="btn-primary btn shopNowBtn">
                    <a href="${pageContext.request.contextPath}/collection">SHOP NOW</a>
            </div>
        </div>
    </div>
</div>
<div class="hero_small">
    <div class="hero_small_inner ">
        <h3>LATEST ARRIVALS</h3>
        <div class="latestproducts">

        </div>                
    </div>
</div>

<div class="hero_large">
    <div class="secondImage">
        <div class="hero_large_inner">
            <h1>Clear Poly Bags with Suffocation Warning </h1>
            <div type="button" class="btn-primary btn shopNowBtn">
                <a href="${pageContext.request.contextPath}/collection">SHOP NOW</a>
            </div>
        </div>
    </div>
</div>
<div class="hero_small">
    <div class="hero_small_inner">
        <h5>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."</h5>
    </div>
</div>
<div class="hero_large">
    <div class="thirdImage">
        <div class="hero_large_inner">
            <h1>Clear Poly Bags with Suffocation Warning</h1>
            <div type="button" class="btn-primary btn shopNowBtn">
                <a href="${pageContext.request.contextPath}/collection">SHOP NOW</a>
            </div>
        </div>
    </div>
</div>
<div id="transparentBasket">
</div>
<div id="Basket">
    <i class="fa fa-window-close fa-lg"></i>
    <div  id="basketTitle"> 
        <h2>My Basket</h2>
    </div>
    <div class="cartContent" id="cartContent">   
    </div>
    <div class="cartFooter">
        <div class="subTotal">
            <h5>SubTotal: £</h5>
            <span class="subTotalAmount" id="subTotalAmount"></span>
        </div>
        <div class="Total">
            <h4>Your Total: £</h4>
            <span class="totalAmount" id="totalAmount"></span>
        </div>
        <button class="clear-cart banner-btn">CLEAR CART</button>
        <button class="checkout-cart banner-btn notVisible">CHECKOUT</button>
        <p style="color: black;font: 10px;">Items are reserved for 24 hours</p>
    </div>
</div>
<jsp:include page="_footer.jsp"></jsp:include>
<script src="JS/storeAndBasket.js"></script>
</body>
</html>
