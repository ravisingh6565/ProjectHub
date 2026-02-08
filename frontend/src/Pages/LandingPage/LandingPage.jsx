import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@mui/material';
import { Code, Laptop, Cloud, Mouse, ArrowDownward } from '@mui/icons-material';
import Storage from "@mui/icons-material/Storage";
// import LogIn from '../LogIn/LogIn';
import { Link } from 'react-router-dom';
const snipted = String.raw`<div class="homepage">
  <!-- Hero Section -->
  <div class="hero-section">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <h1 class="hero-title">Experience Luxury Redefined</h1>
      <p class="hero-subtitle">Discover unparalleled comfort in the heart of elegance</p>
    </div>
  </div>

  <!-- Search Section -->
  <div class="search-container">
    <div class="search-wrapper">
      <h2 class="search-title">Find Your Perfect Stay</h2>
      
      <form [formGroup]="searchForm" class="search-form">
        <div class="form-grid">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Check-in</mat-label>
            <input matInput [matDatepicker]="pickerIn" formControlName="checkIn" [min]="minDate">
            <mat-datepicker-toggle matIconSuffix [for]="pickerIn"></mat-datepicker-toggle>
            <mat-datepicker #pickerIn></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Check-out</mat-label>
            <input matInput [matDatepicker]="pickerOut" formControlName="checkOut" [min]="searchForm.get('checkIn')?.value || minDate">
            <mat-datepicker-toggle matIconSuffix [for]="pickerOut"></mat-datepicker-toggle>
            <mat-datepicker #pickerOut></mat-datepicker>
            <mat-error *ngIf="!isCheckOutValid()">Check-out must be after check-in</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Adults</mat-label>
            <input matInput type="number" formControlName="adults" min="1">
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Children</mat-label>
            <input matInput type="number" formControlName="children" min="0">
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Room Type</mat-label>
            <mat-select formControlName="roomType">
              <mat-option *ngFor="let type of roomTypes" [value]="type">
                {{ type }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <div class="search-actions">
            <button mat-raised-button color="primary" class="search-btn" 
                    (click)="onSearch()" 
                    [disabled]="!searchForm.valid || !isCheckOutValid()">
              <mat-icon>search</mat-icon>
              Search Rooms
            </button>
            <button mat-stroked-button class="reset-btn" (click)="resetSearch()" *ngIf="isSearched">
              <mat-icon>refresh</mat-icon>
              Reset
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <!-- Results Section -->
  <div class="rooms-section">
    <div class="section-header">
      <h2 class="section-title">
        {{ isSearched ? 'Available Rooms' : 'Our Exquisite Rooms' }}
      </h2>
      <p class="section-subtitle" *ngIf="!isSearched">
        Choose from our carefully curated selection of luxury accommodations
      </p>
    </div>

    <div class="rooms-grid" *ngIf="filteredRooms.length > 0">
      <mat-card class="room-card" *ngFor="let room of filteredRooms">
        <div class="room-image-container">
          <img [src]="room.image" [alt]="room.name" class="room-image">
          <div class="room-type-badge">{{ room.roomType }}</div>
        </div>
        
        <mat-card-content class="room-content">
          <h3 class="room-name">{{ room.name }}</h3>
          <p class="room-description">{{ room.description }}</p>
          
          <div class="room-details">
            <div class="detail-item">
              <mat-icon>king_bed</mat-icon>
              <span>{{ room.bedType }}</span>
            </div>
            <div class="detail-item">
              <mat-icon>square_foot</mat-icon>
              <span>{{ room.size }}</span>
            </div>
            <div class="detail-item">
              <mat-icon>people</mat-icon>
              <span>{{ room.maxAdults }} Adults, {{ room.maxChildren }} Children</span>
            </div>
          </div>

          <div class="amenities">
            <mat-chip-set>
              <mat-chip *ngFor="let amenity of room.amenities.slice(0, 3)">
                {{ amenity }}
              </mat-chip>
              <mat-chip *ngIf="room.amenities.length > 3" class="more-chip">
                +{{ room.amenities.length - 3 }} more
              </mat-chip>
            </mat-chip-set>
          </div>

          <div class="room-footer">
            <div class="price-section">
              <span class="price-label">From</span>
              <span class="price">${{ room.price }}</span>
              <span class="price-suffix">/ night</span>
            </div>
            <button mat-raised-button color="primary" class="book-btn" (click)="bookRoom(room)">
              Book Now
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>

    <div class="no-results" *ngIf="filteredRooms.length === 0 && isSearched">
      <mat-icon class="no-results-icon">hotel</mat-icon>
      <h3>No Rooms Available</h3>
      <p>We couldn't find any rooms matching your criteria. Please try different dates or room type.</p>
      <button mat-raised-button color="primary" (click)="resetSearch()">
        View All Rooms
      </button>
    </div>
  </div>
</div>
`;
const GlowingOrb = ({ delay = 0, color1, color2, size = 200 }) => (
  <div 
    className="absolute rounded-full animate-pulse blur-xl opacity-20"
    style={{
      background: `radial-gradient(circle at center, ${color1}, ${color2})`,
      width: `${size}px`,
      height: `${size}px`,
      left: `${Math.random() * 90}%`,
      top: `${Math.random() * 90}%`,
      animationDelay: `${delay}s`,
      transform: 'translate(-50%, -50%)',
      transitionDelay:'0.05s'
    }}
  />
);

