package com.journaltracker.repository;

import com.journaltracker.entity.Journal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface JournalRepository extends JpaRepository<Journal, Long> {
    Optional<Journal> findByName(String name);

    @Query("""
            SELECT j
            FROM Journal j
            WHERE (:search IS NULL OR LOWER(j.name) LIKE LOWER(CONCAT('%', :search, '%')))
              AND (:field IS NULL OR LOWER(j.field) = LOWER(:field))
            """)
    Page<Journal> searchJournals(
            @Param("search") String search,
            @Param("field") String field,
            Pageable pageable
    );
}
