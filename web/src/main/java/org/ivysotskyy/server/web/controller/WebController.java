package org.ivysotskyy.server.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


import java.util.logging.Logger;

@Controller
public class WebController {
    Logger logger = Logger.getLogger("WebController");

    @GetMapping("/user")
    public String index() {

        logger.info("Returning index.html");

        return "index.html";
    }

    @GetMapping("/greeting")
    public String greeting() {
        logger.info("greeting");
        return "greeting.html";
    }
}
