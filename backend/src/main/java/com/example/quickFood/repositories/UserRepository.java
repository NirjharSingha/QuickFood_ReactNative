package com.example.quickFood.repositories;

import com.example.quickFood.dto.IdNameImgDto;
import com.example.quickFood.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findById(String id);

    @Query("SELECT new com.example.quickFood.dto.IdNameImgDto(u.id, u.name, u.profilePic) FROM User u WHERE u.role = com.example.quickFood.enums.Role.RIDER")
    List<IdNameImgDto> findAllRiders();
}
