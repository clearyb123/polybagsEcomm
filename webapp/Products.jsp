<%-- 
    Document   : Products
    Created on : 20-Dec-2020, 20:29:25
    Author     : bencleary
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix = "c" uri = "http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html>
    <head>
        <title>Products</title>
        <link rel="stylesheet" href="https://s3.amazonaws.com/codecademy-content/courses/ltp/css/bootstrap.css">
        <link type="text/css" rel="stylesheet" href="CSS/stylesheet.css"/>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>
        <div class='container'>
            <div class='nav-bar'>
                <ul class='nav-ul'>
                    <li class="btn btn-primary">Products</li>
                    <li class="btn btn-primary">Basket</li>
                </ul>
            </div>
            <div id='mybasket'>
                <div id='myBasketTitle'> 
                    <h3>My Basket</h3>
                </div>
            </div>
            <div class='container'>
                <div id='Products'>
                    <c:forEach >
                        <div class='product'></div>
                    </c:forEach>
                </div>
            </div>
        </div>
    </body>
</html>

