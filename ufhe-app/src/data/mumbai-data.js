// ═══════════════════════════════════════════════
// UFHE — Mumbai City Seed Data
// ═══════════════════════════════════════════════

const MUMBAI_CENTER = { lat: 19.076, lng: 72.8777 };
const MUMBAI_BOUNDS = { north: 19.27, south: 18.89, east: 72.98, west: 72.77 };

const WARD_DATA = [
    { id: 1, name: "A Ward (Fort/Colaba)", code: "A", zone: "South", lat: 18.922, lng: 72.833, area: 7.73, pop: 182403, pmrs: 72, grade: "B" },
    { id: 2, name: "B Ward (Dongri/Sandhurst)", code: "B", zone: "South", lat: 18.944, lng: 72.839, area: 4.18, pop: 126348, pmrs: 55, grade: "C" },
    { id: 3, name: "C Ward (Marine Lines)", code: "C", zone: "South", lat: 18.945, lng: 72.824, area: 5.12, pop: 162874, pmrs: 68, grade: "B" },
    { id: 4, name: "D Ward (Grant Road)", code: "D", zone: "South", lat: 18.963, lng: 72.818, area: 4.70, pop: 348201, pmrs: 48, grade: "C" },
    { id: 5, name: "E Ward (Byculla)", code: "E", zone: "Central", lat: 18.978, lng: 72.833, area: 7.85, pop: 432178, pmrs: 42, grade: "C" },
    { id: 6, name: "F/N Ward (Matunga)", code: "F/N", zone: "Central", lat: 19.022, lng: 72.848, area: 8.31, pop: 512345, pmrs: 61, grade: "B" },
    { id: 7, name: "F/S Ward (Parel)", code: "F/S", zone: "Central", lat: 19.003, lng: 72.841, area: 6.14, pop: 387623, pmrs: 38, grade: "D" },
    { id: 8, name: "G/N Ward (Dadar)", code: "G/N", zone: "Central", lat: 19.018, lng: 72.843, area: 9.07, pop: 562819, pmrs: 65, grade: "B" },
    { id: 9, name: "G/S Ward (Worli)", code: "G/S", zone: "Central", lat: 19.007, lng: 72.818, area: 7.92, pop: 410352, pmrs: 52, grade: "C" },
    { id: 10, name: "H/E Ward (Khar/Santacruz)", code: "H/E", zone: "Western", lat: 19.065, lng: 72.838, area: 11.32, pop: 623487, pmrs: 44, grade: "C" },
    { id: 11, name: "H/W Ward (Bandra West)", code: "H/W", zone: "Western", lat: 19.058, lng: 72.827, area: 9.45, pop: 485213, pmrs: 71, grade: "B" },
    { id: 12, name: "K/E Ward (Andheri East)", code: "K/E", zone: "Western", lat: 19.115, lng: 72.858, area: 14.76, pop: 893421, pmrs: 35, grade: "D" },
    { id: 13, name: "K/W Ward (Andheri West)", code: "K/W", zone: "Western", lat: 19.125, lng: 72.835, area: 13.42, pop: 745832, pmrs: 58, grade: "C" },
    { id: 14, name: "P/N Ward (Malad)", code: "P/N", zone: "Western", lat: 19.185, lng: 72.843, area: 16.23, pop: 1023456, pmrs: 29, grade: "D" },
    { id: 15, name: "L Ward (Kurla)", code: "L", zone: "Eastern", lat: 19.072, lng: 72.877, area: 12.89, pop: 876543, pmrs: 33, grade: "D" },
    { id: 16, name: "M/E Ward (Chembur)", code: "M/E", zone: "Eastern", lat: 19.057, lng: 72.898, area: 15.32, pop: 687234, pmrs: 47, grade: "C" },
    { id: 17, name: "M/W Ward (Mahim)", code: "M/W", zone: "Central", lat: 19.037, lng: 72.844, area: 8.76, pop: 523918, pmrs: 56, grade: "C" },
    { id: 18, name: "N Ward (Ghatkopar)", code: "N", zone: "Eastern", lat: 19.087, lng: 72.907, area: 13.67, pop: 812345, pmrs: 41, grade: "C" },
    { id: 19, name: "S Ward (Borivali)", code: "S", zone: "Western", lat: 19.229, lng: 72.856, area: 19.45, pop: 1234567, pmrs: 62, grade: "B" },
    { id: 20, name: "T Ward (Mulund)", code: "T", zone: "Eastern", lat: 19.172, lng: 72.955, area: 17.82, pop: 945123, pmrs: 54, grade: "C" },
    { id: 21, name: "R/C Ward (Kandivali)", code: "R/C", zone: "Western", lat: 19.205, lng: 72.852, area: 14.31, pop: 876521, pmrs: 39, grade: "D" },
    { id: 22, name: "R/S Ward (Dahisar)", code: "R/S", zone: "Western", lat: 19.245, lng: 72.862, area: 12.67, pop: 723456, pmrs: 45, grade: "C" },
    { id: 23, name: "P/S Ward (Goregaon)", code: "P/S", zone: "Western", lat: 19.162, lng: 72.849, area: 13.89, pop: 812678, pmrs: 51, grade: "C" },
    { id: 24, name: "R/N Ward (Dahisar North)", code: "R/N", zone: "Western", lat: 19.255, lng: 72.855, area: 11.45, pop: 645321, pmrs: 43, grade: "C" },
];

