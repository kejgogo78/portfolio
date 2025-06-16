package com.partner.coupons.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDateTime;

@Entity
@Table(name = "partners")
@Data //@Getter, @Setter, @ToString
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate //변경사항이 있는 것만
public class Partner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //고유값

    @Column(name = "partner_name", nullable = false)
    private String partnerName; //상호명

    @Column(name = "partner_id", nullable = false, unique = true)
    private String partnerId; //아이디

    @Column(name = "partner_password", nullable = false)
    private String partnerPassword; //비밀번호

    private Integer partnerType; //(회원 종류: 일반(1) / 인플루언서(2))

    @Column(name = "business_registration_no", nullable = false)
    private String businessRegistrationNo; //사업자번호

    private String phone; //연락처
    private String email; //이메일
    private String businessType; //사업분야
    private String region; //지역
    private String address; //주소
    private String addressDetail; //상세주소
    private String postalCode; //우편번호

    private LocalDateTime createdAt; //가입일
    private LocalDateTime updatedAt; //수정일
    private LocalDateTime deletedAt; //탈퇴요청일

    @Column(name = "is_state", nullable = false)
    @Enumerated(EnumType.STRING)
    private StateYN isState; //현재상태(Y-회원, N-탈퇴처리)

    @PrePersist // insert시 동작 / 비영속 -> 영속
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.isState = StateYN.Y;
        //this.partnerType = 1;
        //this.loginFailCnt = 0;
    }

    @PreUpdate // update시 동작 / 비영속 -> 영속
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
