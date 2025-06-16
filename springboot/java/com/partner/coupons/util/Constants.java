package com.partner.coupons.util;

public interface Constants {
    //ROLE 정보(토큰에 넣는값)
    public static final String _AdminRollName = "ROLE_ADMIN"; //관리자
    public static final String _PartnerRollName = "ROLE_PARTNER"; //파트너
    public static final String _MemberRollName = "ROLE_MEMBER"; //사용자(고객)

    //ROLE 정보(SecurityConfig.java)
    public static final String _AdminRoll = "ADMIN"; //관리자
    public static final String _PartnerRoll = "PARTNER"; //파트너
    public static final String _MemberRoll = "MEMBER"; //사용자(고객)

    //관리자정보(AuthService.java - adminLogin())
    public static final String _AdminID = "admin"; //관리자아이디
    public static final String _AdminPW = "1111"; //관리자비밀번호
}