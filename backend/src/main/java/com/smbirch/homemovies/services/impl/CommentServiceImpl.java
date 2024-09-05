package com.smbirch.homemovies.services.impl;

import com.smbirch.homemovies.dtos.CommentRequestDto;
import com.smbirch.homemovies.dtos.CommentResponseDto;
import com.smbirch.homemovies.entities.Comment;
import com.smbirch.homemovies.entities.User;
import com.smbirch.homemovies.entities.Video;
import com.smbirch.homemovies.exceptions.BadRequestException;
import com.smbirch.homemovies.exceptions.NotFoundException;
import com.smbirch.homemovies.repositories.CommentRepository;
import com.smbirch.homemovies.repositories.UserRepository;
import com.smbirch.homemovies.repositories.VideoRepository;
import com.smbirch.homemovies.services.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
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

    private CommentResponseDto convertToResponseDto(Comment comment) {
        CommentResponseDto commentResponseDto = new CommentResponseDto();
        commentResponseDto.setId(comment.getId());
        commentResponseDto.setText(comment.getText());
        commentResponseDto.setCreatedAt(comment.getCreatedAt());
        commentResponseDto.setAuthor(comment.getAuthor());
        commentResponseDto.setDeleted(comment.isDeleted());
        return commentResponseDto;
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

        video.getComments().add(comment);

        videoRepository.saveAndFlush(video);

        return convertToResponseDto(comment);
    }

    @Override
    public List<Comment> getVideoComments(Long videoId) {
        ArrayList<Comment> commentList = commentRepository.findByVideoId(videoId);
        commentList.removeIf(Comment::isDeleted);
        return commentList;
    }

    @Override
    public CommentResponseDto deleteComment(CommentRequestDto commentRequestDto) {
        Comment comment = commentRepository.findById(commentRequestDto.getCommentId()).orElseThrow(() -> new NotFoundException("Comment with ID: " + commentRequestDto.getCommentId() + " not found"));

        comment.setDeleted(true);
        commentRepository.saveAndFlush(comment);

        return convertToResponseDto(comment);
    }

    @Override
    public CommentResponseDto updateComment(CommentRequestDto commentRequestDto) {
        // Fetch the existing comment from the database
        Comment comment = commentRepository.findById(commentRequestDto.getCommentId()).orElseThrow(() -> new NotFoundException("Comment not found with ID: " + commentRequestDto.getCommentId()));

        // Check if the comment is marked as deleted
        if (comment.isDeleted()) {
            throw new NotFoundException("Comment with ID: " + commentRequestDto.getCommentId() + " is deleted and cannot be updated");
        }

        // Update fields if they are provided
        if (commentRequestDto.getText() != null && !commentRequestDto.getText().trim().isEmpty()) {
            comment.setText(commentRequestDto.getText());
        } else throw new BadRequestException("You cannot have a comment with a null or empty text field");

        // Save the updated comment
        commentRepository.saveAndFlush(comment);

        // Convert to Response DTO and return
        return convertToResponseDto(comment);
    }


}
