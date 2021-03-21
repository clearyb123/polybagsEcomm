package com.polybags.utils;
 
import com.polybags.beans.Discount;
import com.polybags.beans.Order;
import com.polybags.beans.Product;
import java.sql.Connection;
 
import javax.servlet.ServletRequest;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
 
import com.polybags.beans.UserAccount;
import com.squareup.square.SquareClient;
import com.squareup.square.api.PaymentsApi;
import com.squareup.square.exceptions.ApiException;
import com.squareup.square.models.CreatePaymentRequest;
import com.squareup.square.models.CreatePaymentResponse;
import com.squareup.square.models.Money;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Random;
import java.util.UUID;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
 
public class MyUtils {
 
    public static final String ATT_NAME_CONNECTION = "ATTRIBUTE_FOR_CONNECTION";
    private static final String ATT_NAME_USER_NAME = "ATTRIBUTE_FOR_STORE_USER_NAME_IN_COOKIE";
 
    // Store Connection in request attribute.
    // (Information stored only exist during requests)
    public static void storeConnection(ServletRequest request, Connection conn) {
        request.setAttribute(ATT_NAME_CONNECTION, conn);
    }
 
    // Get the Connection object has been stored in attribute of the request.
    public static Connection getStoredConnection(ServletRequest request) {
        Connection conn = (Connection) request.getAttribute(ATT_NAME_CONNECTION);
        return conn;
    }
 
    // Store user info in Session.
    public static void storeLoginedUser(HttpSession session, UserAccount loginedUser) {
        // On the JSP can access via ${loginedUser}
        session.setAttribute("loginedUser", loginedUser);
    }
 
    // Get the user information stored in the session.
    public static UserAccount getLoginedUser(HttpSession session) {
        UserAccount loginedUser = (UserAccount) session.getAttribute("loginedUser");
        return loginedUser;
    }
 
    // Store info in Cookie
    public static void storeUserCookie(HttpServletResponse response, UserAccount user) {
        System.out.println("Store user cookie");
        Cookie cookieUserName = new Cookie(ATT_NAME_USER_NAME, user.getUserName());
        // 1 day (Converted to seconds)
        cookieUserName.setMaxAge(24 * 60 * 60);
        response.addCookie(cookieUserName);
    }
    
    public static Cookie getCookie(HttpServletRequest request, String name) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie.getName().equals(name)) {
                    return cookie;
                }
            }
        }

        return null;
    }
 
    public static String getUserNameInCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (ATT_NAME_USER_NAME.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
 
    // Delete cookie.
    public static void deleteUserCookie(HttpServletResponse response) {
        Cookie cookieUserName = new Cookie(ATT_NAME_USER_NAME, null);
        // 0 seconds (This cookie will expire immediately)
        cookieUserName.setMaxAge(0);
        response.addCookie(cookieUserName);
    }
    
    public static String generateBasketId(Connection conn){
        int basketIdInt = 0;
        try{
             basketIdInt = DBUtils.generateBasketIdNumber(conn);
        }catch(Exception e){
            e.printStackTrace();
        }
        int leftLimit = 97; // letter 'a'
        int rightLimit = 122; // letter 'z'
        int targetStringLength = 5;
        Random random = new Random();
        StringBuilder buffer = new StringBuilder(targetStringLength);
        for (int i = 0; i < targetStringLength; i++) {
            int randomLimitedInt = leftLimit + (int) 
              (random.nextFloat() * (rightLimit - leftLimit + 1));
            buffer.append((char) randomLimitedInt);
        }
        String generatedString = buffer.toString();


        String basketId = generatedString + "-" + (basketIdInt + 1) + "";
       
        return basketId;
   }
    
        public static Map<String, Object> charge(Connection conn, String nonce, Long amount, String currency, SquareClient squareClient) throws ApiException, IOException {
        // To learn more about splitting payments with additional recipients,
        // see the Payments API documentation on our [developer site]
        // (https://developer.squareup.com/docs/payments-api/overview).
        Map<String, Object> model  = new HashMap<>();
        Integer responseStatus = 0;
        String orderNo= "";
        try{
            orderNo =   DBUtils.generatePurchaseOrderIdNumber(conn);
        }catch(Exception e){
            e.printStackTrace();
        }
        Money bodyAmountMoney = new Money.Builder()
            .amount(amount)
            .currency(currency)
            .build();
        CreatePaymentRequest createPaymentRequest = new CreatePaymentRequest.Builder(
                nonce,
                UUID.randomUUID().toString(),
                bodyAmountMoney)
            .autocomplete(true)
            .note("Order No: " + orderNo)
            .build();

        PaymentsApi paymentsApi = squareClient.getPaymentsApi();

        try{
            CreatePaymentResponse response = paymentsApi.createPayment(createPaymentRequest);
            model.put("payment", response.getPayment());
            responseStatus = 200;
            model.put("response", responseStatus);
            model.put("orderNo", orderNo);
            return model;
        } catch (ApiException except) {
            responseStatus = 500;

            com.squareup.square.models.Error error = except.getErrors().get(0);
            model.put("error", except.getErrors().get(0));
            model.put("response", responseStatus);
            
            return model;
        }
    }
        
    public static void sendEmail(Order order)throws MessagingException{
      String to = order.getEmail();//change accordingly  
      String from = "benjackcleary27@gmail.com"; 
      String host = "localhost:8080";//or IP address  
  
     //Get the session object  
      Properties properties = System.getProperties();  
      properties.setProperty("mail.smtp.host", host);  
      Session session = Session.getDefaultInstance(properties);  
  
     //compose the message  
      try{  
         MimeMessage message = new MimeMessage(session);  
         message.setFrom(new InternetAddress(from));  
         message.addRecipient(Message.RecipientType.TO,new InternetAddress(to));  
         message.setSubject("Ping");  
         message.setText("Hello, this is example of sending email  ");  
  
         // Send message  
         Transport.send(message);  
         System.out.println("message sent successfully....");  
  
      }catch (MessagingException mex) {mex.printStackTrace();} 
        
    }
    
    public static Map<String, BigDecimal> calculateProductTotals(Connection conn, List<Product> products, BigDecimal subtotal, BigDecimal total){
        Map<String, BigDecimal> totals = new HashMap<>();
        try{

            for(Product product : products){
                    subtotal = subtotal.add(product.calculateSubtotal());
                    total = total.add(product.calculateTotal(conn));
                    totals.put("subtotal", subtotal);
                    totals.put("total", total);
                }
        }catch(Exception e){
            e.printStackTrace();
        }
        
        return totals;        
    }
    
    public static int calculateOrderLeadTime(List<Product> products, int leadtime){
        
        for(Product product : products){
            if(leadtime > product.getLeadTime()){
               leadtime = product.getLeadTime();
            }
        }
                           
        return leadtime; 
    }
}