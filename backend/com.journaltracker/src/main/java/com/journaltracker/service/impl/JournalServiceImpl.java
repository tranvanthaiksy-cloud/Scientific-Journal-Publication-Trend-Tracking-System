package com.journaltracker.service.impl;

import com.journaltracker.dto.response.JournalDetailResponse;
import com.journaltracker.dto.response.JournalResponse;
import com.journaltracker.dto.response.PaperSummaryResponse;
import com.journaltracker.entity.Follow;
import com.journaltracker.entity.FollowType;
import com.journaltracker.entity.Journal;
import com.journaltracker.exception.ResourceNotFoundException;
import com.journaltracker.mapper.JournalMapper;
import com.journaltracker.mapper.PaperMapper;
import com.journaltracker.repository.FollowRepository;
import com.journaltracker.repository.JournalRepository;
import com.journaltracker.repository.PaperRepository;
import com.journaltracker.service.JournalService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JournalServiceImpl implements JournalService {

    private final JournalRepository journalRepository;
    private final PaperRepository paperRepository;
    private final FollowRepository followRepository;
    private final JournalMapper journalMapper;
    private final PaperMapper paperMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<JournalResponse> getAllJournals(
            Pageable pageable
    ) {

        return journalRepository.findAll(pageable)
                .map(journalMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JournalResponse> searchJournals(
            String search,
            String field,
            Pageable pageable
    ) {

        return journalRepository.searchJournals(
                        normalize(search),
                        normalize(field),
                        pageable
                )
                .map(journalMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public JournalDetailResponse getJournalById(
            Long id
    ) {

        return getJournalById(id, null);
    }

    @Override
    @Transactional(readOnly = true)
    public JournalDetailResponse getJournalById(
            Long id,
            String currentUsername
    ) {

        Journal journal = journalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Journal not found with id: " + id
                ));

        boolean isFollowed = currentUsername != null
                && followRepository.existsByUserUsernameAndFollowTypeAndTargetId(
                        currentUsername,
                String.valueOf(FollowType.JOURNAL),
                        id
                );

        return journalMapper.toDetailResponse(
                journal,
                isFollowed
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PaperSummaryResponse> getPapersByJournal(
            Long journalId,
            Pageable pageable
    ) {

        if (!journalRepository.existsById(journalId)) {
            throw new ResourceNotFoundException(
                    "Journal not found with id: " + journalId
            );
        }

        return paperRepository.findByJournalId(journalId, pageable)
                .map(paperMapper::toSummaryResponse);
    }

    private String normalize(
            String value
    ) {

        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}
