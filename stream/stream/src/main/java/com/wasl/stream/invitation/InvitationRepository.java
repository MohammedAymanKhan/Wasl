package com.wasl.stream.invitation;

import com.wasl.stream.invitation.enums.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.*;

interface InvitationRepository extends JpaRepository<MeetingInvitationEntity, UUID> {
    @Query("SELECT mi.participantId FROM MeetingInvitationEntity mi WHERE mi.meetingId = :meetingId")
    Set<UUID> findParticipantIdsByMeetingId(@Param("meetingId") UUID meetingId);

    @Query("SELECT mi.meetingId FROM MeetingInvitationEntity mi WHERE mi.participantId = :participantId AND mi.status = :status")
    List<UUID> findByParticipantIdAndStatus(UUID participantId, InvitationStatus status);

    @Query("SELECT mi.meetingId, mi.participantId " +
            "FROM MeetingInvitationEntity mi " +
            "WHERE mi.meetingId IN :meetingIds " +
            "AND mi.status = :status")
    List<Object[]> findParticipantsRaw(List<UUID> meetingIds, InvitationStatus status);

    default Map<UUID, List<String>> findByMeetingIdAndStatus(List<UUID> meetingIds, InvitationStatus status) {
        List<Object[]> rawData = findParticipantsRaw(meetingIds, status);

        Map<UUID, List<String>> result = new HashMap<>();

        for (Object[] row : rawData) {
            UUID meetingId = (UUID) row[0];
            String participantId = row[1].toString();
            if(result.containsKey(meetingId)){
                result.get(meetingId).add(participantId);
            }else{
                result.put(meetingId, List.of(participantId));
            }
        }

        return result;
    }

}
