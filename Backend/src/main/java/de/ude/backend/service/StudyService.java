package de.ude.backend.service;


import de.ude.backend.model.Study;
import de.ude.backend.service.repository.StudyRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class StudyService {
    private final StudyRepo studyRepo;

    public Study createStudy(Study study) {
        return studyRepo.save(study);
    }

    public void deleteAllStudies() {
        studyRepo.deleteAll();
    }

    public Study getTestStudy() {
        return studyRepo.findAll().iterator().next();
    }

    public boolean doesStudyExist(String studyId) {
        Optional<Study> study = studyRepo.findById(studyId);
        return study.isPresent();
    }

    public Study getStudyByStudyId(String studyId) {
        return studyRepo.findById(studyId).orElseThrow(() -> new RuntimeException("Study not found"));
    }
}
