package com.journaltracker.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController()
@RequestMapping("/api/auth")
public class AuthController {
    @PostMapping("/login")
    public String login() { return "dm"; }
    @PostMapping("/register")
    public String register() {
        return "helloooo";
    }
}
