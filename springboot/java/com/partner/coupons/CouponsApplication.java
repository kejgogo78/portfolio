package com.partner.coupons;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories(basePackages = "com.partner.coupons.repository")
@EntityScan(basePackages = "com.partner.coupons.entity")
@SpringBootApplication
public class CouponsApplication {

	public static void main(String[] args) {
		SpringApplication.run(CouponsApplication.class, args);
	}

}
