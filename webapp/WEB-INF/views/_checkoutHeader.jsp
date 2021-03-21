<%-- 
    Document   : _checkoutHeader
    Created on : 19-Mar-2021, 23:13:46
    Author     : bencleary
--%>

<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
 pageEncoding="ISO-8859-1"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
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
             </ul>
         </div>
    </div>

