package com.magazin.ai;

import java.util.List;

public class AiRecommendRequest {

    private List<Long> cartProductIds;
    private List<String> cartCategories;
    private List<String> cartProducers;

    public List<Long> getCartProductIds() {
        return cartProductIds;
    }

    public void setCartProductIds(List<Long> cartProductIds) {
        this.cartProductIds = cartProductIds;
    }

    public List<String> getCartCategories() {
        return cartCategories;
    }

    public void setCartCategories(List<String> cartCategories) {
        this.cartCategories = cartCategories;
    }

    public List<String> getCartProducers() {
        return cartProducers;
    }

    public void setCartProducers(List<String> cartProducers) {
        this.cartProducers = cartProducers;
    }
}