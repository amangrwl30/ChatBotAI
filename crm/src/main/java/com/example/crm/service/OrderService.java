package com.example.crm.service;

import com.example.crm.client.ZomatoClient;
import com.example.crm.model.Order;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    private final ZomatoClient zomatoClient;

    public OrderService(ZomatoClient zomatoClient) {
        this.zomatoClient = zomatoClient;
    }

    public List<Order> getOrders(String userId) {
        return zomatoClient.fetchAllOrders(userId);
    }

    public Order getOrderDetailsByOrderId(String orderId) {
        return zomatoClient.fetchOrderDetailsByOrderId(orderId);
    }
}
