package com.spring.rankwelldemo.services;

import com.spring.rankwelldemo.entity.Admin;

public interface AdminService {

	Admin login(String email, String password);
	
}
