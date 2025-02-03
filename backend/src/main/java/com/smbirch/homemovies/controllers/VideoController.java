package com.smbirch.homemovies.controllers;

import com.smbirch.homemovies.dtos.VideoRequestDto;
import com.smbirch.homemovies.dtos.VideoResponseDto;
import com.smbirch.homemovies.services.VideoService;
import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/video")
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

  @GetMapping("/thumbnail/all")
  public List<String> getAllThumbnails() {
    return videoService.getAllThumbnails();
  }

  @GetMapping("/page")
  public List<VideoResponseDto> getPage(@RequestParam(defaultValue = "0") int page) {
    return videoService.getPage(page);
  }

  @PatchMapping("/update/title")
  public ResponseEntity<VideoResponseDto> updateVideoTitle(@RequestBody VideoRequestDto videoRequestDto, HttpServletRequest request) {
    return videoService.updateVideoTitle(videoRequestDto, request);
  }

  @PatchMapping("/update/description")
  public ResponseEntity<VideoResponseDto> updateVideoDescription(@RequestBody VideoRequestDto videoRequestDto, HttpServletRequest request) {
    return videoService.updateVideoDescription(videoRequestDto, request);
  }
}
