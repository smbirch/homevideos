package com.smbirch.homemovies.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@Data
public class CommentResponseDto {
    private Long id;

    private String text;

    private String author;

    private LocalDateTime createdAt;

    private boolean deleted;

}