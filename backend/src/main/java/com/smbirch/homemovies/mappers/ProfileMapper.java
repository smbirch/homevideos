package com.smbirch.homemovies.mappers;

import com.smbirch.homemovies.dtos.ProfileDto;
import org.mapstruct.Mapper;
import org.springframework.context.annotation.Profile;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    ProfileDto entityToDto(Profile entity);

}