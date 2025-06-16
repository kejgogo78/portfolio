package com.partner.coupons.config;

import com.partner.coupons.util.JWTVerificationException;
import com.partner.coupons.util.JwtUtil;
import com.partner.coupons.util.TokenExpiredException;
import org.modelmapper.internal.bytebuddy.implementation.bind.MethodDelegationBinder;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;
import reactor.netty.http.server.compression.ZstdOption;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JwtAuthenticationFilter implements WebFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {

        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        //System.out.println("토큰 : " + authHeader);

        //토큰이 있을경우 정보를 가져온다.
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String username = jwtUtil.validateAndExtractUsername(token); //파트너아이디,관리자아이디
                String role = jwtUtil.getRoleType(token); //role정보
                //System.out.println("토큰 in 아이디 = " + username + ", 토큰 in role = " + role);

                if (username != null && role != null) {
                    //사업자및 관리자 인증(SecurityConfig.java에서 체크하고 있음)
                    //if (role.equals(Constants._AdminRollName) || role.equals(Constants._PartnerRollName)) {
                        Authentication auth = new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                List.of(new SimpleGrantedAuthority(role))
                        );
                        //정상처리 로딩
                        return chain.filter(exchange)
                                .contextWrite(ReactiveSecurityContextHolder.withAuthentication(auth));
                    //} else {
                    //    return unauthorized(exchange, "허용되지 않은 권한입니다."); //401에러
                    //}
                } //unauthorized 인증실패에러전달
                return unauthorized(exchange, "유효하지 않은 토큰입니다."); //401에러

            // JWT가 만료되었을 경우
            } catch (TokenExpiredException e) {
                return unauthorized(exchange, "토큰이 만료되었습니다."); //401에러

            // 기타 JWT 오류
            } catch (JWTVerificationException e) {
                return unauthorized(exchange, "유효하지 않은 토큰입니다."); //401에러

            // 일반 예외 처리
            } catch (Exception e) {
                return unauthorized(exchange, "인증 처리 중 오류가 발생했습니다."); //401에러
            }
        }
        return chain.filter(exchange);
    }



    // 401 Unauthorized 리턴
    private Mono<Void> unauthorized(ServerWebExchange exchange, String message) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().set("Content-Type", "application/json; charset=UTF-8");

        // 요청 Origin 가져오기
        String origin = exchange.getRequest().getHeaders().getOrigin();

        // 허용할 Origin 목록
        List<String> allowedOrigins = List.of("http://localhost:3000", "http://111.111.111.111:3000");

        // 응답 헤더에 CORS 헤더 추가
        if (allowedOrigins.contains(origin)) {
            response.getHeaders().set("Access-Control-Allow-Origin", origin);
            response.getHeaders().set("Access-Control-Allow-Credentials", "true");
        }

        String jsonResponse = "{\"error\": \"" + message + "\"}";
        DataBuffer buffer = response.bufferFactory().wrap(jsonResponse.getBytes(StandardCharsets.UTF_8));

        return response.writeWith(Mono.just(buffer));
    }
}

