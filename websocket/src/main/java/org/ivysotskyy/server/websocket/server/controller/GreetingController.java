package org.ivysotskyy.server.websocket.server.controller;

import org.ivysotskyy.server.websocket.model.message.GreetingMessage;
import org.ivysotskyy.server.websocket.model.message.UserMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import java.util.logging.Logger;

@Controller
public class GreetingController {

    Logger logger = Logger.getLogger("GreetingController");

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public GreetingMessage greeting(UserMessage message) throws InterruptedException {
        logger.info("connected");
        logger.info("User: " + HtmlUtils.htmlEscape(message.getContent())  + " connected");
        return new GreetingMessage("Hello, " + HtmlUtils.htmlEscape(message.getContent()) + "!");
    }

}
