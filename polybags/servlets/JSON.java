/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.polybags.servlets;

import com.google.gson.Gson;
import com.polybags.beans.Discount;
import com.polybags.beans.Product;
import com.polybags.utils.DBUtils;
import com.polybags.utils.MyUtils;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author bencleary
 */
@WebServlet(name = "JSON", urlPatterns = {"/JSON"})
public class JSON extends HttpServlet {

 // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        Connection conn = MyUtils.getStoredConnection(request);
        Cookie[] cookies = request.getCookies();
        boolean foundCookie = false;
        String cookie = "";
        for (Cookie cookie1 : cookies) {
            if (cookie1.getName().equals("cart")) {
                cookie = cookie1.getValue();
                foundCookie = true;
            }
        }  

        if (!foundCookie) {
            Cookie cookie1 = new Cookie("cart", request.getSession().getId());
            cookie = cookie1.getValue();
            cookie1.setMaxAge(24*60*60);
            response.addCookie(cookie1); 
        }
        String errorString = null;
        List<Product> productsList = null;
        List<Discount> discountsList = null;
       try {
            productsList = DBUtils.getProducts(conn,cookie);
            discountsList = DBUtils.getDiscounts(conn);

        } catch (SQLException e) {
            e.printStackTrace();
            errorString = e.getMessage();
        }
        // Store info in request attribute, before forward to views
        request.setAttribute("errorString", errorString);
        
        String products = new Gson().toJson(productsList);
        String discounts = new Gson().toJson(discountsList);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String JSON = "["+products+","+discounts+"]";
        response.getWriter().write(JSON);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
        }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
