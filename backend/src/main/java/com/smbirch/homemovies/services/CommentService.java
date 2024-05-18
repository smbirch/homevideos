package com.smbirch.homemovies.services;

import com.smbirch.homemovies.dtos.CommentRequestDto;
import com.smbirch.homemovies.dtos.CommentResponseDto;
import com.smbirch.homemovies.entities.Comment;

import java.util.List;

public interface CommentService {
    CommentResponseDto postVideoComment(CommentRequestDto commentRequestDto);

    List<Comment> getVideoComments(Long videoId);
}