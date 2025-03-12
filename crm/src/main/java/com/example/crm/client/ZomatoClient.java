package com.example.crm.client;


import com.example.crm.model.Order;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Component
@FeignClient(name = "zomatoClient", url = "http://localhost:3001")
public interface ZomatoClient {

    @GetMapping("/orders")
    List<Order> fetchAllOrders(@RequestParam("userId") String userId);

    @GetMapping("/order")
    Order fetchOrderDetailsByOrderId(@RequestParam("orderId") String orderId);
}
