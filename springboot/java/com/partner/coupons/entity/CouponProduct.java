package com.partner.coupons.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicUpdate;

@Entity
@Table(name = "coupon_products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate //변경사항이 있는 것만
public class CouponProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "coupon_id")
    private Coupon coupon;

    private String productName;
}