const HOTSPOT_DATA = [
    { id: 1, code: 'HS-001', name: 'Hindmata Junction', ward: 'F/S', lat: 19.0045, lng: 72.8425, fvi: 0.94, severity: 'VERY_HIGH', depth: 120, deficit: 72, pop: 45000, critical: 3, history: 18 },
    { id: 2, code: 'HS-002', name: 'Milan Subway', ward: 'K/W', lat: 19.1212, lng: 72.8401, fvi: 0.91, severity: 'VERY_HIGH', depth: 95, deficit: 65, pop: 32000, critical: 2, history: 15 },
    { id: 3, code: 'HS-003', name: 'Sion-King Circle', ward: 'F/N', lat: 19.0421, lng: 72.8623, fvi: 0.89, severity: 'VERY_HIGH', depth: 110, deficit: 68, pop: 38000, critical: 4, history: 16 },
    { id: 4, code: 'HS-004', name: 'Matunga (Five Gardens)', ward: 'F/N', lat: 19.0252, lng: 72.8512, fvi: 0.87, severity: 'VERY_HIGH', depth: 85, deficit: 58, pop: 28000, critical: 2, history: 14 },
    { id: 5, code: 'HS-005', name: 'Andheri Subway', ward: 'K/E', lat: 19.1195, lng: 72.8467, fvi: 0.86, severity: 'VERY_HIGH', depth: 95, deficit: 63, pop: 52000, critical: 3, history: 17 },
    { id: 6, code: 'HS-006', name: 'K/W Sub-Area 6', ward: 'K/W', lat: 19.1359, lng: 72.8352, fvi: 0.25, severity: 'LOW', depth: 12, deficit: 57, pop: 11571, critical: 1, history: 9 },
    { id: 7, code: 'HS-007', name: 'K/E Sub-Area 7', ward: 'K/E', lat: 19.0837, lng: 72.8186, fvi: 0.63, severity: 'HIGH', depth: 84, deficit: 11, pop: 36187, critical: 2, history: 5 },
    { id: 8, code: 'HS-008', name: 'F/N Sub-Area 8', ward: 'F/N', lat: 19.046, lng: 72.8936, fvi: 0.21, severity: 'LOW', depth: 27, deficit: 59, pop: 2141, critical: 2, history: 3 },
    { id: 9, code: 'HS-009', name: 'F/S Sub-Area 9', ward: 'F/S', lat: 18.9745, lng: 72.8296, fvi: 0.75, severity: 'HIGH', depth: 63, deficit: 69, pop: 12704, critical: 3, history: 3 },
    { id: 10, code: 'HS-010', name: 'K/W Sub-Area 10', ward: 'K/W', lat: 19.1568, lng: 72.8286, fvi: 0.88, severity: 'VERY_HIGH', depth: 56, deficit: 62, pop: 45339, critical: 2, history: 10 },
    { id: 11, code: 'HS-011', name: 'F/S Sub-Area 11', ward: 'F/S', lat: 19.0466, lng: 72.819, fvi: 0.53, severity: 'MODERATE', depth: 49, deficit: 13, pop: 35061, critical: 2, history: 12 },
    { id: 12, code: 'HS-012', name: 'K/E Sub-Area 12', ward: 'K/E', lat: 19.0826, lng: 72.8805, fvi: 0.15, severity: 'VERY_LOW', depth: 41, deficit: 16, pop: 30838, critical: 0, history: 5 },
    { id: 13, code: 'HS-013', name: 'K/E Sub-Area 13', ward: 'K/E', lat: 19.1374, lng: 72.878, fvi: 0.14, severity: 'VERY_LOW', depth: 36, deficit: 11, pop: 15832, critical: 1, history: 15 },
    { id: 14, code: 'HS-014', name: 'F/N Sub-Area 14', ward: 'F/N', lat: 19.0363, lng: 72.8712, fvi: 0.12, severity: 'VERY_LOW', depth: 100, deficit: 37, pop: 37140, critical: 1, history: 9 },
    { id: 15, code: 'HS-015', name: 'F/S Sub-Area 15', ward: 'F/S', lat: 19.0325, lng: 72.7978, fvi: 0.29, severity: 'LOW', depth: 72, deficit: 44, pop: 48682, critical: 2, history: 13 },
    { id: 16, code: 'HS-016', name: 'K/W Sub-Area 16', ward: 'K/W', lat: 19.0771, lng: 72.8341, fvi: 0.7, severity: 'HIGH', depth: 105, deficit: 77, pop: 40241, critical: 1, history: 9 },
    { id: 17, code: 'HS-017', name: 'K/E Sub-Area 17', ward: 'K/E', lat: 19.1268, lng: 72.8703, fvi: 0.83, severity: 'VERY_HIGH', depth: 106, deficit: 8, pop: 37741, critical: 1, history: 11 },
    { id: 18, code: 'HS-018', name: 'F/N Sub-Area 18', ward: 'F/N', lat: 19.0532, lng: 72.8652, fvi: 0.2, severity: 'VERY_LOW', depth: 87, deficit: 11, pop: 27853, critical: 2, history: 8 },
    { id: 19, code: 'HS-019', name: 'F/S Sub-Area 19', ward: 'F/S', lat: 18.9845, lng: 72.8596, fvi: 0.25, severity: 'LOW', depth: 39, deficit: 33, pop: 25801, critical: 3, history: 4 },
    { id: 20, code: 'HS-020', name: 'F/N Sub-Area 20', ward: 'F/N', lat: 19.0598, lng: 72.8956, fvi: 0.71, severity: 'HIGH', depth: 59, deficit: 22, pop: 27219, critical: 2, history: 9 },
    { id: 21, code: 'HS-021', name: 'K/E Sub-Area 21', ward: 'K/E', lat: 19.1528, lng: 72.8778, fvi: 0.48, severity: 'MODERATE', depth: 87, deficit: 33, pop: 14073, critical: 0, history: 8 },
    { id: 22, code: 'HS-022', name: 'K/E Sub-Area 22', ward: 'K/E', lat: 19.1152, lng: 72.846, fvi: 0.69, severity: 'HIGH', depth: 116, deficit: 35, pop: 46205, critical: 2, history: 2 },
    { id: 23, code: 'HS-023', name: 'F/N Sub-Area 23', ward: 'F/N', lat: 19.0374, lng: 72.8522, fvi: 0.34, severity: 'LOW', depth: 27, deficit: 42, pop: 33476, critical: 3, history: 10 },
    { id: 24, code: 'HS-024', name: 'F/S Sub-Area 24', ward: 'F/S', lat: 19.0216, lng: 72.8751, fvi: 0.57, severity: 'MODERATE', depth: 46, deficit: 79, pop: 49517, critical: 1, history: 11 },
    { id: 25, code: 'HS-025', name: 'F/S Sub-Area 25', ward: 'F/S', lat: 19.003, lng: 72.802, fvi: 0.1, severity: 'VERY_LOW', depth: 39, deficit: 50, pop: 42019, critical: 1, history: 7 },
    { id: 26, code: 'HS-026', name: 'K/W Sub-Area 26', ward: 'K/W', lat: 19.104, lng: 72.8593, fvi: 0.46, severity: 'MODERATE', depth: 60, deficit: 44, pop: 49548, critical: 3, history: 10 },
    { id: 27, code: 'HS-027', name: 'F/S Sub-Area 27', ward: 'F/S', lat: 19.0408, lng: 72.8611, fvi: 0.57, severity: 'MODERATE', depth: 32, deficit: 7, pop: 16732, critical: 2, history: 7 },
    { id: 28, code: 'HS-028', name: 'F/N Sub-Area 28', ward: 'F/N', lat: 19.0075, lng: 72.8404, fvi: 0.49, severity: 'MODERATE', depth: 56, deficit: 35, pop: 33873, critical: 1, history: 10 },
    { id: 29, code: 'HS-029', name: 'K/E Sub-Area 29', ward: 'K/E', lat: 19.0878, lng: 72.8211, fvi: 0.12, severity: 'VERY_LOW', depth: 66, deficit: 11, pop: 37025, critical: 1, history: 8 },
    { id: 30, code: 'HS-030', name: 'F/N Sub-Area 30', ward: 'F/N', lat: 19.0393, lng: 72.8275, fvi: 0.21, severity: 'LOW', depth: 93, deficit: 75, pop: 34443, critical: 3, history: 14 }
];

