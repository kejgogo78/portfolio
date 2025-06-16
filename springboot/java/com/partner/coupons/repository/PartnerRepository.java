package com.partner.coupons.repository;

import com.partner.coupons.entity.Partner;
import com.partner.coupons.entity.StateYN;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PartnerRepository extends JpaRepository<Partner, Long> {
    List<Partner> findByIsState(StateYN isState); // isState = Y 조건

    // Mono<Long> deleteByIsStateAndDeletedAtBefore(StateYN isState, LocalDateTime deletedAt);
    //Mono<Long>을 반환하며 삭제된 row 수를 의미
    //Before는 "미만" 조건 //deletedAt < 2025-03-15T00:00:00를 의미
    Long deleteByIsStateAndDeletedAtBefore(StateYN isState, LocalDateTime deletedAt);
}