package com.smbirch.homemovies.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class CommentRequestDto {
  private Long videoId;

  private Long commentId;

  private String text;

  private String author;
}
