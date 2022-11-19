package org.ivysotskyy.server.websocket.model.message;

// import org.springframework.messaging.Message;
import org.ivysotskyy.server.websocket.model.message.Message;

public class UserMessage implements Message {

    public String getUsername() {
        return username;
    }

    private String username;

    public UserMessage(String username) {
        this.username = username;
    }


    @Override
    public String getContent() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
