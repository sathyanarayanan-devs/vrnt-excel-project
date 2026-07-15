package com.example.Vrnt.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class loginPagecontroller {

    @GetMapping("/login")
    public String login() {
        return "redirect:/login.html";
    }

    @GetMapping("/register")
    public String register() {
        return "redirect:/register.html";
    }

    @GetMapping("/preview")
    public String preview() {
        return "redirect:/preview.html";
    }

    @GetMapping("/success")
    public String success() {
        return "redirect:/success.html";
    }
}
