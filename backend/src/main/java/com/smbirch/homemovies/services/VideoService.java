package com.smbirch.homemovies.services;

import com.smbirch.homemovies.dtos.VideoResponseDto;

import java.util.List;

public interface VideoService {

    List<VideoResponseDto> getAllVideos();

    VideoResponseDto getVideoById(Long id);

    List<String> getAllThumbnails();

    List<VideoResponseDto> getPage(int page);
}