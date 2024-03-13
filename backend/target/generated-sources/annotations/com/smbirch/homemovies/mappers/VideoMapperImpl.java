package com.smbirch.homemovies.mappers;

import com.smbirch.homemovies.dtos.VideoResponseDto;
import com.smbirch.homemovies.entities.Video;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-03-12T21:02:24-0700",
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

        return videoResponseDto;
    }

    @Override
    public Video dtoToEntity(VideoResponseDto video) {
        if ( video == null ) {
            return null;
        }

        Video video1 = new Video();

        video1.setId( video.getId() );
        video1.setUrl( video.getUrl() );
        video1.setTitle( video.getTitle() );
        video1.setFilename( video.getFilename() );
        video1.setThumbnailurl( video.getThumbnailurl() );

        return video1;
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
