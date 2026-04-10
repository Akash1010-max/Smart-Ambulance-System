package com.smartambulance.demo.service;

import com.smartambulance.demo.dto.UserRequestDTO;
import com.smartambulance.demo.dto.UserResponseDTO;
import com.smartambulance.demo.dto.AuthResponseDTO;

public interface UserService {

    UserResponseDTO register(UserRequestDTO dto);

    AuthResponseDTO login(String email, String password);

}
