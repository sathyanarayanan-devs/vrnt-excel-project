package com.example.Vrnt.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomepageControler
{
@RequestMapping("/")
    public String homepage()
{
    return "index.html";
}

}