// Enhanced Drainage Data with Slope, Gradient & Pipeline Engineering
const DRAINAGE_DATA = [
    { id: 1, name: "Mithi River Channel", type: "PRIMARY", ward: "H/E", length: 17.8, capacity: 85.5, condition: "FAIR", lastDesilt: "2025-04-15", diameter_mm: 3500, material: "RCC", slope_pct: 0.12, elevation_up: 12.5, elevation_down: 3.2, siltation_pct: 35, lat: 19.068, lng: 72.842 },
    { id: 2, name: "Dahisar River Drain", type: "PRIMARY", ward: "R/S", length: 12.4, capacity: 52.3, condition: "POOR", lastDesilt: "2024-11-20", diameter_mm: 2800, material: "RCC", slope_pct: 0.18, elevation_up: 18.3, elevation_down: 5.1, siltation_pct: 55, lat: 19.248, lng: 72.863 },
    { id: 3, name: "Poisar River Nala", type: "PRIMARY", ward: "P/N", length: 9.8, capacity: 38.7, condition: "POOR", lastDesilt: "2025-01-10", diameter_mm: 2200, material: "RCC", slope_pct: 0.22, elevation_up: 22.1, elevation_down: 8.4, siltation_pct: 62, lat: 19.188, lng: 72.845 },
    { id: 4, name: "Oshiwara River Channel", type: "PRIMARY", ward: "K/W", length: 14.2, capacity: 65.4, condition: "FAIR", lastDesilt: "2025-03-22", diameter_mm: 3200, material: "RCC", slope_pct: 0.15, elevation_up: 15.7, elevation_down: 4.6, siltation_pct: 28, lat: 19.128, lng: 72.838 },
    { id: 5, name: "Vakola Nala", type: "SECONDARY", ward: "H/E", length: 8.3, capacity: 24.5, condition: "CRITICAL", lastDesilt: "2024-08-05", diameter_mm: 1500, material: "Stone", slope_pct: 0.08, elevation_up: 8.6, elevation_down: 4.2, siltation_pct: 78, lat: 19.072, lng: 72.848 },
    { id: 6, name: "Mogra Nala", type: "SECONDARY", ward: "K/E", length: 6.7, capacity: 18.2, condition: "POOR", lastDesilt: "2025-02-14", diameter_mm: 1200, material: "RCC", slope_pct: 0.10, elevation_up: 10.3, elevation_down: 5.8, siltation_pct: 48, lat: 19.112, lng: 72.855 },
    { id: 7, name: "Irla Nala", type: "SECONDARY", ward: "K/W", length: 5.1, capacity: 15.8, condition: "FAIR", lastDesilt: "2025-05-01", diameter_mm: 1000, material: "RCC", slope_pct: 0.14, elevation_up: 11.2, elevation_down: 6.5, siltation_pct: 22, lat: 19.118, lng: 72.832 },
    { id: 8, name: "Mahul Creek Drain", type: "PRIMARY", ward: "M/E", length: 11.5, capacity: 48.9, condition: "FAIR", lastDesilt: "2025-04-08", diameter_mm: 2600, material: "RCC", slope_pct: 0.11, elevation_up: 9.8, elevation_down: 2.8, siltation_pct: 30, lat: 19.055, lng: 72.895 },
    { id: 9, name: "Hindmata SWD Main", type: "SECONDARY", ward: "F/S", length: 4.2, capacity: 8.5, condition: "CRITICAL", lastDesilt: "2024-10-12", diameter_mm: 900, material: "Brick", slope_pct: 0.05, elevation_up: 5.2, elevation_down: 3.8, siltation_pct: 85, lat: 19.005, lng: 72.843 },
    { id: 10, name: "Lovegrove SWD", type: "SECONDARY", ward: "G/S", length: 3.8, capacity: 12.3, condition: "POOR", lastDesilt: "2025-01-28", diameter_mm: 1100, material: "RCC", slope_pct: 0.07, elevation_up: 6.4, elevation_down: 4.1, siltation_pct: 52, lat: 19.012, lng: 72.822 },
    { id: 11, name: "Tansa Pipeline Drain", type: "SECONDARY", ward: "E", length: 5.6, capacity: 14.8, condition: "FAIR", lastDesilt: "2025-03-10", diameter_mm: 1300, material: "RCC", slope_pct: 0.13, elevation_up: 13.2, elevation_down: 7.1, siltation_pct: 25, lat: 18.975, lng: 72.835 },
    { id: 12, name: "Tulsi Pipe Road Drain", type: "SECONDARY", ward: "F/N", length: 4.8, capacity: 11.2, condition: "POOR", lastDesilt: "2025-01-18", diameter_mm: 1000, material: "Stone", slope_pct: 0.06, elevation_up: 7.1, elevation_down: 4.8, siltation_pct: 65, lat: 19.025, lng: 72.850 },
    { id: 13, name: "Worli Outfall", type: "PRIMARY", ward: "G/S", length: 6.2, capacity: 42.5, condition: "FAIR", lastDesilt: "2025-04-20", diameter_mm: 2800, material: "RCC", slope_pct: 0.20, elevation_up: 12.8, elevation_down: 1.5, siltation_pct: 18, lat: 19.010, lng: 72.815 },
    { id: 14, name: "Bandra SWD Network", type: "SECONDARY", ward: "H/W", length: 7.4, capacity: 19.6, condition: "FAIR", lastDesilt: "2025-05-05", diameter_mm: 1200, material: "RCC", slope_pct: 0.11, elevation_up: 9.5, elevation_down: 4.2, siltation_pct: 20, lat: 19.056, lng: 72.828 },
    { id: 15, name: "Ghatkopar Nala", type: "SECONDARY", ward: "N", length: 5.9, capacity: 16.4, condition: "POOR", lastDesilt: "2025-02-22", diameter_mm: 1400, material: "RCC", slope_pct: 0.09, elevation_up: 14.2, elevation_down: 8.7, siltation_pct: 58, lat: 19.086, lng: 72.910 },
];

