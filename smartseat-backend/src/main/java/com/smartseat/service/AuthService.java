package com.smartseat.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.smartseat.dto.AuthResponse;
import com.smartseat.dto.LoginRequest;
import com.smartseat.dto.RegisterRequest;
import com.smartseat.entity.User;
import com.smartseat.repository.UserRepository;
import com.smartseat.security.JwtService;

@Service
public class AuthService {
    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtService jwt;


    public AuthService(UserRepository repo,PasswordEncoder encoder,JwtService jwt) {
        this.repo = repo;
        this.encoder = encoder;
        this.jwt = jwt;
    }
    public void register(RegisterRequest request){
        if(repo.existsByEmail(request.getEmail())){
            throw new RuntimeException("USER EXITS");

        }
        User user = User.builder()
                .email(request.getEmail())
                .password(encoder.encode(request.getPassword()))
                .name(request.getName())
                .role("USER")
                .build();
        repo.save(user);


    }
    public AuthResponse login(LoginRequest request){
        User user = repo.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));
        if(!encoder.matches(request.getPassword(),user.getPassword())){
            throw new RuntimeException("Invalid email or password");
        }
        String token = jwt.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getRole());
    }
}
