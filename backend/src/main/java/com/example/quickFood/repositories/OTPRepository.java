package com.example.quickFood.repositories;

import com.example.quickFood.models.OTP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface OTPRepository extends JpaRepository<OTP, Integer> {
    List<OTP> findByUserEmail(String userEmail);

    @Transactional
    void deleteByUserEmail(String userEmail);
}
