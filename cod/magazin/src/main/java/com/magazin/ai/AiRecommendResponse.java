package com.magazin.ai;

import java.util.List;

public class AiRecommendResponse {

    private List<AiPick> picks;
    private String note;

    public List<AiPick> getPicks() {
        return picks;
    }

    public void setPicks(List<AiPick> picks) {
        this.picks = picks;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}