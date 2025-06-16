package com.partner.coupons.controller;

import com.partner.coupons.dto.*;
import com.partner.coupons.entity.Partner;
import com.partner.coupons.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    //사업자 가입
    @PostMapping("/partner")
    public Mono<ResponseEntity<Object>> signup(@RequestBody Partner partner) {
        System.out.println("partner = " + partner);
        return authService.signup(partner)
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }

    //사업자아이디 존재여부
    @GetMapping("/partner/isnt/{partnerId}")
    public Mono<ResponseEntity<Object>> partnerIsnt(@PathVariable String partnerId) {
        return authService.partnerIsnt(partnerId)
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }

    //사업자아이디 로그인
    @PostMapping("/partner/login")
    public Mono<ResponseEntity<Object>> partnerLogin(@RequestBody LoginRequest request) {
        System.out.println("LoginRequest = " + request);

        return authService.partnerLogin(request)
                .map(authResponse -> ResponseEntity.ok().body((Object) authResponse))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }
    //관리자아이디 로그인
    @PostMapping("/admin/login")
    public Mono<ResponseEntity<Object>> adminLogin(@RequestBody LoginRequest request) {
        System.out.println("LoginRequest = " + request);

        return authService.adminLogin(request)
                .map(authResponse -> ResponseEntity.ok().body((Object) authResponse))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }

    //사업자,관리자 새토큰 받기
    @PostMapping("/newToken")
    public Mono<ResponseEntity<Map<String, String>>> newToken(@RequestHeader("Authorization") String refreshToken) {
        String requestToken = refreshToken.replace("Bearer ", "").trim();
        System.out.println("받은 리프레시 토큰 = " + requestToken);

        return authService.newToken(requestToken)
                .doOnNext(token -> System.out.println("발급된 새 액세스 토큰 = " + token))
                .map(token -> ResponseEntity.ok().body(Map.of("accessToken", token)))
                .onErrorResume(e -> {
                    System.err.println("토큰 재발급 오류: " + e.getMessage());
                    return Mono.just(ResponseEntity.badRequest().body(Map.of("error", e.getMessage())));
        });
    }

    //비밀번호 재발급 (이메일 매칭을 하고 비밀번호를 변경후 정보를 돌려보냄)
    @GetMapping("/partner/emailfindpwdupdate/{email}")
    public Mono<ResponseEntity<Object>> emailFindPwdUpdate(@PathVariable String email) {
        return authService.emailFindPwdUpdate(email)
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }



}