package com.smbirch.homemovies.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Data
public class Video {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String url;

  private String title;

  private String filename;

  private String description;

  private String thumbnailurl;

//  @ManyToMany(mappedBy = "likedVideos")
//  private List<User> likedByUsers = new ArrayList<>();

  @OneToMany(mappedBy = "video", cascade = CascadeType.ALL)
  @JsonManagedReference
  private List<Comment> comments = new ArrayList<>();
}