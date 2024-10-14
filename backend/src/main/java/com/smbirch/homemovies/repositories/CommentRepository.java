package com.smbirch.homemovies.repositories;

import com.smbirch.homemovies.entities.Comment;
import java.util.ArrayList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
  ArrayList<Comment> findByVideoId(Long videoId);
}
