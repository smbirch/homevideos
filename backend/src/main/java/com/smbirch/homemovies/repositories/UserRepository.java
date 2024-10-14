package com.smbirch.homemovies.repositories;

import com.smbirch.homemovies.entities.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByCredentials_Username(String username);

  boolean existsByCredentials_Username(String username);
}
