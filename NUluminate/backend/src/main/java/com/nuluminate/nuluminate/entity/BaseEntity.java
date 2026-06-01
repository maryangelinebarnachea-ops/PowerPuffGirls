package com.nuluminate.nuluminate.entity;
import jakarta.persistence.*;
import java.time.Instant;
@MappedSuperclass
public abstract class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
}
