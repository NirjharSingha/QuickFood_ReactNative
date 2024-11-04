package com.example.quickFood.controllers;

import com.example.quickFood.dto.MenuDto;
import com.example.quickFood.services.impl.MenuServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/menu")
@CrossOrigin
public class MenuController {
    @Autowired
    private MenuServiceImpl menuService;

    @PostMapping("/addMenu")
    public ResponseEntity<MenuDto> addMenu(@RequestParam(value = "file", required = false) MultipartFile file,
            @ModelAttribute MenuDto menuDto) {
        try {
            if (file != null && !file.isEmpty()) {
                menuDto.setImage(file.getBytes());
            }

            return menuService.addMenu(menuDto);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/updateMenu")
    public ResponseEntity<MenuDto> updateMenu(@RequestParam(value = "file", required = false) MultipartFile file,
            @ModelAttribute MenuDto menuDto) {
        try {
            if (file != null && !file.isEmpty()) {
                menuDto.setImage(file.getBytes());
            }

            return menuService.updateMenu(menuDto);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/getMenuByResId")
    public ResponseEntity<List<MenuDto>> getMenuByResId(@RequestParam String resId, @RequestParam int page,
            @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        List<MenuDto> menuDtoList = menuService.getMenuByResId(resId, pageable);
        return ResponseEntity.ok(menuDtoList);
    }

    @GetMapping("/getFilteredMenu")
    public ResponseEntity<List<MenuDto>> getFilteredMenu(@RequestParam String name, @RequestParam String resId,
            @RequestParam String category, @RequestParam String price, @RequestParam String rating,
            @RequestParam int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        List<MenuDto> menuDtoList = menuService.getFilteredMenu(name, resId, category, price, rating, pageable);
        return ResponseEntity.ok(menuDtoList);
    }

    @GetMapping("/getCartMenu")
    public ResponseEntity<List<MenuDto>> getCartMenu(@RequestParam List<Integer> menuIds) {
        List<MenuDto> menuDtoList = menuService.getCartMenu(menuIds);
        return ResponseEntity.ok(menuDtoList);
    }
}
