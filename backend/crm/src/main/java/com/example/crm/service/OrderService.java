package com.example.crm.service;

import com.example.crm.client.ZomatoClient;
import com.example.crm.model.Order;
import com.example.crm.model.RefundStatusResponse;
import com.example.crm.model.AddressChangeResponse;
import com.example.crm.model.DamagedProductResponse;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class OrderService {
    private final ZomatoClient zomatoClient;

    @Autowired
    public OrderService(ZomatoClient zomatoClient) {
        this.zomatoClient = zomatoClient;
    }

    public List<Order> getOrders(String userId) {
        return zomatoClient.fetchAllOrders(userId);
    }

    public Order getOrderDetailsByOrderId(String orderId) {
        return zomatoClient.fetchOrderDetailsByOrderId(orderId);
    }

    public RefundStatusResponse checkRefundStatus(String orderId) {
        return zomatoClient.checkRefundStatus(orderId);
    }

    public AddressChangeResponse isDeliveryAddressChangesAllowed(String orderId) {
        return zomatoClient.isDeliveryAddressChangesAllowed(orderId);
    }

    public DamagedProductResponse damagedProductInquiry(String orderId) {
        return zomatoClient.damagedProductInquiry(orderId);
    }
}
