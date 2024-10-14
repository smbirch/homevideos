package com.smbirch.homemovies.entities;

import jakarta.annotation.Nonnull;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@NoArgsConstructor
@Data
public class Profile {

  private String firstName;

  private String lastName;

  @Nonnull private String email;

  private boolean admin;
}
