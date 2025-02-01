package com.smbirch.homemovies.mappers;

import com.smbirch.homemovies.dtos.VideoResponseDto;
import com.smbirch.homemovies.entities.Video;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-01-31T21:58:59-0700",
    comments = "version: 1.4.1.Final, compiler: javac, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class VideoMapperImpl implements VideoMapper {

    @Override
    public VideoResponseDto entityToDto(Video video) {
        if ( video == null ) {
            return null;
        }

        VideoResponseDto videoResponseDto = new VideoResponseDto();

        videoResponseDto.setId( video.getId() );
        videoResponseDto.setTitle( video.getTitle() );
        videoResponseDto.setUrl( video.getUrl() );
        videoResponseDto.setFilename( video.getFilename() );
        videoResponseDto.setThumbnailurl( video.getThumbnailurl() );
        videoResponseDto.setDescription( video.getDescription() );

        return videoResponseDto;
    }

    @Override
    public List<VideoResponseDto> entitiesToDtos(List<Video> videos) {
        if ( videos == null ) {
            return null;
        }

        List<VideoResponseDto> list = new ArrayList<VideoResponseDto>( videos.size() );
        for ( Video video : videos ) {
            list.add( entityToDto( video ) );
        }

        return list;
    }
}
