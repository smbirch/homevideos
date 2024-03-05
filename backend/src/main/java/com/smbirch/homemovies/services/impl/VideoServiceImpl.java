package com.smbirch.homemovies.services.impl;

import com.smbirch.homemovies.dtos.VideoResponseDto;
import com.smbirch.homemovies.entities.Video;
import com.smbirch.homemovies.exceptions.NotFoundException;
import com.smbirch.homemovies.mappers.VideoMapper;
import com.smbirch.homemovies.repositories.VideoRepository;
import com.smbirch.homemovies.services.VideoService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VideoServiceImpl implements VideoService {

    private final VideoRepository videoRepository;
    private final VideoMapper videoMapper;

    @Override
    public List<VideoResponseDto> getAllVideos() {
        List<VideoResponseDto> videos = videoMapper.entitiesToDtos(videoRepository.findAll());
        for (VideoResponseDto video : videos) {
            video.setUrl("https://d1vqiwu0adek5c.cloudfront.net/" + video.getUrl());
            String tempUrl = "https://d1vqiwu0adek5c.cloudfront.net/";
            video.setThumbnailurl( tempUrl + video.getThumbnailurl());
        }
        return videos;
    }

    @Override
    public VideoResponseDto getVideoById(Long id) {
        Optional<Video> current = videoRepository.findById(id);

        if (current.isEmpty()) {
            throw new NotFoundException("Video not found.");
        }

        VideoResponseDto video = videoMapper.entityToDto(current.get());
        video.setUrl("https://d1vqiwu0adek5c.cloudfront.net/" + video.getUrl());
        return video;
    }

    @Override
    public List<String> getAllThumbnails() {
        List<Video> videos = videoRepository.findAll();
        List<String> videoThumbnailUrls = new ArrayList<>();
        for (Video video : videos) {
            videoThumbnailUrls.add(
                    "https://d1vqiwu0adek5c.cloudfront.net/" + video.getThumbnailurl());
        }
        return videoThumbnailUrls;
    }
}