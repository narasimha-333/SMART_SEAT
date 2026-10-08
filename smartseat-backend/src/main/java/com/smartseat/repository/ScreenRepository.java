package com.smartseat.repository;

import com.smartseat.entity.Screen;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScreenRepository
        extends JpaRepository<Screen, Long> {
}