from typing import List, Optional
from pydantic import BaseModel, Field


class Doctor(BaseModel):
    name: str
    images: List[str] = Field(default_factory=list)
    specialization: Optional[str] = None
    experience_years: Optional[int] = Field(default=None, ge=0)



class Location(BaseModel):
    lat: Optional[float] = None
    lng: Optional[float] = None


class ConsultationFees(BaseModel):
    opd: Optional[int] = None
    emergency: Optional[int] = None
    icu_per_day: Optional[int] = None


class Timings(BaseModel):
    open: Optional[str] = None
    days: Optional[str] = None


class Contact(BaseModel):
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None


class Hospital(BaseModel):
    name: str
    slug: str 
    category: str
    about: Optional[str] = None
    address: Optional[str] = None

    location: Optional[Location] = None

    rating: Optional[float] = None
    total_reviews: Optional[int] = None

    images: List[str] = Field(default_factory=list)
    services: List[str] = Field(default_factory=list)
    facilities: List[str] = Field(default_factory=list)
    insurance_payment: List[str] = Field(default_factory=list)

    consultation_fees: Optional[ConsultationFees] = None
    timings: Optional[Timings] = None
    contact: Optional[Contact] = None
    doctors: List[Doctor] = Field(default_factory=list)

