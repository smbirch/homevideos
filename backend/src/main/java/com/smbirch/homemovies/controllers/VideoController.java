package com.smbirch.homemovies.controllers;

import com.smbirch.homemovies.dtos.VideoResponseDto;
import com.smbirch.homemovies.services.VideoService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/content")
public class VideoController {

    private final VideoService videoService;

    @GetMapping("/all")
    public List<VideoResponseDto> getAllVideos() {
        return videoService.getAllVideos();
    }

    @GetMapping("/{id}")
    public VideoResponseDto getVideoById(@PathVariable("id") Long id) {
        return videoService.getVideoById(id);
    }
}