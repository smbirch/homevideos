package com.smbirch.homemovies.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user_table")
@NoArgsConstructor
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Timestamp joined;

    private boolean deleted = false;

    @Embedded
    private Credentials credentials;

    @Embedded
    private Profile profile;

//    @Column(nullable = false)
//    private String passwordSalt;

    @ManyToMany
    @JoinTable(
            name = "user_likes",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "video_id"))
    private List<Video> likedVideos = new ArrayList<>();
}