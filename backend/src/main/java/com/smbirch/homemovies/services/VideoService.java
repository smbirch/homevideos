package com.smbirch.homemovies.services;

import com.smbirch.homemovies.dtos.VideoRequestDto;
import com.smbirch.homemovies.dtos.VideoResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface VideoService {

  List<VideoResponseDto> getAllVideos();

  VideoResponseDto getVideoById(Long id);

  List<String> getAllThumbnails();

  List<VideoResponseDto> getPage(int page);

  ResponseEntity<VideoResponseDto> updateVideoTitle(VideoRequestDto videoRequestDto, HttpServletRequest request);

  ResponseEntity<VideoResponseDto> updateVideoDescription(VideoRequestDto videoRequestDto, HttpServletRequest request);
}
