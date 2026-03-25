package com.spring.rankwelldemo.services;

import org.springframework.web.multipart.MultipartFile;

import com.spring.rankwelldemo.entity.Organization;

public interface OrganizationService {

	  Organization saveOrUpdateOrganization(
			  	Long id,
		        String orgName,
		        String orgEmail,
		        String orgPhone,
		        String orgAddress,
		        MultipartFile orgLogo,
		        MultipartFile orgBrandMedia,
		        String orgAbout
		    );
	  
	  Organization getOrganizationDetails(Long id);

	  Organization saveCurrentOrganization(
	  		String orgName,
	        String orgTagline,
	        String orgEmail,
	        String orgPhone,
	        String orgAddress,
	        String orgWebsite,
	        String orgEstablishedYear,
	        String orgValues,
	        String orgAbout,
	        String createdAt,
	        MultipartFile orgLogo
	    );

	  Organization getCurrentOrganization();
	  
}
