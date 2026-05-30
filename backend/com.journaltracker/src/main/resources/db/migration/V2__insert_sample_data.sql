INSERT INTO users (username,
                   email,
                   password_hash,
                   full_name,
                   role,
                   is_active,
                   created_at,
                   updated_at)
VALUES ('admin',
        'admin@journaltracker.com',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'System Administrator',
        'ADMIN',
        true,
        NOW(),
        NOW()),
       ('researcher01',
        'researcher01@gmail.com',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'Alice Johnson',
        'RESEARCHER',
        true,
        NOW(),
        NOW()),
       ('student01',
        'student01@gmail.com',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'Michael Smith',
        'STUDENT',
        true,
        NOW(),
        NOW());



INSERT INTO journals (name,
                      issn,
                      publisher,
                      field,
                      paper_count)
VALUES ('IEEE Transactions on Artificial Intelligence',
        '2691-4581',
        'IEEE',
        'Computer Science',
        120),
       ('Nature Machine Intelligence',
        '2522-5839',
        'Nature Publishing Group',
        'Artificial Intelligence',
        95),
       ('Springer Journal of Data Science',
        '2364-415X',
        'Springer',
        'Data Science',
        80);


INSERT INTO authors (name,
                     external_id,
                     affiliation)
VALUES ('Andrew Ng',
        'OA-001',
        'Stanford University'),
       ('Yann LeCun',
        'OA-002',
        'Meta AI'),
       ('Geoffrey Hinton',
        'OA-003',
        'University of Toronto'),
       ('Fei-Fei Li',
        'OA-004',
        'Stanford University'),
       ('Ian Goodfellow',
        'OA-005',
        'OpenAI');


INSERT INTO keywords (name,
                      usage_count)
VALUES ('Artificial Intelligence', 50),
       ('Machine Learning', 45),
       ('Deep Learning', 40),
       ('Neural Networks', 38),
       ('Computer Vision', 35),
       ('Natural Language Processing', 30),
       ('Data Mining', 25),
       ('Big Data', 20),
       ('Reinforcement Learning', 18),
       ('Generative AI', 15);



INSERT INTO research_topics (name,
                             description,
                             is_trending)
VALUES ('Artificial Intelligence',
        'Research related to intelligent systems and automation.',
        true),
       ('Natural Language Processing',
        'Research on machine understanding of human language.',
        true),
       ('Computer Vision',
        'Research related to image and video understanding.',
        false);


INSERT INTO research_papers (doi,
                             title,
                             abstract_text,
                             publication_year,
                             source_url,
                             source_api,
                             journal_id,
                             fetched_at,
                             created_at)
VALUES ('10.1000/182',
        'Advancements in Deep Learning Architectures',
        'A comprehensive review of modern deep learning architectures.',
        2024,
        'https://example.org/paper1',
        'OpenAlex',
        1,
        NOW(),
        NOW()),
       ('10.1000/183',
        'Transformer Models in NLP',
        'Exploring transformer-based architectures for NLP tasks.',
        2023,
        'https://example.org/paper2',
        'Crossref',
        2,
        NOW(),
        NOW()),
       ('10.1000/184',
        'Computer Vision in Autonomous Vehicles',
        'Applications of computer vision in self-driving systems.',
        2022,
        'https://example.org/paper3',
        'SemanticScholar',
        1,
        NOW(),
        NOW()),
       ('10.1000/185',
        'Big Data Analytics in Healthcare',
        'Using big data technologies in healthcare systems.',
        2024,
        'https://example.org/paper4',
        'OpenAlex',
        3,
        NOW(),
        NOW()),
       ('10.1000/186',
        'Generative AI and Future Applications',
        'Potential impacts of generative AI across industries.',
        2025,
        'https://example.org/paper5',
        'Crossref',
        2,
        NOW(),
        NOW());
INSERT INTO publication_trends (keyword_id,
                                year,
                                paper_count,
                                growth_rate)
VALUES (1, 2022, 120, 12.50),
       (1, 2023, 150, 25.00),
       (2, 2023, 100, 18.40),
       (3, 2024, 130, 30.00),
       (10, 2025, 200, 45.50);


INSERT INTO bookmarks (user_id,
                       paper_id,
                       created_at)
VALUES (2, 1, NOW()),
       (2, 2, NOW()),
       (3, 3, NOW());



INSERT INTO notifications (user_id,
                           title,
                           message,
                           is_read,
                           created_at)
VALUES (2,
        'Trending Topic Alert',
        'Artificial Intelligence is trending this week.',
        false,
        NOW()),
       (3,
        'New Research Paper',
        'A new paper about Generative AI has been published.',
        false,
        NOW());



INSERT INTO follows (user_id,
                     follow_type,
                     target_id,
                     created_at)
VALUES (2, 'JOURNAL', 1, NOW()),
       (2, 'KEYWORD', 1, NOW()),
       (3, 'AUTHOR', 2, NOW());


INSERT INTO api_data_sources (name,
                              base_url,
                              api_key,
                              is_active,
                              last_sync_at)
VALUES ('OpenAlex',
        'https://api.openalex.org',
        NULL,
        true,
        NOW()),
       ('Crossref',
        'https://api.crossref.org',
        NULL,
        true,
        NOW()),
       ('Semantic Scholar',
        'https://api.semanticscholar.org',
        NULL,
        true,
        NOW());


INSERT INTO paper_authors (paper_id,
                           author_id)
VALUES (1, 1),
       (1, 2),
       (2, 2),
       (2, 3),
       (3, 4),
       (4, 5),
       (5, 1);


INSERT INTO paper_keywords (paper_id,
                            keyword_id)
VALUES (1, 2),
       (1, 3),
       (2, 6),
       (2, 3),
       (3, 5),
       (4, 8),
       (5, 10);


INSERT INTO topic_keywords (topic_id,
                            keyword_id)
VALUES (1, 1),
       (1, 2),
       (1, 3),
       (2, 6),
       (3, 5);