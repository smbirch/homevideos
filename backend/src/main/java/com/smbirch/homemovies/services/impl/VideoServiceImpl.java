package com.smbirch.homemovies.services.impl;

import com.smbirch.homemovies.dtos.CommentRequestDto;
import com.smbirch.homemovies.dtos.CommentResponseDto;
import com.smbirch.homemovies.dtos.VideoRequestDto;
import com.smbirch.homemovies.dtos.VideoResponseDto;
import com.smbirch.homemovies.entities.Comment;
import com.smbirch.homemovies.entities.User;
import com.smbirch.homemovies.entities.Video;
import com.smbirch.homemovies.exceptions.NotFoundException;
import com.smbirch.homemovies.mappers.VideoMapper;
import com.smbirch.homemovies.repositories.UserRepository;
import com.smbirch.homemovies.repositories.VideoRepository;
import com.smbirch.homemovies.services.VideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VideoServiceImpl implements VideoService {

    private final VideoRepository videoRepository;
    private final VideoMapper videoMapper;
    private final UserRepository userRepository;


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

        return videoMapper.entityToDto(current.get());
    }

    @Override
    public List<String> getAllThumbnails() {
        List<Video> videos = videoRepository.findAll();
        List<String> videoThumbnailUrls = new ArrayList<>();
        for (Video video: videos) {
            videoThumbnailUrls.add(video.getUrl());
        }
        return videoThumbnailUrls;
    }

    @Override
    public List<VideoResponseDto> getPage(int page) {
        int pageSize = 12;
        Sort sort = Sort.by(Sort.Direction.ASC, "id");
        Pageable pageable = PageRequest.of(page, pageSize, sort);
        Page<Video> videoPage = videoRepository.findAll(pageable);
        if (videoPage.isEmpty()) {
            throw new NotFoundException("No more pages to fetch");
        }
        return videoMapper.entitiesToDtos(videoPage.getContent());
    }

    @Override
    public VideoResponseDto updateVideoTitle(VideoRequestDto videoRequestDto) {
        Video video = videoRepository.findById(videoRequestDto.getId()).orElseThrow(() -> new NotFoundException("Video not found with ID: " + videoRequestDto.getId()));
        video.setTitle(videoRequestDto.getTitle());

        return videoMapper.entityToDto(videoRepository.saveAndFlush(video));
    }

    @Override
    public VideoResponseDto updateVideoDescription(VideoRequestDto videoRequestDto) {
        Video video = videoRepository.findById(videoRequestDto.getId()).orElseThrow(() -> new NotFoundException("Video not found with ID: " + videoRequestDto.getId()));
        video.setDescription(videoRequestDto.getDescription());

        return videoMapper.entityToDto(videoRepository.saveAndFlush(video));
    }

    @Override
    public CommentResponseDto postVideoComment(CommentRequestDto commentRequestDto) {
        // Fetch the video from the database based on the comment's video id
        Video video = videoRepository.findById(commentRequestDto.getVideoId()).orElseThrow(() -> new NotFoundException("Video not found with ID: " + commentRequestDto.getVideoId()));

        User user = getUserHelper(commentRequestDto.getAuthor());

        Comment comment = new Comment();
        comment.setText(commentRequestDto.getText());
        comment.setAuthor(user.getCredentials().getUsername());
        comment.setUser(user);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setVideo(video);
        comment.setDeleted(false);

        // Add the comment to the video's list of comments
        video.getComments().add(comment);

        // Save the updated video with the new comment
        videoRepository.saveAndFlush(video);

        // create responseDto and return it
        CommentResponseDto commentResponseDto = new CommentResponseDto();
        commentResponseDto.setId(comment.getId());
        commentResponseDto.setText(comment.getText());
        commentResponseDto.setCreatedAt(comment.getCreatedAt());
        commentResponseDto.setAuthor(comment.getAuthor());
        commentResponseDto.setDeleted(false);

        return commentResponseDto;
    }

    private User getUserHelper(String username) {
        Optional<User> userToCheckFor = userRepository.findByCredentials_Username(username);

        if (userToCheckFor.isEmpty() || userToCheckFor.get().isDeleted()) {
            throw new NotFoundException("No user found with username: '" + username + "'");
        }
        return userToCheckFor.get();
    }
}