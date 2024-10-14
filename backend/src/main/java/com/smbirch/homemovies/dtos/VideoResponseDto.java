package com.smbirch.homemovies.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class VideoResponseDto {
  private Long id;

  private String title;

  private String url;

  private String filename;

  private String thumbnailurl;

  private String description;
}
