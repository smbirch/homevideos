package com.smbirch.homemovies.controllers;


import com.smbirch.homemovies.dtos.CommentRequestDto;
import com.smbirch.homemovies.dtos.CommentResponseDto;
import com.smbirch.homemovies.entities.Comment;
import com.smbirch.homemovies.services.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;


    @PostMapping("/post")
    public CommentResponseDto postVideoComment(@RequestBody CommentRequestDto commentRequestDto) {
        return commentService.postVideoComment(commentRequestDto);
    }

    @GetMapping("/get/{videoId}")
    public List<Comment> getVideoComments(@PathVariable Long videoId) {
        return commentService.getVideoComments(videoId);
    }

    // only requires commentId in commentRequestDto
    @DeleteMapping("/delete")
    public CommentResponseDto deleteComment(@RequestBody CommentRequestDto commentRequestDto) {
        return commentService.deleteComment(commentRequestDto);
    }

    @PatchMapping("/update")
    public CommentResponseDto updateComment(@RequestBody CommentRequestDto commentRequestDto) {
        return commentService.updateComment(commentRequestDto);
    }
}