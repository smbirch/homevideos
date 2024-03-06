package com.smbirch.homemovies.mappers;

import com.smbirch.homemovies.dtos.CredentialsDto;
import com.smbirch.homemovies.entities.Credentials;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-03-04T21:53:38-0800",
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

    @Override
    public List<CredentialsDto> entitiesToDtos(List<Credentials> entities) {
        if ( entities == null ) {
            return null;
        }

        List<CredentialsDto> list = new ArrayList<CredentialsDto>( entities.size() );
        for ( Credentials credentials : entities ) {
            list.add( entityToDto( credentials ) );
        }

        return list;
    }
}
