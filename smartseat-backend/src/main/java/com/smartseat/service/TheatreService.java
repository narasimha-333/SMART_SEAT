package com.smartseat.service;

import com.smartseat.dto.TheatreRequest;
import com.smartseat.dto.TheatreResponse;
import com.smartseat.entity.Theatre;
import com.smartseat.repository.TheatreRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TheatreService {

    private final TheatreRepository theatreRepository;

    public TheatreService(TheatreRepository theatreRepository) {
        this.theatreRepository = theatreRepository;
    }

    public TheatreResponse createTheatre(TheatreRequest request) {

        Theatre theatre = Theatre.builder()
                .name(request.getName())
                .city(request.getCity())
                .address(request.getAddress())
                .build();

        Theatre saved = theatreRepository.save(theatre);

        return mapToResponse(saved);
    }

    public List<TheatreResponse> getAllTheatres() {

        return theatreRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public TheatreResponse getTheatreById(Long id) {

        Theatre theatre = theatreRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Theatre not found"));

        return mapToResponse(theatre);
    }

    private TheatreResponse mapToResponse(Theatre theatre) {

        return TheatreResponse.builder()
                .id(theatre.getId())
                .name(theatre.getName())
                .city(theatre.getCity())
                .address(theatre.getAddress())
                .build();
    }
}