package com.smbirch.homemovies.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class VideoRequestDto {
  private Long id;

  private String title;

  private String description;
}
