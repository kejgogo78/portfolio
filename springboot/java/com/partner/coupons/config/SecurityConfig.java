package com.partner.coupons.config;

import com.partner.coupons.util.JwtUtil;
import org.springframework.http.HttpMethod;
import com.partner.coupons.util.Constants;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.reactive.config.CorsRegistry;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    private final JwtUtil jwtUtil;

    public SecurityConfig(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public SecurityWebFilterChain securityFilterChain(ServerHttpSecurity http) {
        return http
                .cors().and()
                .csrf().disable() //CSRF 보안기능 끕니다.
                .httpBasic().disable()
                .formLogin().disable()
                .authorizeExchange()
                .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll() //hasRole 걸면 CORS preflight (OPTIONS) 때문에 토큰이 안 들어온다	OPTIONS 메소드를 permitAll 해줘야 한다
                .pathMatchers("/api/auth/**").permitAll() // 공개 경로 누구나 접근 가능
                .pathMatchers("/api/qrcode").permitAll() // qr코드생성
                .pathMatchers("/api/admin/**").hasRole(Constants._AdminRoll) // ADMIN만 접근
                .pathMatchers("/api/partner/**").hasRole(Constants._PartnerRoll) // PARTNER만 접근
                //.pathMatchers("/api/auth/partner/**","/api/auth/admin/**").permitAll() // 공개 경로 누구나 접근 가능
                //.pathMatchers("/api/admin/partner/**","/api/admin/coupon/**").hasRole(Constants._AdminRoll) // ADMIN만 접근
                //.pathMatchers("/api/partner/coupon/list").hasRole(Constants._PartnerRoll) // PARTNER만 접근
                //.pathMatchers("/api/partner/coupon/list").permitAll()
                .anyExchange().authenticated() // 나머지는 인증된 사용자만
                .and()
                .addFilterAt(jwtAuthenticationFilter(), SecurityWebFiltersOrder.AUTHENTICATION)
                .build();
    }


    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtUtil);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


}