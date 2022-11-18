package org.ivysotskyy.server.websocket.model.message;

public class GreetingMessage implements Message {

    private String message;

    public GreetingMessage(String message) {
        this.message = message;
    }

    @Override
    public String getContent() {
        return this.message;
    }
}
