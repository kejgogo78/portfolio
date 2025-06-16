package com.partner.coupons.scheduler;

import com.partner.coupons.entity.StateYN;
import com.partner.coupons.repository.PartnerRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class PartnerCleanupScheduler {

    private final PartnerRepository partnerRepository;
    private final Logger log = LoggerFactory.getLogger(PartnerCleanupScheduler.class);

    //@Scheduled(cron = "0 03 23 * * *")
    // 매일 새벽 2시에 실행
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void deleteOldWithdrawnPartners() {

        LocalDateTime oneAgo = LocalDateTime.now().minusMinutes(1); //1분전
        //LocalDateTime oneAgo = LocalDateTime.now().minusHours(1); //1시간전
        //LocalDateTime oneAgo = LocalDateTime.now().minusMonths(1);
        //LocalDateTime oneAgo = LocalDateTime.now().minusMonths(1).plusDays(1);

        //삭제 제한 조건
        //사용가능한 날짜의 쿠폰이 존재하는 파트너는 제외 한다.
        //1. 쿠폰상품 삭제
        //2. 쿠폰상세정보 삭제
        //3. 파트너 삭제
        //한달전에 탈퇴요청된 데이타들 삭제 (상태값이N 이고 탈외요청된 deletedAt가 한달된 데이타)
        long deletedCount = partnerRepository.deleteByIsStateAndDeletedAtBefore(StateYN.N, oneAgo);
        //partnerRepositoryCoustom 으로 작업 하기 (수정 요망)
    }
}