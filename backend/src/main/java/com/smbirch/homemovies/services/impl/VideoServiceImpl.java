package com.smbirch.homemovies.services.impl;

import com.smbirch.homemovies.dtos.VideoRequestDto;
import com.smbirch.homemovies.dtos.VideoResponseDto;
import com.smbirch.homemovies.entities.Video;
import com.smbirch.homemovies.exceptions.NotFoundException;
import com.smbirch.homemovies.mappers.VideoMapper;
import com.smbirch.homemovies.repositories.VideoRepository;
import com.smbirch.homemovies.services.JwtService;
import com.smbirch.homemovies.services.VideoService;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class VideoServiceImpl implements VideoService {

  private final VideoRepository videoRepository;
  private final VideoMapper videoMapper;
  private final JwtService jwtService;


  @Override
  public List<VideoResponseDto> getAllVideos() {
    log.info("102 - Getting all videos");
    return videoMapper.entitiesToDtos(videoRepository.findAll());
  }

  @Override
  public VideoResponseDto getVideoById(Long id) {
    log.info("102 - Getting video by ID: {}", id);
    Optional<Video> current = videoRepository.findById(id);

    if (current.isEmpty()) {
      log.warn("404 - Video not found: '{}'", id);
      throw new NotFoundException("Video not found.");
    }

    return videoMapper.entityToDto(current.get());
  }

  @Override
  public List<String> getAllThumbnails() {
    log.info("102 - Getting all thumbnails");
    List<Video> videos = videoRepository.findAll();
    List<String> videoThumbnailUrls = new ArrayList<>();
    for (Video video : videos) {
      videoThumbnailUrls.add(video.getUrl());
    }
    return videoThumbnailUrls;
  }

  @Override
  public List<VideoResponseDto> getPage(int page) {
    log.info("102 - Getting page {}", page);
    int pageSize = 12;
    Sort sort = Sort.by(Sort.Direction.ASC, "id");
    Pageable pageable = PageRequest.of(page, pageSize, sort);
    Page<Video> videoPage = videoRepository.findAll(pageable);
    if (videoPage.isEmpty()) {
      log.warn("404 - No page found: '{}'", page);
      throw new NotFoundException("No page found");
    }
    return videoMapper.entitiesToDtos(videoPage.getContent());
  }

  @Override
  public ResponseEntity<VideoResponseDto> updateVideoTitle(VideoRequestDto videoRequestDto, HttpServletRequest request) {
    log.info("102 - Request to update video title for video ID: '{}'", videoRequestDto.getId());

    // check token
    String token = jwtService.getTokenFromRequest(request);
    boolean isValidToken = jwtService.validateTokenAndUser(token, jwtService.extractUsername(token));
    if (!isValidToken) {
      log.warn("404 - Invalid token while editing video title");
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Video video =
        videoRepository
            .findById(videoRequestDto.getId())
            .orElseThrow(
                () -> {
                  log.warn("404 - Video not found with ID: {}", videoRequestDto.getId());
                  return new NotFoundException(
                      "Video not found with ID: " + videoRequestDto.getId());
                });
    log.info("102 - Updating video title for video ID: '{}' - '{}'", videoRequestDto.getId(), video.getTitle());
    video.setTitle(videoRequestDto.getTitle());
    videoRepository.save(video);

    return ResponseEntity.ok(videoMapper.entityToDto(video));
  }

  @Override
  public ResponseEntity<VideoResponseDto> updateVideoDescription(VideoRequestDto videoRequestDto, HttpServletRequest request) {
    log.info("102 - Request to update video description for video ID: '{}'", videoRequestDto.getId());

    // check token
    String token = jwtService.getTokenFromRequest(request);
    boolean isValidToken = jwtService.validateTokenAndUser(token, jwtService.extractUsername(token));
    if (!isValidToken) {
      log.warn("404 - Invalid token while editing video description");
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Video video =
        videoRepository
            .findById(videoRequestDto.getId())
            .orElseThrow(
                () -> {
                  log.warn(
                      "404 - Video not found with ID: '{}' while updating description",
                      videoRequestDto.getId());
                  return new NotFoundException(
                      "Video not found with ID: " + videoRequestDto.getId());
                });
    log.info("102 - Updating video description for video ID: '{}' - '{}'", videoRequestDto.getId(), video.getDescription());
    video.setDescription(videoRequestDto.getDescription());
    videoRepository.saveAndFlush(video);
    return ResponseEntity.ok(videoMapper.entityToDto(video));
  }
}
