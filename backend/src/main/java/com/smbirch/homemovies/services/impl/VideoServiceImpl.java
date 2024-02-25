package com.smbirch.homemovies.services.impl;

import com.smbirch.homemovies.dtos.VideoResponseDto;
import com.smbirch.homemovies.entities.Video;
import com.smbirch.homemovies.exceptions.NotFoundException;
import com.smbirch.homemovies.mappers.VideoMapper;
import com.smbirch.homemovies.repositories.VideoRepository;
import com.smbirch.homemovies.services.VideoService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VideoServiceImpl implements VideoService {

    private final VideoRepository videoRepository;
    private final VideoMapper videoMapper;

    @Override
    public List<VideoResponseDto> getAllVideos() {

        return videoMapper.entitiesToDtos(videoRepository.findAll());
    }

    @Override
    public VideoResponseDto getVideoById(Long id) {
        Optional<Video> current = videoRepository.findById(id);

        if (current.isEmpty()) {
            throw new NotFoundException("Video not found.");
        }
        System.out.println("got video by ID " + id);
        return videoMapper.entityToDto(current.get());
    }
}