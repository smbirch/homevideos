package com.smbirch.homemovies.services.impl;

import com.smbirch.homemovies.dtos.CommentRequestDto;
import com.smbirch.homemovies.dtos.CommentResponseDto;
import com.smbirch.homemovies.entities.Comment;
import com.smbirch.homemovies.entities.User;
import com.smbirch.homemovies.entities.Video;
import com.smbirch.homemovies.exceptions.NotFoundException;
import com.smbirch.homemovies.repositories.CommentRepository;
import com.smbirch.homemovies.repositories.UserRepository;
import com.smbirch.homemovies.repositories.VideoRepository;
import com.smbirch.homemovies.services.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final VideoRepository videoRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    private User getUserHelper(String username) {
        Optional<User> userToCheckFor = userRepository.findByCredentials_Username(username);

        if (userToCheckFor.isEmpty() || userToCheckFor.get().isDeleted()) {
            throw new NotFoundException("No user found with username: '" + username + "'");
        }
        return userToCheckFor.get();
    }


    @Override
    public CommentResponseDto postVideoComment(CommentRequestDto commentRequestDto) {

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

    @Override
    public List<Comment> getVideoComments(Long videoId) {
        return commentRepository.findByVideoId(videoId);
    }


}