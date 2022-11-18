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
    @SendTo("/user")
    public String greeting(String user) throws InterruptedException {
        Thread.sleep(1000);
        logger.info("connected");
        logger.info("User: " + HtmlUtils.htmlEscape(user)  + " connected");
        return "Hello, " + HtmlUtils.htmlEscape(user) + "!";
    }

//    public GreetingMessage greeting(UserMessage user) throws InterruptedException {
//        Thread.sleep(1000);
//        //logger.info("User: " + user.getContent() + " connected");
//        return new GreetingMessage("Hello, " + HtmlUtils.htmlEscape(user.getContent()) + "!");
//    }

}
