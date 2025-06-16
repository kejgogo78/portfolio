package com.partner.coupons.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import reactor.core.publisher.Mono;
import org.springframework.security.access.AccessDeniedException;

public class SecurityUtil {

    //현재 파트너 아이디를 가져오기
    public static Mono<String> getCurrentPartnerId() {

        return ReactiveSecurityContextHolder.getContext()
                .map(context -> {

                    Authentication auth = context.getAuthentication();
                    String role = auth.getAuthorities().iterator().next().getAuthority();

                    //System.err.println(role);

                    if (role.equals(Constants._PartnerRollName)) {
                        System.err.println("사업자일경우 partnerId 반환 : " + auth.getName());
                        return auth.getName(); // 사업자일경우 partnerId 반환
                    } else {
                        System.err.println("관리자일경우 빈값을 보냄");
                        return ""; // 관리자일경우 빈값을 보냄
                    }
                    /*
                    if (!"PARTNER".equals(role)) {
                        throw new AccessDeniedException("파트너 권한이 필요합니다.");
                    }*/
                });
    }
}
