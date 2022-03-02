package com.example.shuati.controller;

/**
 * UserController
 *
 * @author 勇敢的心
 * @since 2021-12-25 07:51:50
 */
import com.example.shuati.domain.User;
import com.example.shuati.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class bookController {

    @Autowired
    private UserService   userServiceservice;

    private static final Logger log = LoggerFactory.getLogger(UserController.class);
    


}
