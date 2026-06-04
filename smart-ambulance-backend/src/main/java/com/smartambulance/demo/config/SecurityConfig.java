package com.smartambulance.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.smartambulance.demo.config.jwt.JwtAuthFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    configuration.addAllowedOrigin("http://localhost:5173");
    configuration.addAllowedHeader("*");
    configuration.addAllowedMethod("*");

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);

    return source;
}

    @Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

    http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

                    // PUBLIC
                    .requestMatchers("/api/users/register", "/api/users/login").permitAll()
                    .requestMatchers("/api/ambulance/register", "/api/ambulance/login").permitAll()
                    .requestMatchers("/api/hospital/register", "/api/hospital/login").permitAll()

                    // USER
                    .requestMatchers("/api/emergency/create").hasRole("USER")

                    // AMBULANCE
                    .requestMatchers("/api/emergency/pending").hasRole("AMBULANCE")
                    .requestMatchers("/api/emergency/active").hasRole("AMBULANCE") 
                    .requestMatchers("/api/emergency/assign/**").hasRole("AMBULANCE")
                    .requestMatchers("/api/emergency/*/pickup").hasRole("AMBULANCE")
                    .requestMatchers("/api/emergency/*/drop").hasRole("AMBULANCE")
                    .requestMatchers("/api/emergency/*/complete").hasRole("AMBULANCE")
                    .requestMatchers("/api/hospital/completed").hasRole("HOSPITAL")
                    .requestMatchers("/api/hospital/emergencies").hasRole("HOSPITAL")
                    // EVERYTHING ELSE
                    .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
            
    return http.build();
}
}
