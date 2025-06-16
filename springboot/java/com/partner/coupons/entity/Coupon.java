package com.partner.coupons.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "coupons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate //변경사항이 있는 것만
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id; //쿠폰고유번호

    @ManyToOne
    @JoinColumn(name = "partner_id", referencedColumnName = "partner_id")
    private Partner partner; //사업자아이디

    @Column(name = "coupon_name", nullable = false)
    private String couponName; //쿠폰명

    private Integer discountRate; //할인율

    private Integer templateType; //템플릿타입

    private String usageStartDate; //사용 시작일
    private String usageEndDate;   //사용 마지막일 

    private String issueStartDate; //발급 시작일
    private String issueEndDate;   //발급 마지막일

    @Lob
    private String benefitDescription; //혜택

    @Enumerated(EnumType.STRING)
    private CouponIsUsable isUsable; //쿠폰사용여부(USABLE,NOT_USABLE)

    private LocalDateTime createdAt; //등록일
    private LocalDateTime updatedAt; //수정일

    //발급일
    private String issueDate;   //발급일-사용안함

    //발급여부
    @Enumerated(EnumType.STRING)
    private StateYN isIssue; //발급여부 - 사용안함

    private Long downloadCnt; //다운로드수
    
    @OneToMany(mappedBy = "coupon", cascade = CascadeType.ALL)
    private List<CouponProduct> couponProducts = new ArrayList<>();

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.downloadCnt = 0L ; //다운로드수 초기값:0
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
