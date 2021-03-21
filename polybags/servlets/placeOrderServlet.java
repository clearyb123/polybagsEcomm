/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.polybags.servlets;

import com.google.gson.Gson;
import com.polybags.beans.LeadTime;
import com.polybags.beans.Order;
import com.polybags.beans.Product;
import com.polybags.beans.PromoCodes;
import com.polybags.utils.DBUtils;
import com.polybags.utils.MyUtils;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author bencleary
 */
@WebServlet(name = "placeOrderServlet", urlPatterns = {"/placeOrder"})
public class placeOrderServlet extends HttpServlet {

   

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
        doPost(request,response);
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
        Connection conn = MyUtils.getStoredConnection(request);
        String customerJSON = request.getParameter("customer");
        HttpSession session = request.getSession();
        String cookie = null; 
        Gson gson=new Gson();        
        Order order = gson.fromJson(customerJSON, Order.class);
        
        try{
                Cookie cart = MyUtils.getCookie(request, "cart");
                List<Product> products = DBUtils.getCart(conn, cart.getValue());
                PromoCodes promocode = DBUtils.getIntermediaryPromocode(conn, cart.getValue());
                if(products.isEmpty()){
                    System.out.println("Products is empty!");
                }
                String basketId = MyUtils.generateBasketId(conn);
                order.setProducts(products);
                order.setPromocode(promocode);
                order.setSubtotal();
                order.setTotal(conn);
                order.setCustomerName();
                order.setBasketId(basketId);
                order.setPOId(DBUtils.generatePurchaseOrderIdNumber(conn));
                order.setDueDate(order.getOrderSent().plusDays(order.getLeadTime()).toLocalDate());
                String orderJSON = new Gson().toJson(order);
                order.setJSON(orderJSON);
                
                DBUtils.placeOrder(conn, order);
                //Set email confirmation when live....
                //MyUtils.sendEmail(order.getEmail(order));
                DBUtils.confirmItemsGPO(conn, basketId, cart.getValue());
                
                Cookie cookie2 = new Cookie("basketId", basketId);
                cookie2.setMaxAge(60*60);
                cookie2.setPath("/");
                response.addCookie(cookie2);
                response.sendRedirect("orderConfirmation");
                session.invalidate();
        }catch(Exception e){
            e.printStackTrace();
        }
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
