package com.smbirch.homemovies.mappers;

import com.smbirch.homemovies.dtos.ProfileDto;
import javax.annotation.processing.Generated;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-09-03T19:06:48-0700",
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
}
