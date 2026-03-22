package com.magazin.chatBot;

import java.util.List;

public class AiBuilderRawResponse {

    private String reply;
    private List<Long> productIds;
    private String note;

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public List<Long> getProductIds() {
        return productIds;
    }

    public void setProductIds(List<Long> productIds) {
        this.productIds = productIds;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}

// nu mai este folosit