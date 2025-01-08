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
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentServiceImpl implements CommentService {

  private final VideoRepository videoRepository;
  private final UserRepository userRepository;
  private final CommentRepository commentRepository;

  private User getUserHelper(String username) {
    Optional<User> userToCheckFor = userRepository.findByCredentials_Username(username);

    if (userToCheckFor.isEmpty() || userToCheckFor.get().isDeleted()) {
      log.info("404 - User not found: '{}'", username);
      return null;
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
  public ResponseEntity<CommentResponseDto> postVideoComment(
          CommentRequestDto commentRequestDto, HttpServletRequest request) {
    log.info(
            "102 - '{}' posting comment: '{}'",
            commentRequestDto.getAuthor(),
            commentRequestDto.getText());
    Video video =
            videoRepository
                    .findById(commentRequestDto.getVideoId())
                    .orElseThrow(
                            () ->
                                    new NotFoundException(
                                            "Video not found with ID: " + commentRequestDto.getVideoId()));

    User user = getUserHelper(commentRequestDto.getAuthor());
    if (user == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Comment comment = new Comment();
    comment.setText(commentRequestDto.getText());
    comment.setAuthor(user.getCredentials().getUsername());
    comment.setUser(user);
    comment.setCreatedAt(LocalDateTime.now());
    comment.setVideo(video);
    comment.setDeleted(false);

    video.getComments().add(comment);

    videoRepository.saveAndFlush(video);

    log.info("102 - Comment posted by user '{}'", commentRequestDto.getAuthor());
    CommentResponseDto commentResponseDto = convertToResponseDto(comment);
    return ResponseEntity.ok(commentResponseDto);
  }

  @Override
  public List<Comment> getVideoComments(Long videoId) {
    log.info("102 - Getting comments for video '{}'", videoId);
    ArrayList<Comment> commentList = commentRepository.findByVideoId(videoId);
    commentList.removeIf(Comment::isDeleted);
    Collections.reverse(commentList);
    return commentList;
  }

  @Override
  public CommentResponseDto deleteComment(CommentRequestDto commentRequestDto) {
    Comment comment =
        commentRepository
            .findById(commentRequestDto.getCommentId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        "Comment with ID: " + commentRequestDto.getCommentId() + " not found"));

    comment.setDeleted(true);
    commentRepository.saveAndFlush(comment);
    log.info(
        "102 - Comment '{}' deleted by user '{}'",
        commentRequestDto.getCommentId(),
        commentRequestDto.getAuthor());

    return convertToResponseDto(comment);
  }

  @Override
  public CommentResponseDto updateComment(CommentRequestDto commentRequestDto) {
    log.info("102 - Updating Comment: '{}'", commentRequestDto.getCommentId());
    Comment comment =
        commentRepository
            .findById(commentRequestDto.getCommentId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        "Comment not found with ID: " + commentRequestDto.getCommentId()));

    if (comment.isDeleted()) {
      throw new NotFoundException(
          "Comment with ID: "
              + commentRequestDto.getCommentId()
              + " is deleted and cannot be updated");
    }

    if (commentRequestDto.getText() != null && !commentRequestDto.getText().trim().isEmpty()) {
      comment.setText(commentRequestDto.getText());
    } else
      throw new BadRequestException("You cannot have a comment with a null or empty text field");

    commentRepository.saveAndFlush(comment);

    return convertToResponseDto(comment);
  }
}
