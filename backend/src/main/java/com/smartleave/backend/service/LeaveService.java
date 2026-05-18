package com.smartleave.backend.service;

import com.smartleave.backend.dto.LeaveRequestDTO;
import com.smartleave.backend.entity.LeaveRequest;
import com.smartleave.backend.entity.User;
import com.smartleave.backend.repository.LeaveRequestRepository;
import com.smartleave.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveService {

    private final LeaveRequestRepository leaveRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public LeaveService(LeaveRequestRepository leaveRepository, UserRepository userRepository, EmailService emailService) {
        this.leaveRepository = leaveRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public LeaveRequestDTO applyLeave(String email, LeaveRequestDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LeaveRequest leave = LeaveRequest.builder()
                .user(user)
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .reason(dto.getReason())
                .status(LeaveRequest.LeaveStatus.PENDING)
                .build();
        
        leaveRepository.save(leave);
        
        return mapToDTO(leave);
    }

    public List<LeaveRequestDTO> getMyLeaves(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return leaveRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<LeaveRequestDTO> getAllLeaves() {
        return leaveRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public LeaveRequestDTO updateLeaveStatus(Long id, String status) {
        LeaveRequest leave = leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));
        
        LeaveRequest.LeaveStatus newStatus = LeaveRequest.LeaveStatus.valueOf(status.toUpperCase());
        leave.setStatus(newStatus);
        leaveRepository.save(leave);
        
        if (newStatus == LeaveRequest.LeaveStatus.APPROVED || newStatus == LeaveRequest.LeaveStatus.REJECTED) {
            emailService.sendLeaveApprovalEmail(leave.getUser().getEmail(), leave.getUser().getName(), newStatus.name());
        }
        
        return mapToDTO(leave);
    }

    private LeaveRequestDTO mapToDTO(LeaveRequest leave) {
        return LeaveRequestDTO.builder()
                .id(leave.getId())
                .applicantName(leave.getUser().getName())
                .startDate(leave.getStartDate())
                .endDate(leave.getEndDate())
                .reason(leave.getReason())
                .status(leave.getStatus().name())
                .build();
    }
}
