package com.smbirch.homemovies.controllers;

import com.smbirch.homemovies.dtos.CommentRequestDto;
import com.smbirch.homemovies.dtos.CommentResponseDto;
import com.smbirch.homemovies.entities.Comment;
import com.smbirch.homemovies.services.CommentService;
import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comments")
public class CommentController {

  private final CommentService commentService;

  @GetMapping("/{videoId}")
  @Transactional
  public List<Comment> getVideoComments(@PathVariable Long videoId) {
    return commentService.getVideoComments(videoId);
  }

  @PostMapping("/new")
  @Transactional
  public ResponseEntity<CommentResponseDto> postVideoComment(@RequestBody CommentRequestDto commentRequestDto, HttpServletRequest request) {
    return commentService.postVideoComment(commentRequestDto, request);
  }

  @PatchMapping("/update")
  public ResponseEntity<CommentResponseDto> updateComment(@RequestBody CommentRequestDto commentRequestDto, HttpServletRequest request) {
    return commentService.updateComment(commentRequestDto, request);
  }

  // only requires commentId in commentRequestDto
  @DeleteMapping("/delete")
  public ResponseEntity<CommentResponseDto> deleteComment(@RequestBody CommentRequestDto commentRequestDto, HttpServletRequest request) {
    return commentService.deleteComment(commentRequestDto, request);
  }
}
