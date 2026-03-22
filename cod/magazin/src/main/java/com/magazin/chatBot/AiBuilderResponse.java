package com.magazin.chatBot;

import com.magazin.model.Produs;
import java.util.List;

public class AiBuilderResponse {

    private String reply;
    private List<Produs> produse;
    private String note;

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public List<Produs> getProduse() {
        return produse;
    }

    public void setProduse(List<Produs> produse) {
        this.produse = produse;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}