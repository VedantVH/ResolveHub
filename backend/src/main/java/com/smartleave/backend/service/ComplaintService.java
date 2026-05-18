package com.smartleave.backend.service;

import com.smartleave.backend.dto.ComplaintDTO;
import com.smartleave.backend.entity.Complaint;
import com.smartleave.backend.entity.User;
import com.smartleave.backend.repository.ComplaintRepository;
import com.smartleave.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public ComplaintService(ComplaintRepository complaintRepository, UserRepository userRepository, EmailService emailService) {
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public ComplaintDTO raiseComplaint(String email, ComplaintDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Complaint complaint = Complaint.builder()
                .user(user)
                .subject(dto.getSubject())
                .description(dto.getDescription())
                .status(Complaint.ComplaintStatus.OPEN)
                .build();

        complaintRepository.save(complaint);
        
        return mapToDTO(complaint);
    }

    public List<ComplaintDTO> getMyComplaints(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return complaintRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ComplaintDTO> getAllComplaints() {
        return complaintRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ComplaintDTO resolveComplaint(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        
        complaint.setStatus(Complaint.ComplaintStatus.RESOLVED);
        complaintRepository.save(complaint);
        
        emailService.sendComplaintResolutionEmail(complaint.getUser().getEmail(), complaint.getUser().getName(), complaint.getSubject());
        
        return mapToDTO(complaint);
    }

    private ComplaintDTO mapToDTO(Complaint complaint) {
        return ComplaintDTO.builder()
                .id(complaint.getId())
                .applicantName(complaint.getUser().getName())
                .subject(complaint.getSubject())
                .description(complaint.getDescription())
                .status(complaint.getStatus().name())
                .createdAt(complaint.getCreatedAt())
                .build();
    }
}
