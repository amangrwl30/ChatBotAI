package com.example.crm.client;

import com.example.crm.model.Order;
import com.example.crm.model.RefundStatusResponse;
import com.example.crm.model.AddressChangeResponse;
import com.example.crm.model.DamagedProductResponse;
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

    @GetMapping("/checkRefundStatus")
    RefundStatusResponse checkRefundStatus(@RequestParam("orderId") String orderId);

    @GetMapping("/isDeliveryAddressChangesAllowed")
    AddressChangeResponse isDeliveryAddressChangesAllowed(@RequestParam("orderId") String orderId);

    @GetMapping("/damagedProductInquiry")
    DamagedProductResponse damagedProductInquiry(@RequestParam("orderId") String orderId);
}
