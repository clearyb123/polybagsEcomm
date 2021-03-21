<%-- 
    Document   : header
    Created on : 28-Dec-2020, 12:00:43
    Author     : bencleary
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<head>
    <meta http-equiv="Content-Type" content="text/html;" charset="UTF-8">
    <link type="text/css" rel="stylesheet" href="CSS/stylesheet.css">
    <link rel="stylesheet" href="https://s3.amazonaws.com/codecademy-content/courses/ltp/css/bootstrap.css">
    <link rel="stylesheet" href="CSS/font-awesome-4.7.0/css/font-awesome.min.css">
    <title>Polybags | </title>
</head>
<body>
    <div class="nav-menu">
        <div class="Title">
            <h2 ><a id="title"href="${pageContext.request.contextPath}/">Polybags</a></h2>
        </div>
        <ul class="nav">
            <li class="nav-item" id="productsNav"><a href="${pageContext.request.contextPath}/collection">Products</a></li>
            <li class="nav-item" id="contactNav"><a>Contact Us</a></li>
            <li class="nav-item" id="aboutNav"><a>About Us</a></li>
            <li class="nav-item" id="myBasketNav"><i class="fa fa-cart-plus fa-2x"></i><div class="cart-items" id="cartItems"></div></li>
        </ul>
    </div>
</div>

