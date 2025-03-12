package com.example.crm.controller;

import com.example.crm.model.Order;
import com.example.crm.service.OrderService;
import org.aspectj.weaver.ast.Or;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
}
