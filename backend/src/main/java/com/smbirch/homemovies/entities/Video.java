package com.smbirch.homemovies.entities;

import jakarta.persistence.*;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@Data
public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;

    private String title;

    @Getter
    private String thumbnailurl;

    @ManyToMany(mappedBy = "likedVideos")
    private List<User> likedByUsers = new ArrayList<>();

}