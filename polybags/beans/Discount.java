/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.polybags.beans;

/**
 *
 * @author bencleary
 */
public class Discount {
    private int discount, productId, per, id;
    
    public Discount(){
    
    }
    
    public Discount(int discount, int productId, int per, int id){
        this.discount = discount;
        this.productId = productId;
        this.per = per;
    }
    
    public int getId(){
        return this.id;
    }
    
    public int getDiscount(){
        return this.discount;
    }
    
    public int getProductId(){
        return this.productId;
    }
    
    public int getPerDiscount(){
        return this.per;
    }
    
    public void setDiscount(int discount){
         this.discount = discount;
    }
    
    public void setProductId(int productId){
        this.productId = productId;
    }
    
    public void setPerDiscount(int per){
        this.per = per;
    }
    
    public void setId(int id){
        this.id = id;
    }
}
