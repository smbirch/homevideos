package com.smbirch.homemovies.controllers;


import com.smbirch.homemovies.dtos.CommentRequestDto;
import com.smbirch.homemovies.dtos.CommentResponseDto;
import com.smbirch.homemovies.entities.Comment;
import com.smbirch.homemovies.services.CommentService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/{videoId}")
    public List<Comment> getVideoComments(@PathVariable Long videoId) {
        return commentService.getVideoComments(videoId);
    }

    @PostMapping("/new")
    public CommentResponseDto postVideoComment(@RequestBody CommentRequestDto commentRequestDto) {
        return commentService.postVideoComment(commentRequestDto);
    }

    @PatchMapping("/update")
    public CommentResponseDto updateComment(@RequestBody CommentRequestDto commentRequestDto) {
        return commentService.updateComment(commentRequestDto);
    }
    
    // only requires commentId in commentRequestDto
    @DeleteMapping("/delete")
    public CommentResponseDto deleteComment(@RequestBody CommentRequestDto commentRequestDto) {
        return commentService.deleteComment(commentRequestDto);
    }


}