// Pipeline segments with slope analysis for flood avoidance
const PIPELINE_SEGMENTS = [
    { id: 1, drainId: 1, segName: "Mithi-Seg-A (Airport Rd)", startLat: 19.098, startLng: 72.852, endLat: 19.082, endLng: 72.846, elevStart: 12.5, elevEnd: 9.8, length_m: 1850, diameter_mm: 3500, slope_pct: 0.15, flowVelocity: 1.8, designCapacity: 28.5, currentCapacity: 18.5, siltation_pct: 35, material: "RCC", risk: "HIGH" },
    { id: 2, drainId: 1, segName: "Mithi-Seg-B (BKC)", startLat: 19.082, startLng: 72.846, endLat: 19.068, endLng: 72.842, elevStart: 9.8, elevEnd: 6.2, length_m: 1620, diameter_mm: 3500, slope_pct: 0.22, flowVelocity: 2.1, designCapacity: 28.5, currentCapacity: 22.1, siltation_pct: 22, material: "RCC", risk: "MODERATE" },
    { id: 3, drainId: 1, segName: "Mithi-Seg-C (Mahim Creek)", startLat: 19.068, startLng: 72.842, endLat: 19.042, endLng: 72.838, elevStart: 6.2, elevEnd: 3.2, length_m: 2980, diameter_mm: 3500, slope_pct: 0.10, flowVelocity: 1.4, designCapacity: 28.5, currentCapacity: 15.2, siltation_pct: 47, material: "RCC", risk: "VERY_HIGH" },
    { id: 4, drainId: 5, segName: "Vakola-Seg-A (Airport Colony)", startLat: 19.078, startLng: 72.856, endLat: 19.075, endLng: 72.850, elevStart: 8.6, elevEnd: 6.5, length_m: 780, diameter_mm: 1500, slope_pct: 0.27, flowVelocity: 1.1, designCapacity: 8.2, currentCapacity: 1.8, siltation_pct: 78, material: "Stone", risk: "CRITICAL" },
    { id: 5, drainId: 5, segName: "Vakola-Seg-B (Mithi Jn)", startLat: 19.075, startLng: 72.850, endLat: 19.070, endLng: 72.845, elevStart: 6.5, elevEnd: 4.2, length_m: 640, diameter_mm: 1500, slope_pct: 0.36, flowVelocity: 1.5, designCapacity: 8.2, currentCapacity: 2.4, siltation_pct: 71, material: "Stone", risk: "CRITICAL" },
    { id: 6, drainId: 9, segName: "Hindmata-Seg-A (Main)", startLat: 19.008, startLng: 72.845, endLat: 19.003, endLng: 72.842, elevStart: 5.2, elevEnd: 4.5, length_m: 620, diameter_mm: 900, slope_pct: 0.11, flowVelocity: 0.6, designCapacity: 2.8, currentCapacity: 0.4, siltation_pct: 85, material: "Brick", risk: "CRITICAL" },
    { id: 7, drainId: 9, segName: "Hindmata-Seg-B (Outfall)", startLat: 19.003, startLng: 72.842, endLat: 18.998, endLng: 72.840, elevStart: 4.5, elevEnd: 3.8, length_m: 580, diameter_mm: 900, slope_pct: 0.12, flowVelocity: 0.5, designCapacity: 2.8, currentCapacity: 0.6, siltation_pct: 79, material: "Brick", risk: "CRITICAL" },
    { id: 8, drainId: 2, segName: "Dahisar-Seg-A (Upper)", startLat: 19.262, startLng: 72.870, endLat: 19.255, endLng: 72.865, elevStart: 18.3, elevEnd: 14.2, length_m: 920, diameter_mm: 2800, slope_pct: 0.45, flowVelocity: 2.8, designCapacity: 17.4, currentCapacity: 8.5, siltation_pct: 51, material: "RCC", risk: "HIGH" },
    { id: 9, drainId: 3, segName: "Poisar-Seg-A (SGNP Edge)", startLat: 19.210, startLng: 72.860, endLat: 19.195, endLng: 72.848, elevStart: 22.1, elevEnd: 15.6, length_m: 1850, diameter_mm: 2200, slope_pct: 0.35, flowVelocity: 2.4, designCapacity: 12.9, currentCapacity: 4.9, siltation_pct: 62, material: "RCC", risk: "VERY_HIGH" },
    { id: 10, drainId: 4, segName: "Oshiwara-Seg-A (Goregaon)", startLat: 19.158, startLng: 72.850, endLat: 19.142, endLng: 72.842, elevStart: 15.7, elevEnd: 10.2, length_m: 1920, diameter_mm: 3200, slope_pct: 0.29, flowVelocity: 2.2, designCapacity: 21.8, currentCapacity: 15.7, siltation_pct: 28, material: "RCC", risk: "MODERATE" },
    { id: 11, drainId: 13, segName: "Worli-Seg-A (BWSL)", startLat: 19.015, startLng: 72.820, endLat: 19.008, endLng: 72.812, elevStart: 12.8, elevEnd: 4.5, length_m: 980, diameter_mm: 2800, slope_pct: 0.85, flowVelocity: 3.2, designCapacity: 14.2, currentCapacity: 11.6, siltation_pct: 18, material: "RCC", risk: "LOW" },
    { id: 12, drainId: 6, segName: "Mogra-Seg-A (Andheri)", startLat: 19.118, startLng: 72.860, endLat: 19.110, endLng: 72.852, elevStart: 10.3, elevEnd: 7.2, length_m: 1120, diameter_mm: 1200, slope_pct: 0.28, flowVelocity: 1.2, designCapacity: 6.1, currentCapacity: 3.2, siltation_pct: 48, material: "RCC", risk: "HIGH" },
];

