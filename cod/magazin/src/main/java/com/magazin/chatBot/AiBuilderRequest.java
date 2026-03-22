package com.magazin.chatBot;

import java.util.List;

public class AiBuilderRequest {

    private String message;
    private List<AiChatMessage> history;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<AiChatMessage> getHistory() {
        return history;
    }

    public void setHistory(List<AiChatMessage> history) {
        this.history = history;
    }
}