
CREATE TABLE meeting_invitations (
    id BINARY(16) PRIMARY KEY,
    meeting_id BINARY(16) NOT NULL,
    owner_id BINARY(16) NOT NULL,
    participant_id BINARY(16) NOT NULL,
    status ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (meeting_id),
    INDEX (participant_id)
);

CREATE TABLE notifications (
    id BINARY(16) PRIMARY KEY,
    user_id BINARY(16) NOT NULL,
    type ENUM('INVITATION', 'RESPONSE') NOT NULL,
    invitation BINARY(16) NOT NULL,
    message MEDIUMTEXT,
    status ENUM('UNREAD', 'READ') DEFAULT 'UNREAD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (user_id),
    FOREIGN KEY (invitation) REFERENCES meeting_invitations(id)
);

