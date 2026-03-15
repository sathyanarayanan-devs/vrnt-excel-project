package com.example.Vrnt.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class forgetpwdController
{
    @RequestMapping(path="/forgetpwd")
    public String forgetpwd()
    {
        return "forgetpwd.html";
    }
}
