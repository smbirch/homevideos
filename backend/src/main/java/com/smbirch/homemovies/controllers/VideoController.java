package com.smbirch.homemovies.controllers;

import com.smbirch.homemovies.dtos.VideoRequestDto;
import com.smbirch.homemovies.dtos.VideoResponseDto;
import com.smbirch.homemovies.services.VideoService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/video")
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
  public VideoResponseDto updateVideoTitle(@RequestBody VideoRequestDto videoRequestDto) {
    return videoService.updateVideoTitle(videoRequestDto);
  }

  @PatchMapping("/update/description")
  public VideoResponseDto updateVideoDescription(@RequestBody VideoRequestDto videoRequestDto) {
    return videoService.updateVideoDescription(videoRequestDto);
  }
}
