package com.smartseat.repository;

import com.smartseat.entity.Theatre;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TheatreRepository
        extends JpaRepository<Theatre, Long> {
}