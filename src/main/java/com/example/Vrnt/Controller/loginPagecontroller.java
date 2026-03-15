package com.example.Vrnt.Controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class loginPagecontroller {
    @RequestMapping(path = "/login")
    public String login()
    {
        return "login.html";
    }
}
