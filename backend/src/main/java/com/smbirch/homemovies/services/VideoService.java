package com.smbirch.homemovies.services;

import com.smbirch.homemovies.dtos.CommentRequestDto;
import com.smbirch.homemovies.dtos.CommentResponseDto;
import com.smbirch.homemovies.dtos.VideoRequestDto;
import com.smbirch.homemovies.dtos.VideoResponseDto;

import java.util.List;

public interface VideoService {

    List<VideoResponseDto> getAllVideos();

    VideoResponseDto getVideoById(Long id);

    List<String> getAllThumbnails();

    List<VideoResponseDto> getPage(int page);

    VideoResponseDto updateVideoTitle(VideoRequestDto videoRequestDto);

    VideoResponseDto updateVideoDescription(VideoRequestDto videoRequestDto);
}