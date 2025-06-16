package com.partner.coupons.service;

import com.partner.coupons.dto.*;
import com.partner.coupons.entity.Partner;
import com.partner.coupons.entity.StateYN;
import com.partner.coupons.repository.PartnerRepository;
import com.partner.coupons.repository.PartnerRepositoryCustom;
import com.partner.coupons.util.JwtUtil;
import com.partner.coupons.util.Constants;
import com.partner.coupons.util.PasswordUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.AbstractMap;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final PartnerRepository partnerRepository;
    private final PartnerRepositoryCustom partnerRepositoryCustom;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    //사업자 가입
    public Mono<String> signup(Partner partner) {
        return Mono.fromCallable(() -> {
            Optional<Partner> existsPartner = partnerRepositoryCustom.findByPartnerId(partner.getPartnerId());
            if (existsPartner.isEmpty()) {
                partner.setPartnerPassword(passwordEncoder.encode(partner.getPartnerPassword()));
                partnerRepository.save(partner);
            }else{
                throw new IllegalArgumentException("이미 존재하는 사업자입니다.");
            }
            return "ok";
        });
    }


    //사업자 아이디 사용가능 여부
    public Mono<Integer> partnerIsnt(String partnerId) {
        return Mono.fromCallable(() -> {
            Optional<Partner> existsPartner = partnerRepositoryCustom.findByPartnerId(partnerId);
            if (!existsPartner.isEmpty()) {
                throw new RuntimeException("이미 존재하는 사업자 아이디 입니다.");
            }
            return 0;
        });
    }



    //사업자 로그인
    public Mono<AuthResponse> partnerLogin(LoginRequest request) {
        return Mono.fromCallable(() -> {
            //해당 아이디가 로그인 가능여부(탈퇴요청상태인 데이타 로그인 불능)
            Partner partner = partnerRepositoryCustom.findByPartnerIdIsStateY(request.username())
                    .orElseThrow(() -> new RuntimeException("로그인 정보가 올바르지 않습니다.")); //사업자를 찾을 수 없습니다.

            if (!passwordEncoder.matches(request.password(), partner.getPartnerPassword())) {
                throw new RuntimeException("로그인 정보가 올바르지 않습니다."); //비밀번호가 일치하지 않습니다.
            }
            //토큰생성/Refresh 토큰생성/로그인한 파트너정보
            return new AuthResponse(
                      jwtUtil.generateToken(request.username(),"token",Constants._PartnerRollName)
                    , jwtUtil.generateToken(request.username(),"refreshToken",Constants._PartnerRollName)
                    , partner
            );
        });
    }
    //관리자 로그인
    public Mono<AuthAdminResponse> adminLogin(LoginRequest request) {
        return Mono.fromCallable(() -> {

            if (request.username().equals(Constants._AdminID) && request.password().equals(Constants._AdminPW)) {}
            else throw new RuntimeException("로그인 정보가 올바르지 않습니다.");

            //토큰생성/Refresh 토큰생성
            return new AuthAdminResponse(
                    jwtUtil.generateToken(request.username(),"token",Constants._AdminRollName)
                    , jwtUtil.generateToken(request.username(),"refreshToken",Constants._AdminRollName)
                    , request.username()
            );
        });
    }
    //사업자,관리자 새토큰 받기
    public Mono<String> newToken(String refreshToken) {
        return Mono.fromCallable(() -> {

            // refresh토큰에서 아이디 추출과 유효기간 체크(사업자,관리자)
            String username = jwtUtil.validateAndExtractUsername(refreshToken);
            if (username == null) {
                throw new RuntimeException("토큰이 유효하지 않습니다."); //아이디 정보 없을경우
            }
            //refresh토큰정보로 role 정보 받아옴
            String roleType = jwtUtil.getRoleType(refreshToken);
            return new AbstractMap.SimpleEntry<>(username, roleType);
        })
        .flatMap(entry -> {
            String username = entry.getKey();
            String roleType = entry.getValue();

            //role정보가 사업자일경우만 아이디 검색후 토큰생성 RETURN
            if (Constants._PartnerRollName.equals(roleType)) {
                Optional<Partner> existsPartner = partnerRepositoryCustom.findByPartnerId(username);
                if (existsPartner.isEmpty()) {
                    throw new RuntimeException("사용자를 찾을 수 없습니다.");
                }
            }
            //role정보가 관리자일경우 토큰 생성후 생성된 토큰 return함
            return Mono.just(jwtUtil.generateToken(username, "token", roleType));
        });
    }


    //비밀번호 재발급 (이메일 매칭을 하고 비밀번호를 변경후 정보를 돌려보냄)
    //사업자 수정
    public Mono<Partner> emailFindPwdUpdate(String email) {
        // partner 존재여부
        Optional<Partner> existsPartner = partnerRepositoryCustom.findByPartnerEmail(email);
        if (existsPartner.isEmpty()) {
            throw new IllegalArgumentException("일치하는 사업자정보가 없습니다.");
        }

        // 1. 임시 비밀번호 생성
        String tempPwd = PasswordUtil.generateTemporaryPassword(); // 임의의 비밀번호 생성 유틸

        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        System.err.println("현재 시간: " + now.format(formatter));
        System.err.println("pw = " + tempPwd);


        // 2. partner Entity 생성
        Partner tmpPartner = existsPartner.get();
        Partner partner = new Partner();
        partner.setPartnerName(tmpPartner.getPartnerName());
        partner.setPartnerId(tmpPartner.getPartnerId());
        partner.setPartnerPassword(passwordEncoder.encode(tempPwd));
        partner.setPartnerType(tmpPartner.getPartnerType());
        partner.setBusinessRegistrationNo(tmpPartner.getBusinessRegistrationNo());
        partner.setPhone(tmpPartner.getPhone());
        partner.setEmail(tmpPartner.getEmail());
        partner.setBusinessType(tmpPartner.getBusinessType());
        partner.setRegion(tmpPartner.getRegion());
        partner.setAddress(tmpPartner.getAddress());
        partner.setAddressDetail(tmpPartner.getAddressDetail());
        partner.setPostalCode(tmpPartner.getPostalCode());

        // 3. 파트너 수정호출(임시 비밀번호 저장)
        String id = partnerRepositoryCustom.updatePartner(partner);
        //System.out.println("id = " + id);
        //System.out.println("pw = " + tempPwd);
        //System.out.println("pw = " + passwordEncoder.encode(tempPwd));

        // 4. 응답 객체에 임시 비밀번호 포함 (암호화 안된 데이타)
        partner.setPartnerPassword(tempPwd);

        return Mono.fromCallable(() -> {
            return partner;
        });
    }

}