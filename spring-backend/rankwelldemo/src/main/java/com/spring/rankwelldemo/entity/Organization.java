package com.spring.rankwelldemo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "organization_details")
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orgName;
    private String orgTagline;
    private String orgEmail;
    private String orgPhone;
    private String orgAddress;
    private String orgWebsite;
    private String orgEstablishedYear;
    private String orgValues;
    private String createdAt;

    private String orgLogo;         // store file path
    private String orgBrandMedia;   // image/video path

    @Column(length = 2000)
    private String orgAbout;

    public Organization() {}
    
    // Getters & Setters

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getOrgName() {
		return orgName;
	}

	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}

	public String getOrgEmail() {
		return orgEmail;
	}

	public void setOrgEmail(String orgEmail) {
		this.orgEmail = orgEmail;
	}

	public String getOrgTagline() {
		return orgTagline;
	}

	public void setOrgTagline(String orgTagline) {
		this.orgTagline = orgTagline;
	}

	public String getOrgPhone() {
		return orgPhone;
	}

	public void setOrgPhone(String orgPhone) {
		this.orgPhone = orgPhone;
	}

	public String getOrgAddress() {
		return orgAddress;
	}

	public void setOrgAddress(String orgAddress) {
		this.orgAddress = orgAddress;
	}

	public String getOrgWebsite() {
		return orgWebsite;
	}

	public void setOrgWebsite(String orgWebsite) {
		this.orgWebsite = orgWebsite;
	}

	public String getOrgEstablishedYear() {
		return orgEstablishedYear;
	}

	public void setOrgEstablishedYear(String orgEstablishedYear) {
		this.orgEstablishedYear = orgEstablishedYear;
	}

	public String getOrgValues() {
		return orgValues;
	}

	public void setOrgValues(String orgValues) {
		this.orgValues = orgValues;
	}

	public String getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(String createdAt) {
		this.createdAt = createdAt;
	}

	public String getOrgLogo() {
		return orgLogo;
	}

	public void setOrgLogo(String orgLogo) {
		this.orgLogo = orgLogo;
	}

	public String getOrgBrandMedia() {
		return orgBrandMedia;
	}

	public void setOrgBrandMedia(String orgBrandMedia) {
		this.orgBrandMedia = orgBrandMedia;
	}

	public String getOrgAbout() {
		return orgAbout;
	}

	public void setOrgAbout(String orgAbout) {
		this.orgAbout = orgAbout;
	}

}
