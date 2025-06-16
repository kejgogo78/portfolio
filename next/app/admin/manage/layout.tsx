'use client';

import Link from "next/link";
import { useEffect, useState, useRef } from 'react';
import { refreshAccessToken } from '@/lib/apis/common';
import { usePathname, useRouter } from 'next/navigation';
import { removeAdminTokensCookies } from '@/lib/adminAuth';
import AdminGuard from '@/components/AdminGuard';


import "../../css/datatables.bundle.css";

export default function AdminLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const router = useRouter();
    const pathname = usePathname();
    const boxRef = useRef<HTMLDivElement>(null); //박스위치
    const boxRef2 = useRef<HTMLDivElement>(null); //박스위치

    const [user, setUser] = useState<{ userId: string; roles: string } | null>(null);
    const [sidebar, setSidebar] = useState(true);
    const [menushow, setMenuShow] = useState(false);
    const [mobileMenuShow, setMobileMenuShow] = useState(false);
    const [mobileMenu2Show, setMobileMenu2Show] = useState(false);

    //admin/manage 대쉬보드| business 사업자회원관리 | coupon 쿠폰리스트 | coupon/add 쿠폰등록 | issuelist 쿠폰발급 리스트
    const [menus, setMenus] = useState([false, false, false, false, false]);

    //로그아웃
    const handleLogout = () => {
        removeAdminTokensCookies();
        setUser(null);
        window.location.href = '/admin/login';
    };

    useEffect(() => {
        //if (document.documentElement) {
        document.documentElement.setAttribute('data-bs-theme', 'light');
        //}
    }, []);

    //모바일에서 boxRef//boxRef2 영역이외 클릭시 박스 모두 없어짐
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                (boxRef.current && !boxRef.current.contains(event.target as Node))
                && (boxRef2.current && !boxRef2.current.contains(event.target as Node))
            ) {
                //*위치 : <div id="kt_app_sidebar" ref={boxRef} => 모바일시 외부화면 클릭시 메뉴박스 사라짐*/
                // alert('박스 외부를 클릭했습니다!'); 
                setMobileMenuShow(false)
                setMobileMenu2Show(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    //메뉴 볼드 처리 
    useEffect(() => {
        //사업자메뉴
        if (pathname?.includes("business")) {
            setMenus([false, true, false, false, false]);
        //쿠폰 메뉴
        } else if (pathname?.includes("coupon")) {
            setMenuShow(true);
            if (pathname.includes("add")) {
                setMenus([false, false, false, true, false]);
            } else if (pathname.includes("issuelist")) {
                setMenus([false, false, false, false, true]);
            } else {
                setMenus([false, false, true, false, false]);
            }
        } else { //pathname==="/admin/manage"
            setMenus([true, false, false, false, false]);
        }
        console.log("======================= pathname : " + pathname);
        console.log("======================= menus : " + menus);
    }, [pathname]);



    return (
        <AdminGuard>
            <body id="kt_app_body"
                data-kt-app-layout="dark-sidebar"
                data-kt-app-header-fixed="true"
                data-kt-app-sidebar-enabled="true"
                data-kt-app-sidebar-fixed="true"
                data-kt-app-sidebar-hoverable="true"
                data-kt-app-sidebar-push-header="true"
                data-kt-app-sidebar-push-toolbar="true"
                data-kt-app-sidebar-push-footer="true"
                data-kt-app-toolbar-enabled="true"
                {...(!sidebar ? { 'data-kt-app-sidebar-minimize': 'on' } : {})}

                className="app-default"
                data-kt-scrolltop="on"
            >
                <div className="d-flex flex-column flex-root app-root" id="kt_app_root">
                    <div className="app-page flex-column flex-column-fluid" id="kt_app_page">
                        <div id="kt_app_header" className="app-header">
                            <div className="app-container container-fluid d-flex align-items-stretch justify-content-between" id="kt_app_header_container">
                                <div className="d-flex align-items-center d-lg-none ms-n3 me-2" title="Show sidebar menu">
                                    <div id="kt_app_sidebar_mobile_toggle"
                                        onClick={() => {
                                            setMobileMenu2Show(false)
                                            setMobileMenuShow(true) //모바일에서 메뉴클릭시
                                        }}
                                        className={`btn btn-icon btn-active-color-primary w-35px h-35px ${mobileMenuShow ? 'active' : ''}`}
                                    >
                                        <i className="ki-duotone ki-abstract-14 fs-1">
                                            <span className="path1"></span>
                                            <span className="path2"></span>
                                        </i>
                                    </div>
                                </div>
                                {
                                    /*<div className="d-flex align-items-center flex-grow-1 flex-lg-grow-0">
                                        <a href="/admin/manage" className="d-lg-none">
                                            <img alt="Logo" src="assets/media/logos/default-small.svg" className="theme-light-show h-30px" />
                                            <img alt="Logo" src="assets/media/logos/default-small-dark.svg" className="theme-dark-show h-30px" />
                                        </a>
                                    </div>*/
                                }
                                <div className="d-flex align-items-stretch justify-content-between flex-lg-grow-1" id="kt_app_header_wrapper">
                                    <div ref={boxRef2}
                                        className={`app-header-menu app-header-mobile-drawer align-items-stretch ${mobileMenu2Show ? 'drawer drawer-end drawer-on' : ''}`}
                                        data-kt-drawer="true" data-kt-drawer-name="app-header-menu" data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true" data-kt-drawer-width="225px" data-kt-drawer-direction="end" data-kt-drawer-toggle="#kt_app_header_menu_toggle" data-kt-swapper="true" data-kt-swapper-mode="{default: 'append', lg: 'prepend'}" data-kt-swapper-parent="{default: '#kt_app_body', lg: '#kt_app_header_wrapper'}">
                                        <div className="menu menu-rounded menu-column menu-lg-row my-5 my-lg-0 align-items-stretch fw-semibold px-2 px-lg-0" id="kt_app_header_menu" data-kt-menu="true">
                                            {/*
                                                <div data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="bottom-start" className="menu-item menu-here-bg menu-lg-down-accordion me-0 me-lg-2">
                                                    <span className="menu-link">
                                                        <span className="menu-title">정보수정</span>
                                                        <span className="menu-arrow d-lg-none"></span>
                                                    </span>
                                                </div>
                                                <div data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="bottom-start" className="menu-item menu-here-bg menu-lg-down-accordion me-0 me-lg-2">
                                                    <span className="menu-link">
                                                        <span className="menu-title">비밀번호 찾기</span>
                                                        <span className="menu-arrow d-lg-none"></span>
                                                    </span>
                                                </div>
                                                */}
                                            <div data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="bottom-start" className="menu-item menu-lg-down-accordion menu-sub-lg-down-indention me-0 me-lg-2">
                                                <span className="menu-link">
                                                    <span className="menu-title" onClick={handleLogout}>로그아웃</span>
                                                    <span className="menu-arrow d-lg-none"></span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="app-navbar flex-shrink-0">
                                        <div className="app-navbar-item ms-2 ms-1 ms-lg-3" id="kt_header_user_menu_toggle">
                                            <div className="cursor-pointer symbol symbol-35px symbol-md-40px" data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-attach="parent" data-kt-menu-placement="bottom-end">
                                                <span className="text-primary">관리자님</span> 로그인 중입니다.
                                            </div>
                                        </div>

                                        {/*-----------------------------------------------------------------------------------*/}
                                        <div className="app-navbar-item d-lg-none ms-2 me-n2" title="Show header menu">
                                            <div id="kt_app_header_menu_toggle"
                                                onClick={() => {
                                                    setMobileMenuShow(false)
                                                    setMobileMenu2Show(true) //모바일에서 로그아웃있는 메뉴클릭시(오른쪽 상단)



                                                }}
                                                className={`className="btn btn-flex btn-icon btn-active-color-primary w-30px h-30px ${mobileMenu2Show ? 'active' : ''}`}
                                            >
                                                <i className="ki-duotone ki-element-4 fs-1">
                                                    <span className="path1"></span>
                                                    <span className="path2"></span>
                                                </i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="app-wrapper flex-column flex-row-fluid" id="kt_app_wrapper">
                            <div id="kt_app_sidebar" ref={boxRef}
                                className={`app-sidebar flex-column ${mobileMenuShow ? 'drawer drawer-start drawer-on' : ''}`}
                                data-kt-drawer="true" data-kt-drawer-name="app-sidebar" data-kt-drawer-activate="{default: true, lg: false}"
                                data-kt-drawer-overlay="true" data-kt-drawer-width="225px" data-kt-drawer-direction="start"
                                data-kt-drawer-toggle="#kt_app_sidebar_mobile_toggle">
                                <div className="app-sidebar-logo px-6" id="kt_app_sidebar_logo">
                                    {/*-- 로고 --*/}
                                    <a href="/admin/manage">
                                        <img alt="Logo" src="/images/logo/default-dark.svg" className="h-30px app-sidebar-logo-default" />
                                    </a>
                                    {/*-- 열기닫기버튼 --*/}
                                    <div id="kt_app_sidebar_toggle"
                                        className={`app-sidebar-toggle btn btn-icon btn-sm h-30px w-30px rotate ${sidebar ? '' : 'active'}`}
                                        data-kt-toggle="true" data-kt-toggle-state="active" data-kt-toggle-target="body" data-kt-toggle-name="app-sidebar-minimize">
                                        <i className="ki-duotone ki-double-left fs-2 rotate-180">
                                            <span className="path1" onClick={() => {
                                                console.log("첫번째")
                                            }}></span>
                                            <span className="path2" onClick={() => {
                                                console.log("두번째")
                                                setSidebar((prev) => !prev)
                                            }}></span>
                                        </i>
                                    </div>
                                </div>
                                <div className="app-sidebar-menu overflow-hidden flex-column-fluid">
                                    <div id="kt_app_sidebar_menu_wrapper" className="app-sidebar-wrapper">
                                        <div id="kt_app_sidebar_menu_scroll" className="hover-scroll-y my-5 mx-3" data-kt-scroll="true" data-kt-scroll-activate="true" data-kt-scroll-height="auto" data-kt-scroll-dependencies="#kt_app_sidebar_logo, #kt_app_sidebar_footer" data-kt-scroll-wrappers="#kt_app_sidebar_menu" data-kt-scroll-offset="5px" data-kt-scroll-save-state="true">
                                            <div className="menu menu-column menu-rounded menu-sub-indention fw-semibold" id="#kt_app_sidebar_menu" data-kt-menu="true" data-kt-menu-expand="false">
                                                <div data-kt-menu-trigger="click"
                                                    className={`menu-item menu-accordion ${menus[0] ? 'hover show' : ''}`}
                                                    onClick={() => {
                                                        router.push(`/admin/manage`); //대쉬보드(menu1)
                                                    }} >
                                                    <span className="menu-link">
                                                        <span className="menu-icon">
                                                            <i className="ki-duotone ki-category fs-2">
                                                                <span className="path1"></span>
                                                                <span className="path2"></span>
                                                                <span className="path3"></span>
                                                                <span className="path4"></span>
                                                            </i>
                                                        </span>
                                                        <span className="menu-title">Dashboards</span>
                                                    </span>
                                                </div>
                                                <div data-kt-menu-trigger="click" className="menu-item">
                                                    <span className="menu-link">
                                                        <span className="menu-icon">
                                                            <i className="ki-duotone ki-user fs-2">
                                                                <span className="path1"></span>
                                                                <span className="path2"></span>
                                                            </i>
                                                        </span>
                                                        <span className="menu-title">회원관리</span>
                                                    </span>
                                                </div>
                                                <div data-kt-menu-trigger="click"
                                                    className={`menu-item ${menus[1] ? 'hover show' : ''}`}
                                                    onClick={() => {
                                                        router.push(`/admin/manage/business/list`); //사업자관리(menu2)
                                                    }} >
                                                    <span className="menu-link">
                                                        <span className="menu-icon">
                                                            <i className="ki-duotone ki-address-book fs-2">
                                                                <span className="path1"></span>
                                                                <span className="path2"></span>
                                                                <span className="path3"></span>
                                                            </i>
                                                        </span>
                                                        <span className="menu-title">사업자 회원관리</span>
                                                    </span>
                                                </div>
                                                <div data-kt-menu-trigger="click"
                                                    className={`menu-item menu-accordion  ${menushow ? 'show hover' : ''}`}
                                                    onClick={() => {
                                                        setMenuShow((prev) => !prev)
                                                    }}
                                                >
                                                    <span className="menu-link">
                                                        <span className="menu-icon">
                                                            <i className="ki-duotone ki-educare fs-2">
                                                                <span className="path1"></span>
                                                                <span className="path2"></span>
                                                                <span className="path3"></span>
                                                                <span className="path4"></span>
                                                            </i>
                                                        </span>
                                                        <span className="menu-title">쿠폰관리</span>
                                                        <span className="menu-arrow"></span>
                                                    </span>
                                                    <div className="menu-sub menu-sub-accordion">
                                                        <div data-kt-menu-trigger="click"
                                                            className={`menu-item menu-accordion ${menus[2] ? 'hover showing' : ''}`}
                                                            onClick={() => {
                                                                router.push(`/admin/manage/coupon/list`);
                                                            }} >
                                                            <span className="menu-link">
                                                                <span className="menu-bullet">
                                                                    <span className="bullet bullet-dot"></span>
                                                                </span>
                                                                <span className="menu-title">쿠폰리스트</span>
                                                            </span>
                                                        </div>
                                                        <div data-kt-menu-trigger="click"
                                                            className={`menu-item menu-accordion ${menus[3] ? 'hover show' : ''}`}
                                                            onClick={() => {
                                                                router.push(`/admin/manage/coupon/add`);
                                                            }} >
                                                            <span className="menu-link">
                                                                <span className="menu-bullet">
                                                                    <span className="bullet bullet-dot"></span>
                                                                </span>
                                                                <span className="menu-title">쿠폰등록</span>
                                                            </span>
                                                        </div>
                                                        <div data-kt-menu-trigger="click"
                                                            className={`menu-item menu-accordion ${menus[4] ? 'hover showing' : ''}`}
                                                            onClick={() => {
                                                                router.push(`/admin/manage/coupon/issuelist`);
                                                            }} >
                                                            <span className="menu-link">
                                                                <span className="menu-bullet">
                                                                    <span className="bullet bullet-dot"></span>
                                                                </span>
                                                                <span className="menu-title">쿠폰발급 리스트</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div data-kt-menu-trigger="click" className="menu-item menu-accordion">
                                                    <span className="menu-link">
                                                        <span className="menu-icon">
                                                            <i className="ki-duotone ki-file fs-2">
                                                                <span className="path1"></span>
                                                                <span className="path2"></span>
                                                            </i>
                                                        </span>
                                                        <span className="menu-title">관리자 관리</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="app-main flex-column flex-row-fluid" id="kt_app_main">
                                <div className="d-flex flex-column flex-column-fluid">

                                    {children}

                                </div>
                                <div id="kt_app_footer" className="app-footer">
                                    <div className="app-container container-fluid d-flex flex-column flex-md-row flex-center flex-md-stack py-3">
                                        <div className="text-dark order-2 order-md-1">
                                            <span className="text-muted fw-semibold me-1">Copyright 2025 ©
                                                <a href="https://keenthemes.com" target="_blank" className="text-gray-800 text-hover-primary">UNDERPIN Inc.</a> All Rights Reserved.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </AdminGuard>
    );
}
{/*


*/}