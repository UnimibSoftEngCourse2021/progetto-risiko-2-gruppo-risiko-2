package com.webapp.drisk.controller;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.webapp.drisk.model.User;
import com.webapp.drisk.service.UserService;

@Controller
public class LoginController {

    @Autowired
    private UserService userService;
        
    
    @RequestMapping(value={"", "/", "/home"})
    public String home() 
    {
    	return "home";
    }
    

    
    
    @RequestMapping(value="/login", method = RequestMethod.GET)
    public ModelAndView login(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("login");
        return modelAndView;
    }
    
    @RequestMapping(value="/login", method = RequestMethod.POST)
    public ModelAndView auth(@RequestParam String user_name, @RequestParam String password, HttpServletRequest richiesta){
    	
    	
    	User user = userService.findUserByUserName(user_name);
    	boolean checkPassword =  BCrypt.checkpw(password, user.getPassword());
    	if(user != null) 
    	{
    		if(checkPassword) 
    		{
    			richiesta.getSession().setAttribute("user_name", user.getUserName());
    			ModelAndView modelAndView = new ModelAndView();
    	        modelAndView.addObject("session", richiesta);
    	        modelAndView.setViewName("home");
    	        return modelAndView;
    		}
    	}
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("login?error=true");
        return modelAndView;
    }
    
    @RequestMapping(value="/logout", method = RequestMethod.GET)
    public ModelAndView logout(HttpServletRequest richiesta){
    	richiesta.getSession().invalidate();
    	ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("home");
        return modelAndView;
    }
   
    
    

    @RequestMapping(value="/registration", method = RequestMethod.GET)
    public ModelAndView registration(){
        ModelAndView modelAndView = new ModelAndView();
        User user = new User();
        modelAndView.addObject("user", user);
        modelAndView.setViewName("registration");
        return modelAndView;
    }

    @RequestMapping(value = "/registration", method = RequestMethod.POST)
    public ModelAndView createNewUser(@Valid User user, BindingResult bindingResult) {
        ModelAndView modelAndView = new ModelAndView();
        User userExists = userService.findUserByUserName(user.getUserName());
        if (userExists != null) {
            bindingResult
                    .rejectValue("userName", "error.user",
                            "Esiste già un utente con questo username!");
        }
        if (bindingResult.hasErrors()) {
            modelAndView.setViewName("registration");
        } else {
            userService.saveUser(user);
            modelAndView.addObject("successMessage", "Sei stato registrato con successo!");
            modelAndView.addObject("user", new User());
            modelAndView.setViewName("registration");

        }
        return modelAndView;
    }

    /*@RequestMapping(value="/home", method = RequestMethod.GET)
    public ModelAndView home(){
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        modelAndView.addObject("userName", "Welcome " + user.getUserName() + "/"  + " (" + user.getEmail() + ")");
        modelAndView.addObject("adminMessage","Content Available Only for Users with Admin Role");
        modelAndView.setViewName("home");
        return modelAndView;
    }*/


}