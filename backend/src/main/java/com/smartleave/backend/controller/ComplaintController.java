package com.smartleave.backend.controller;

import com.smartleave.backend.dto.ComplaintDTO;
import com.smartleave.backend.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping
    public ResponseEntity<ComplaintDTO> raiseComplaint(@RequestBody ComplaintDTO request, Authentication authentication) {
        return ResponseEntity.ok(complaintService.raiseComplaint(authentication.getName(), request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ComplaintDTO>> getMyComplaints(Authentication authentication) {
        return ResponseEntity.ok(complaintService.getMyComplaints(authentication.getName()));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ComplaintDTO>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<ComplaintDTO> resolveComplaint(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.resolveComplaint(id));
    }
}
