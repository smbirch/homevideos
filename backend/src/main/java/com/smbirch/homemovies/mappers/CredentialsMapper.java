package com.smbirch.homemovies.mappers;

import com.smbirch.homemovies.dtos.CredentialsDto;
import com.smbirch.homemovies.entities.Credentials;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CredentialsMapper {
  CredentialsDto entityToDto(Credentials entity);
}
