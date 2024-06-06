package com.smbirch.homemovies.mappers;

import com.smbirch.homemovies.dtos.ProfileDto;
import javax.annotation.processing.Generated;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-06-05T20:40:04-0700",
    comments = "version: 1.4.1.Final, compiler: javac, environment: Java 22 (Homebrew)"
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
}