// Slope analysis data for terrain-based flood risk
const SLOPE_DATA = [
    { ward: "A", avgElevation: 8.2, minElevation: 1.5, maxElevation: 14.8, avgSlope: 1.2, flatAreaPct: 42, direction: "W→Sea" },
    { ward: "B", avgElevation: 6.8, minElevation: 2.1, maxElevation: 11.4, avgSlope: 0.9, flatAreaPct: 55, direction: "W→Sea" },
    { ward: "C", avgElevation: 7.5, minElevation: 1.8, maxElevation: 13.2, avgSlope: 1.1, flatAreaPct: 48, direction: "W→Sea" },
    { ward: "D", avgElevation: 9.3, minElevation: 3.2, maxElevation: 18.5, avgSlope: 1.5, flatAreaPct: 35, direction: "W→Sea" },
    { ward: "E", avgElevation: 11.5, minElevation: 4.5, maxElevation: 22.3, avgSlope: 1.8, flatAreaPct: 28, direction: "E→Creek" },
    { ward: "F/N", avgElevation: 8.1, minElevation: 3.1, maxElevation: 15.6, avgSlope: 1.0, flatAreaPct: 52, direction: "W→Sea" },
    { ward: "F/S", avgElevation: 5.2, minElevation: 1.2, maxElevation: 9.8, avgSlope: 0.6, flatAreaPct: 68, direction: "Flat basin" },
    { ward: "G/N", avgElevation: 10.8, minElevation: 3.8, maxElevation: 20.1, avgSlope: 1.6, flatAreaPct: 32, direction: "W→Sea" },
    { ward: "G/S", avgElevation: 9.5, minElevation: 2.5, maxElevation: 18.2, avgSlope: 1.3, flatAreaPct: 38, direction: "W→Sea" },
    { ward: "H/E", avgElevation: 7.8, minElevation: 2.0, maxElevation: 14.5, avgSlope: 0.8, flatAreaPct: 58, direction: "E→Mithi" },
    { ward: "H/W", avgElevation: 11.2, minElevation: 3.5, maxElevation: 22.8, avgSlope: 1.9, flatAreaPct: 25, direction: "W→Sea" },
    { ward: "K/E", avgElevation: 12.4, minElevation: 4.2, maxElevation: 24.5, avgSlope: 1.4, flatAreaPct: 35, direction: "E→Mithi" },
    { ward: "K/W", avgElevation: 14.8, minElevation: 5.5, maxElevation: 28.2, avgSlope: 2.1, flatAreaPct: 22, direction: "W→Sea" },
    { ward: "L", avgElevation: 6.5, minElevation: 1.8, maxElevation: 12.8, avgSlope: 0.7, flatAreaPct: 62, direction: "S→Creek" },
    { ward: "M/E", avgElevation: 8.9, minElevation: 2.5, maxElevation: 16.4, avgSlope: 1.1, flatAreaPct: 45, direction: "E→Harbor" },
    { ward: "M/W", avgElevation: 7.2, minElevation: 2.2, maxElevation: 13.5, avgSlope: 0.9, flatAreaPct: 50, direction: "W→Sea" },
    { ward: "N", avgElevation: 15.6, minElevation: 5.8, maxElevation: 30.2, avgSlope: 2.3, flatAreaPct: 18, direction: "W→Creek" },
    { ward: "P/N", avgElevation: 18.2, minElevation: 6.5, maxElevation: 35.8, avgSlope: 2.8, flatAreaPct: 15, direction: "W→Creek" },
    { ward: "P/S", avgElevation: 16.5, minElevation: 5.2, maxElevation: 32.4, avgSlope: 2.5, flatAreaPct: 20, direction: "W→Creek" },
    { ward: "R/C", avgElevation: 14.2, minElevation: 4.8, maxElevation: 28.6, avgSlope: 2.0, flatAreaPct: 25, direction: "W→Creek" },
    { ward: "R/N", avgElevation: 20.5, minElevation: 8.2, maxElevation: 40.1, avgSlope: 3.2, flatAreaPct: 12, direction: "W→Creek" },
    { ward: "R/S", avgElevation: 16.8, minElevation: 5.5, maxElevation: 32.8, avgSlope: 2.6, flatAreaPct: 18, direction: "W→Creek" },
    { ward: "S", avgElevation: 22.5, minElevation: 8.5, maxElevation: 45.2, avgSlope: 3.5, flatAreaPct: 10, direction: "E→Creek" },
    { ward: "T", avgElevation: 18.8, minElevation: 6.2, maxElevation: 38.5, avgSlope: 2.9, flatAreaPct: 14, direction: "W→Creek" },
];

