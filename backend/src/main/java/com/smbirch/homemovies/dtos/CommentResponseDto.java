package com.smbirch.homemovies.dtos;

import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class CommentResponseDto {
  private Long id;

  private String text;

  private String author;

  private LocalDateTime createdAt;

  private boolean deleted;
}
