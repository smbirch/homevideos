package com.smbirch.homemovies.mappers;

import com.smbirch.homemovies.dtos.VideoResponseDto;
import com.smbirch.homemovies.entities.Video;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface VideoMapper {
    VideoResponseDto entityToDto(Video video);

    List<VideoResponseDto> entitiesToDtos(List<Video> videos);
}