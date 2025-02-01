package com.smbirch.homemovies.mappers;

import com.smbirch.homemovies.dtos.VideoResponseDto;
import com.smbirch.homemovies.entities.Video;
import java.util.List;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface VideoMapper {
  VideoResponseDto entityToDto(Video video);

  List<VideoResponseDto> entitiesToDtos(List<Video> videos);
}
