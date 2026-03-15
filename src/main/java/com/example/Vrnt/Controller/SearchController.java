package com.example.Vrnt.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

// ✅ Fixed: was @Component — must be @Controller to serve HTML pages
@Controller
public class SearchController {

    @RequestMapping(path = "/search")
    public String search() {
        return "search.html";
    }
}
