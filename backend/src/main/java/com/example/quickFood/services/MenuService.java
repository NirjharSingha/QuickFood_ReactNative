package com.example.quickFood.services;

import com.example.quickFood.dto.MenuDto;
import com.example.quickFood.dto.OrderQuantity;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface MenuService {
    ResponseEntity<MenuDto> addMenu(MenuDto menuDto);

    ResponseEntity<MenuDto> updateMenu(MenuDto menuDto);

    List<MenuDto> getMenuByResId(String resId, Pageable pageable);

    List<MenuDto> getFilteredMenu(String name, String resId, String category, String price,  String rating, Pageable pageable);

    List<MenuDto> getCartMenu(List<Integer> menuIds);

    Boolean validateOrderQuantity(List<OrderQuantity> gotOrderQuantity);

    void updateQuantity(List<OrderQuantity> gotOrderQuantity);
}
