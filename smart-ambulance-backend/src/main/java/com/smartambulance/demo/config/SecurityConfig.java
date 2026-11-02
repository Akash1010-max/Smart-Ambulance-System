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

        // Allow all local dev origins (localhost, 127.0.0.1 on any port)
        configuration.addAllowedOriginPattern("*");
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // PUBLIC
                        .requestMatchers("/api/users/register", "/api/users/login").permitAll()
                        .requestMatchers("/api/ambulance/login").permitAll()
                        .requestMatchers("/api/hospital/login").permitAll()
                        .requestMatchers("/api/admin/login").permitAll()
                        .requestMatchers("/api/ambulance/register", "/api/hospital/register").permitAll()
                        .requestMatchers("/api/ambulance/id/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()

                        // ADMIN ONLY
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // USER
                        .requestMatchers("/api/emergency/create", "/api/emergency/my-active").hasRole("USER")
                        .requestMatchers("/api/emergency/*/cancel").hasAnyRole("USER", "ADMIN")

                        // AMBULANCE
                        .requestMatchers("/api/emergency/pending").hasAnyRole("AMBULANCE", "ADMIN")
                        .requestMatchers("/api/emergency/active").hasAnyRole("AMBULANCE", "ADMIN")
                        .requestMatchers("/api/emergency/assign/**").hasRole("AMBULANCE")
                        .requestMatchers("/api/emergency/*/pickup").hasRole("AMBULANCE")
                        .requestMatchers("/api/emergency/*/drop").hasRole("AMBULANCE")
                        .requestMatchers("/api/emergency/*/complete").hasRole("AMBULANCE")
                        .requestMatchers("/api/ambulance/location/**").hasRole("AMBULANCE")

                        // HOSPITAL
                        .requestMatchers("/api/hospital/completed").hasAnyRole("HOSPITAL", "ADMIN")
                        .requestMatchers("/api/hospital/emergencies").hasAnyRole("HOSPITAL", "ADMIN")

                        // EVERYTHING ELSE
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
