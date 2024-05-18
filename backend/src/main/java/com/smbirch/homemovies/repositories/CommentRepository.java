package com.smbirch.homemovies.repositories;

import com.smbirch.homemovies.entities.Comment;
import org.hibernate.annotations.Comments;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByVideoId(Long videoId);
}