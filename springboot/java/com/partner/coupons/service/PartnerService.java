package com.partner.coupons.service;

import com.partner.coupons.dto.*;
import com.partner.coupons.entity.Partner;
import com.partner.coupons.entity.StateYN;
import com.partner.coupons.repository.PartnerRepository;
import com.partner.coupons.repository.PartnerRepositoryCustom;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PartnerService {

    private final PartnerRepository partnerRepository;
    private final PartnerRepositoryCustom partnerRepositoryCustom;
    private final PasswordEncoder passwordEncoder;

    //관리자용 사업자 생성
    public Mono<String> partnerCreate(PartnerRequest request) {

        return Mono.fromCallable(() -> {

            // partner 존재여부
            Optional<Partner> existsPartner = partnerRepositoryCustom.findByPartnerId(request.getPartnerId());
            if (!existsPartner.isEmpty()) {
                throw new IllegalArgumentException("이미 존재하는 파트너가 있습니다.");
            }
            // partner Entity 생성
            Partner partner = new Partner();
            partner.setPartnerName(request.getPartnerName());
            partner.setPartnerId(request.getPartnerId());
            partner.setPartnerPassword(passwordEncoder.encode(request.getPartnerPassword()));
            partner.setPartnerType(request.getPartnerType());
            partner.setBusinessRegistrationNo(request.getBusinessRegistrationNo());
            partner.setPhone(request.getPhone());
            partner.setEmail(request.getEmail());
            partner.setBusinessType(request.getBusinessType());
            partner.setRegion(request.getRegion());
            partner.setAddress(request.getAddress());
            partner.setAddressDetail(request.getAddressDetail());
            partner.setPostalCode(request.getPostalCode());
            //insert 호출
            partnerRepositoryCustom.insertPartner(partner);
            return "ok";
        });
    }

    //사업자 수정
    public Mono<String> partnerModify(PartnerRequest request) {
        // partner 존재여부
        Optional<Partner> existsPartner = partnerRepositoryCustom.findByPartnerId(request.getPartnerId());
        if (existsPartner.isEmpty()) {
            throw new IllegalArgumentException("수정할 사업자정보가 없습니다.");
        }

        // partner Entity 생성
        Partner partner = new Partner();
        partner.setPartnerName(request.getPartnerName());
        partner.setPartnerId(request.getPartnerId());

        //비밀번호값이 있을때만
        if(!request.getPartnerPassword().equals(null) && !request.getPartnerPassword().equals("")) {
            partner.setPartnerPassword(passwordEncoder.encode(request.getPartnerPassword()));
        }else partner.setPartnerPassword(""); //공백처리

        partner.setPartnerType(request.getPartnerType());
        partner.setBusinessRegistrationNo(request.getBusinessRegistrationNo());
        partner.setPhone(request.getPhone());
        partner.setEmail(request.getEmail());
        partner.setBusinessType(request.getBusinessType());
        partner.setRegion(request.getRegion());
        partner.setAddress(request.getAddress());
        partner.setAddressDetail(request.getAddressDetail());
        partner.setPostalCode(request.getPostalCode());

        //파트너 수정호출
        return Mono.fromCallable(() -> {
            partnerRepositoryCustom.updatePartner(partner);
            return "ok";
        });
    }


    //사업자 목록
    public Mono<List<Partner>> partnerIds() {
        return Mono.fromCallable(() -> {
            return partnerRepository.findByIsState(StateYN.Y);
        });
    }


    //searchRequest : String name, String startDate, String endDate, String sort, int page, int pageSize
    //사업자 검색 목록
    public Mono<Page<PartnerResponse>> list(SearchListRequest request) {
        return Mono.fromCallable(() -> {

            /*
            Sort sorting = switch (searchRequest.sort()) {
                case "latest" -> Sort.by(Sort.Direction.DESC, "createdAt");
                case "oldest" -> Sort.by(Sort.Direction.ASC, "createdAt");
                case "name" -> Sort.by(Sort.Direction.ASC, "couponName");
                default -> Sort.by(Sort.Direction.DESC, "createdAt");
            };
            */
            Sort sorting = Sort.by(Sort.Direction.DESC, "createdAt");
            Pageable pageable = PageRequest.of(request.getPage()-1, request.getPageSize(), sorting);
            return partnerRepositoryCustom.searchPartners(request, pageable);
        });
    }

    //사업자 엑셀용 목록
    public Mono<List<PartnerResponse>> listExcel(SearchListRequest request) {
        return Mono.fromCallable(() -> {
            return partnerRepositoryCustom.searchPartnersForExcel(request);
        });
    }

    //사업자 상세정보
    public Mono<PartnerResponse> view(String partnerId) {
        return Mono.fromCallable(() -> {
            return partnerRepositoryCustom.PartnerDetail(partnerId);
        });
    }

    //사업자 삭제
    public Mono<Boolean> deletePartner(String partnerId) {
        return Mono.fromCallable(() -> {
            return partnerRepositoryCustom.deletePartner(partnerId);
        });
    }

    //사업자 탈퇴요청
    public Mono<Boolean> deleteRequestPartner(String partnerId) {
        return Mono.fromCallable(() -> {
            return partnerRepositoryCustom.deleteRequestPartner(partnerId);
        });
    }

    //사업자들 탈퇴요청
    public Mono<Boolean> deleteRequestPartners(String partnerIds) {
        return Mono.fromCallable(() -> {
            return partnerRepositoryCustom.deleteRequestPartners(partnerIds);
        });
    }
}