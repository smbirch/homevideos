package com.smbirch.homemovies.mappers;

import com.smbirch.homemovies.dtos.UserRequestDto;
import com.smbirch.homemovies.dtos.UserResponseDto;
import com.smbirch.homemovies.entities.User;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
    componentModel = "spring",
    uses = {ProfileMapper.class, CredentialsMapper.class})
public interface UserMapper {
  @Mapping(target = "username", source = "credentials.username")
  UserResponseDto entityToDto(User user);

  User responseDtoToEntity(UserResponseDto userResponseDto);

  User requestDtoToEntity(UserRequestDto userRequestDto);

  List<UserResponseDto> entitiesToDtos(List<User> users);
}
