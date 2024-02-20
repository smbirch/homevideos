package com.smbirch.homemovies.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "user_table")
@NoArgsConstructor
@Data
public class User {
    @Id
    @GeneratedValue
    private Long id;

    @CreationTimestamp
    private Timestamp joined;

    private boolean deleted = false;

    private boolean admin = false;

    @Embedded
    private Credentials credentials;

    @Embedded
    private Profile profile;
}