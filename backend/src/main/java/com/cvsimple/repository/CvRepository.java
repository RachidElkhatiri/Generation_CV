package com.cvsimple.repository;

import com.cvsimple.entity.CV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CvRepository extends JpaRepository<CV, Long> {
}
