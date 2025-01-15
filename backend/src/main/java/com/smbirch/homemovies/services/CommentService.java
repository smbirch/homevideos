package com.smbirch.homemovies.services;

import com.smbirch.homemovies.dtos.CommentRequestDto;
import com.smbirch.homemovies.dtos.CommentResponseDto;
import com.smbirch.homemovies.entities.Comment;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

public interface CommentService {
  ResponseEntity<CommentResponseDto> postVideoComment(CommentRequestDto commentRequestDto, HttpServletRequest request);

  List<Comment> getVideoComments(Long videoId);

  CommentResponseDto deleteComment(CommentRequestDto commentRequestDto);

  CommentResponseDto updateComment(CommentRequestDto commentRequestDto);

}
