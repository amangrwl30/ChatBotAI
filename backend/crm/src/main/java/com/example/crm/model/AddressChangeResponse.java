package com.example.crm.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AddressChangeResponse {
    @JsonProperty("isAddressChangeAllowed")
    private boolean isAddressChangeAllowed;
    
    private String description;
    
    @JsonProperty("selfLink")
    private String selfLink;
} 