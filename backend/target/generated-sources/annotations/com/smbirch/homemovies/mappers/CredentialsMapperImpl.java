package com.smbirch.homemovies.mappers;

import com.smbirch.homemovies.dtos.CredentialsDto;
import com.smbirch.homemovies.entities.Credentials;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-01-31T21:58:59-0700",
    comments = "version: 1.4.1.Final, compiler: javac, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class CredentialsMapperImpl implements CredentialsMapper {

    @Override
    public CredentialsDto entityToDto(Credentials entity) {
        if ( entity == null ) {
            return null;
        }

        CredentialsDto credentialsDto = new CredentialsDto();

        credentialsDto.setUsername( entity.getUsername() );
        credentialsDto.setPassword( entity.getPassword() );

        return credentialsDto;
    }
}