// Citizen Complaints — sample data
const COMPLAINTS_DATA = [
    { id: "CMP-001", citizen: "Ramesh Patil", phone: "98XX-XX1234", ward: "F/S", type: "BLOCKAGE", desc: "Drain completely blocked near Hindmata — garbage and plastic waste clogging the gutter", lat: 19.0048, lng: 72.8430, timestamp: "2026-03-08T08:45:00", status: "OPEN", hasImage: true, upvotes: 45 },
    { id: "CMP-002", citizen: "Sita Sharma", phone: "98XX-XX2345", ward: "K/E", type: "OVERFLOW", desc: "Water overflowing from manhole near Andheri Station East. Road is submerged 2 feet.", lat: 19.1198, lng: 72.8470, timestamp: "2026-03-08T09:15:00", status: "ASSIGNED", hasImage: true, upvotes: 72 },
    { id: "CMP-003", citizen: "Anil Deshmukh", phone: "98XX-XX3456", ward: "L", type: "WATERLOGGING", desc: "Knee-deep water at Kurla LTT Road since morning. Vehicles stuck.", lat: 19.0730, lng: 72.8800, timestamp: "2026-03-08T07:30:00", status: "IN_PROGRESS", hasImage: true, upvotes: 128 },
    { id: "CMP-004", citizen: "Priya Joshi", phone: "98XX-XX4567", ward: "P/N", type: "BLOCKAGE", desc: "Construction debris blocking Poisar Nala near Malad East. Water level rising.", lat: 19.1880, lng: 72.8490, timestamp: "2026-03-08T06:20:00", status: "ASSIGNED", hasImage: true, upvotes: 56 },
    { id: "CMP-005", citizen: "Manoj Singh", phone: "98XX-XX5678", ward: "H/E", type: "OVERFLOW", desc: "Vakola nala overflowing — water entering ground floor houses in Kalina area.", lat: 19.0725, lng: 72.8480, timestamp: "2026-03-07T22:10:00", status: "RESOLVED", hasImage: true, upvotes: 93 },
    { id: "CMP-006", citizen: "Fatima Khan", phone: "98XX-XX6789", ward: "R/S", type: "BLOCKAGE", desc: "Dahisar nala choked with plastic waste near Link Road junction.", lat: 19.2520, lng: 72.8670, timestamp: "2026-03-07T16:45:00", status: "OPEN", hasImage: false, upvotes: 34 },
    { id: "CMP-007", citizen: "Vijay Kulkarni", phone: "98XX-XX7890", ward: "G/S", type: "WATERLOGGING", desc: "Persistent waterlogging at Worli Naka even during light rain. Drain seems flat.", lat: 19.0148, lng: 72.8190, timestamp: "2026-03-07T14:30:00", status: "OPEN", hasImage: true, upvotes: 41 },
    { id: "CMP-008", citizen: "Meera Reddy", phone: "98XX-XX8901", ward: "N", type: "OVERFLOW", desc: "Manhole cover displaced at Ghatkopar Station Road. Sewage flowing on road.", lat: 19.0862, lng: 72.9090, timestamp: "2026-03-07T11:00:00", status: "RESOLVED", hasImage: true, upvotes: 67 },
];

