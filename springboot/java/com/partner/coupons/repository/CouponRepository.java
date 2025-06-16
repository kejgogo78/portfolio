package com.partner.coupons.repository;

import com.partner.coupons.entity.Coupon;
import com.partner.coupons.entity.Partner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

import java.util.Optional;

import static com.partner.coupons.entity.QCoupon.coupon;

public interface CouponRepository extends JpaRepository<Coupon, Long> {
}