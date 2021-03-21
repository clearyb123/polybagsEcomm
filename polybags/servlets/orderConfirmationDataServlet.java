/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.polybags.servlets;

import com.google.gson.Gson;
import com.polybags.beans.LeadTime;
import com.polybags.beans.Order;
import com.polybags.utils.DBUtils;
import com.polybags.utils.MyUtils;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
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
@WebServlet(name = "orderConfirmationDataServlet", urlPatterns = {"/orderConfirmationData"})
public class orderConfirmationDataServlet extends HttpServlet {


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
            String basketId = "";
            try{
                for (Cookie cookie1 : cookies) {
                    if (cookie1.getName().equals("basketId")) {
                        basketId = cookie1.getValue();
                    }
                }
                Order order = DBUtils.queryOrder(conn, basketId);
                LeadTime leadtime = DBUtils.getLeadTime(conn, order.getLeadTime());

            String orderData = new Gson().toJson(order.getJSON());
            String leadtimeData = new Gson().toJson(leadtime);
            String orderArray = "["+orderData + "," + leadtimeData+"]";
            
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(orderArray);
            }catch(Exception e){
                e.printStackTrace();
            }
            

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
