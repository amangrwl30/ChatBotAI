package com.example.crm.controller;

import com.example.crm.model.Order;
import com.example.crm.model.RefundStatusResponse;
import com.example.crm.model.AddressChangeResponse;
import com.example.crm.model.DamagedProductResponse;
import com.example.crm.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ✅ Fetch all orders
    @GetMapping
    public List<Order> getAllOrders(String userId) {
        return orderService.getOrders(userId);
    }

    // ✅ Fetch order details by orderId
    @GetMapping("/order")
    public Order getOrderById(@RequestParam String orderId) {
        return orderService.getOrderDetailsByOrderId(orderId);
    }

    // ✅ Check refund status of an order
    @GetMapping("/refund-status")
    public RefundStatusResponse checkRefundStatus(@RequestParam String orderId) {
        return orderService.checkRefundStatus(orderId);
    }

    // ✅ Check if delivery address changes are allowed
    @GetMapping("/address-change-status")
    public AddressChangeResponse isDeliveryAddressChangesAllowed(@RequestParam String orderId) {
        return orderService.isDeliveryAddressChangesAllowed(orderId);
    }

    // ✅ Check if damaged product can be returned
    @GetMapping("/damaged-product-inquiry")
    public DamagedProductResponse damagedProductInquiry(@RequestParam String orderId) {
        return orderService.damagedProductInquiry(orderId);
    }
}
