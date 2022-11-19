package org.ivysotskyy.server.websocket.model.message;

public class GreetingMessage implements Message {

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    private String message;

    public GreetingMessage(String message) {
        this.message = message;
    }

    @Override
    public String getContent() {
        return this.message;
    }
}