const FloatingIcon = ({ Icon, position, parallaxStrength = 1, color, delay = 0 }) => {
  const [hover, setHover] = useState(false);
  
  return (
    <div 
      className={`absolute transition-transform duration-500 cursor-pointer
        ${hover ? 'scale-150' : 'scale-100'}`}
      style={{
        ...position,
        transform: `translate(${position.translateX}px, ${position.translateY}px)`,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Icon 
        className={`w-12 h-12 transition-all duration-500`}
        style={{
          color: color,
          opacity: hover ? 0.4 : 0.2,
          animation: `float ${15 + delay}s ease-in-out infinite`,
          animationDelay: `${delay}s`
        }}
      />
    </div>
  );
};

const ScrollIndicator = () => (
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
    <div className="flex flex-col items-center text-white/50">
      <Mouse className="mb-2" />
      <ArrowDownward />
    </div>
  </div>
);

const LandingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mounted, setMounted] = useState(false);

  const handleMouseMove = useCallback((e) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth - 0.5) * 40,
      y: (e.clientY / window.innerHeight - 0.5) * 40,
    });
  }, []);

  const handleScroll = useCallback(() => {
    setScrollPosition(window.scrollY);
  }, []);

  useEffect(() => {
    setMounted(true);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleMouseMove, handleScroll]);

  const parallaxIcons = [
    { Icon: Code, color: '#60A5FA', position: { left: '20%', top: '30%' }, strength: 1.2, delay: 0 },
    { Icon: Laptop, color: '#A78BFA', position: { left: '70%', top: '20%' }, strength: 1.5, delay: 2 },
    { Icon: Storage, color: '#818CF8', position: { left: '85%', top: '60%' }, strength: 2, delay: 4 },
    { Icon: Cloud, color: '#7DD3FC', position: { left: '15%', top: '70%' }, strength: 0.8, delay: 6 },
    { Icon: Cloud, color: '#38BDF8', position: { left: '60%', top: '80%' }, strength: 1.3, delay: 8 }
  ];

  const glowingOrbs = [
    { color1: '#4F46E5', color2: '#2563EB', size: 300, delay: 0 },
    { color1: '#7C3AED', color2: '#4F46E5', size: 250, delay: 2 },
    { color1: '#2563EB', color2: '#3B82F6', size: 200, delay: 4 },
    { color1: '#06B6D4', color2: '#0EA5E9', size: 350, delay: 6 },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem]"
          style={{
            transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)`,
            transition: 'transform 0.2s ease-out'
          }}
        />

        {/* Glowing Orbs */}
        {glowingOrbs.map((orb, i) => (
          <GlowingOrb key={i} {...orb} />
        ))}

        {/* Floating Icons with Parallax Effect */}
        {parallaxIcons.map((icon, i) => (
          <FloatingIcon
            key={i}
            Icon={icon.Icon}
            position={{
              ...icon.position,
              translateX: mousePosition.x * icon.strength,
              translateY: mousePosition.y * icon.strength
            }}
            color={icon.color}
            delay={icon.delay}
          />
        ))}
      </div>

      {/* Navigation Bar */}
      <nav 
        className="fixed top-0 w-full px-6 py-4 backdrop-blur-sm z-50 transition-all duration-300"
        style={{
          backgroundColor: `rgba(15, 23, 42, ${Math.min(scrollPosition / 500, 0.9)})`
        }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Project Hub
          </span>
          <div className="flex gap-4 items-center">
            {/* <a href="#features" className="text-white/70 hover:text-white transition-colors">Features</a>
            <a href="#explore" className="text-white/70 hover:text-white transition-colors">Explore</a> */}
            <Link to="/login"><Button 
              variant="outlined" 
              className="bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm border-white/20"
            >
              Login
            </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-4xl mx-auto">
          <h1 
            className={`text-5xl md:text-7xl font-bold mb-6 text-white transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Showcase Your{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Amazing Projects
            </span>
          </h1>
          <p 
            className={`text-xl text-gray-300 mb-12 transition-all duration-1000 delay-300 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Connect with creators and explore diverse projects in our vibrant community. 
          </p>

            <pre className="text-sm text-gray-200 bg-black/40 p-4 rounded-lg overflow-x-auto">
    <code>{snipted}</code>
  </pre>
          <div 
            className={`flex gap-6 justify-center transition-all duration-1000 delay-500 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* <Button 
              variant="contained" 
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 
                text-white px-8 py-3 transform hover:scale-105 transition-all duration-300"
            >
              Get Started
            </Button> */}
           <Link to="/home"> <Button 
              variant="outlined" 
              className="border-purple-400 text-purple-400 hover:bg-purple-400/10 px-8 py-3
                transform hover:scale-105 transition-all duration-300"
            >
              Explore Projects
            </Button>
            </Link>
          </div>
        </div>
       <Link to="/home"> <ScrollIndicator /></Link>
      </div>
    </div>
  );
};

export default LandingPage;