const COMPLAINT_TYPES = {
    BLOCKAGE: { label: "Drain Blockage", icon: "🚫", color: "#f97316" },
    OVERFLOW: { label: "Manhole Overflow", icon: "💧", color: "#ef4444" },
    WATERLOGGING: { label: "Waterlogging", icon: "🌊", color: "#3b82f6" },
    DAMAGE: { label: "Infrastructure Damage", icon: "🔧", color: "#eab308" },
    OTHER: { label: "Other", icon: "📝", color: "#94a3b8" },
};

const CONDITION_COLORS = {
    GOOD: "#22c55e",
    FAIR: "#3b82f6",
    POOR: "#f97316",
    CRITICAL: "#ef4444",
};

const ALERTS_DATA = [
    { id: 1, level: "RED", title: "Heavy Rainfall — Hindmata", message: "120mm/hr intensity. 12 hotspots at HIGH risk. Predicted depth: 90-120cm.", time: "10:15 AM", ward: "F/S", hotspots: 12 },
    { id: 2, level: "ORANGE", title: "Severe Rain — Andheri", message: "85mm/hr. 8 hotspots activating. Deploy pumps to Milan Subway.", time: "09:45 AM", ward: "K/E", hotspots: 8 },
    { id: 3, level: "YELLOW", title: "Moderate Rain — Kurla", message: "45mm/hr. 3 hotspots at moderate risk. Monitor conditions.", time: "09:00 AM", ward: "L", hotspots: 3 },
    { id: 4, level: "GREEN", title: "Light Rain — Colaba", message: "Normal rainfall. All systems nominal.", time: "08:30 AM", ward: "A", hotspots: 0 },
];

