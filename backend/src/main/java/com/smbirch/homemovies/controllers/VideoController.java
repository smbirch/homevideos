package com.smbirch.homemovies.controllers;

import com.smbirch.homemovies.dtos.VideoRequestDto;
import com.smbirch.homemovies.dtos.VideoResponseDto;
import com.smbirch.homemovies.services.VideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/all/thumbnails")
    public List<String> getAllThumbnails() {
        return videoService.getAllThumbnails();
    }

    @GetMapping("/page")
    public List<VideoResponseDto> getPage(@RequestParam(defaultValue = "0") int page) {
        return videoService.getPage(page);
    }

    @PatchMapping("/update/title")
    public VideoResponseDto updateVideoTitle(@RequestBody VideoRequestDto videoRequestDto) {
        return videoService.updateVideoTitle(videoRequestDto);
    }
}