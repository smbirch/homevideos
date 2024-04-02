package com.smbirch.homemovies.mappers;

import com.smbirch.homemovies.dtos.ProfileDto;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-04-02T15:33:43-0700",
    comments = "version: 1.4.1.Final, compiler: javac, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class ProfileMapperImpl implements ProfileMapper {

    @Override
    public ProfileDto entityToDto(Profile entity) {
        if ( entity == null ) {
            return null;
        }

        ProfileDto profileDto = new ProfileDto();

        return profileDto;
    }

    @Override
    public List<ProfileDto> entitiesToDtos(List<Profile> entities) {
        if ( entities == null ) {
            return null;
        }

        List<ProfileDto> list = new ArrayList<ProfileDto>( entities.size() );
        for ( Profile profile : entities ) {
            list.add( entityToDto( profile ) );
        }

        return list;
    }
}