const ACTION_ITEMS = [
    { id: 1, ward: "F/S", priority: 1, desc: "Complete desilting of Hindmata SWD Main (2.8 km left)", impact: 12, due: "2026-06-05", status: "BEHIND", assignee: "Eng. Patil" },
    { id: 2, ward: "K/E", priority: 2, desc: "Repair Pump #2 and #4 at Andheri Subway Station", impact: 8, due: "2026-06-01", status: "IN_PROGRESS", assignee: "Eng. Sharma" },
    { id: 3, ward: "P/N", priority: 3, desc: "Clear debris at Poisar River junction", impact: 6, due: "2026-06-10", status: "NOT_STARTED", assignee: "Eng. Deshmukh" },
    { id: 4, ward: "L", priority: 4, desc: "Install flood barrier at Kurla Underpass", impact: 5, due: "2026-06-15", status: "NOT_STARTED", assignee: "Eng. Joshi" },
    { id: 5, ward: "R/C", priority: 5, desc: "Conduct flood response drill for Ward R/C team", impact: 4, due: "2026-06-08", status: "NOT_STARTED", assignee: "Eng. Kulkarni" },
];

// PMRS component breakdown for each ward
function getPMRSComponents(ward) {
    const base = {
        infrastructure: Math.round(ward.pmrs * (0.7 + Math.random() * 0.6)),
        vulnerability: Math.round(ward.pmrs * (0.6 + Math.random() * 0.8)),
        response: Math.round(ward.pmrs * (0.8 + Math.random() * 0.4)),
        historical: Math.round(ward.pmrs * (0.5 + Math.random() * 1.0)),
    };
    // Clamp to 0-100
    Object.keys(base).forEach(k => { base[k] = Math.min(100, Math.max(0, base[k])); });
    return base;
}

// Severity color mapping
const SEVERITY_COLORS = { VERY_HIGH: "#D63031", HIGH: "#E67E22", MODERATE: "#F1C40F", LOW: "#27AE60", VERY_LOW: "#94a3b8" };

const GRADE_COLORS = { A: "#27AE60", B: "#2D9CDB", C: "#F1C40F", D: "#E67E22", F: "#D63031" };

const ALERT_COLORS = { RED: "#D63031", ORANGE: "#E67E22", YELLOW: "#F1C40F", GREEN: "#27AE60" };

const MICRO_BASIN_FEATURE_COLLECTION = {
    type: "FeatureCollection",
    features: HOTSPOT_DATA.map(h => {
        const o = 0.001 + (h.fvi * 0.001); // Very small polygons for micro-level planning
        return {
            type: "Feature",
            properties: { ...h },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [h.lng - o, h.lat - o],
                    [h.lng + o, h.lat - o * 0.5],
                    [h.lng + o * 1.2, h.lat + o],
                    [h.lng - o * 0.5, h.lat + o * 1.1],
                    [h.lng - o, h.lat - o]
                ]]
            }
        };
    })
};

export {
    MUMBAI_CENTER, MUMBAI_BOUNDS, WARD_DATA, HOTSPOT_DATA,
    DRAINAGE_DATA, PIPELINE_SEGMENTS, SLOPE_DATA,
    ALERTS_DATA, ACTION_ITEMS,
    COMPLAINTS_DATA, COMPLAINT_TYPES, CONDITION_COLORS,
    getPMRSComponents, SEVERITY_COLORS, GRADE_COLORS, ALERT_COLORS,
    MICRO_BASIN_FEATURE_COLLECTION
};

export const MUMBAI_DRAINAGE_GEOJSON = { "type": "FeatureCollection", "features": [] };
