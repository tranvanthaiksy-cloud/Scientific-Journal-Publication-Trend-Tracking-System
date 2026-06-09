package com.journaltracker.service;

import com.journaltracker.dto.RawPaperData;
import com.journaltracker.entity.Keyword;
import com.journaltracker.entity.ResearchPaper;
import com.journaltracker.repository.KeywordRepository;
import com.journaltracker.repository.PaperRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Slf4j
@AllArgsConstructor
public class DeduplicationService {
    private final PaperRepository paperRepository;
    private final KeywordRepository keywordRepository;
    @Transactional
    public boolean deduplicateAndMerge(RawPaperData rawPaperData, String sourceName) {
        Optional<ResearchPaper> existingPaperOpt = findDuplicate(rawPaperData);
        if (existingPaperOpt.isPresent()) {
            ResearchPaper existingPaper = existingPaperOpt.get();
            boolean isMerged = false;
            if ((existingPaper.getAbstractText() == null || existingPaper.getAbstractText().isBlank())
                    && rawPaperData.getAbstractText() != null && !rawPaperData.getAbstractText().isBlank()) {
                existingPaper.setAbstractText(rawPaperData.getAbstractText());
                isMerged = true;
            }

            if (rawPaperData.getKeywords() != null && !rawPaperData.getKeywords().isEmpty()) {
                for (String rawKw : rawPaperData.getKeywords()) {
                    if (rawKw == null || rawKw.isBlank()) continue;
                    String cleanKw = rawKw.trim();
                    boolean alreadyHasKeyword = existingPaper.getKeywords().stream()
                            .anyMatch(k -> k.getName().equalsIgnoreCase(cleanKw));
                    if (!alreadyHasKeyword) {
                        Keyword keyword = keywordRepository.findByNameIgnoreCase(cleanKw)
                                .orElseGet(() -> {
                                    Keyword newKw = new Keyword();
                                    newKw.setName(cleanKw);
                                    newKw.setUsageCount(0);
                                    return keywordRepository.save(newKw);
                                });

                        keyword.setUsageCount((keyword.getUsageCount() == null ? 0 : keyword.getUsageCount()) + 1);
                        keywordRepository.save(keyword);

                        existingPaper.getKeywords().add(keyword);
                        isMerged = true;
                    }
                }
            }

            String paperIdentifier = existingPaper.getDoi() != null ? existingPaper.getDoi() : existingPaper.getTitle();
            if (isMerged) {
                paperRepository.save(existingPaper);
                log.info("[Dedup] Paper [{}] already exists, merged additional data from [{}]", paperIdentifier, sourceName);
            } else {
                log.info("[Dedup] Paper [{}] already exists, no new data to merge from [{}]", paperIdentifier, sourceName);
            }
            return true;
        }

        return false;
    }

    private Optional<ResearchPaper> findDuplicate(RawPaperData rawPaperData) {
        if (rawPaperData.getDoi() != null && !rawPaperData.getDoi().isBlank()) {
            Optional<ResearchPaper> paper = paperRepository.findByDoi(rawPaperData.getDoi().trim());
            if (paper.isPresent()) {
                return paper;
            }
        }
        if (rawPaperData.getTitle() != null && !rawPaperData.getTitle().isBlank()) {
            Optional<ResearchPaper> paperOpt = paperRepository.findByTitleIgnoreCase(rawPaperData.getTitle().trim());
            if (paperOpt.isPresent()) {
                return paperOpt;
            }
        }
        return Optional.empty();
    }

}
