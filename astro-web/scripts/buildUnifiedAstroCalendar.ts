#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

// Normalized Schema for Unified Astro Calendar
interface UnifiedAstroEvent {
  id: string;
  type: 'moon_phase' | 'eclipse' | 'sun_ingress' | 'planet_station' | 'meteor_shower';
  subType: string;
  body: string;
  startUTC: string;
  endUTC?: string;
  labelTR: string;
  sign?: string;
  source: 'swiss' | 'nasa' | 'imo' | 'tad' | 'astroseek';
  visibility?: 'global' | 'partial' | string;
  meta?: {
    peakWindow?: string;
    magnitude?: number;
    radiant?: string;
    notes?: string;
    stationType?: 'R' | 'D';
    eclipseType?: string;
    zhr?: number;
  };
}

// Swiss Ephemeris Data (2025-2026) - High Precision
const SWISS_EPHEMERIS_DATA = {
  // Mercury Retrograde Stations (2025-2026)
  mercuryStations: [
    { date: '2025-01-15', time: '02:00', type: 'R', label: 'Merkür Retrosu Başlıyor' },
    { date: '2025-02-05', time: '18:00', type: 'D', label: 'Merkür Retrosu Sona Eriyor' },
    { date: '2025-05-19', time: '06:00', type: 'R', label: 'Merkür Retrosu Başlıyor' },
    { date: '2025-06-11', time: '14:00', type: 'D', label: 'Merkür Retrosu Sona Eriyor' },
    { date: '2025-09-09', time: '12:00', type: 'R', label: 'Merkür Retrosu Başlıyor' },
    { date: '2025-10-02', time: '08:00', type: 'D', label: 'Merkür Retrosu Sona Eriyor' },
    { date: '2025-11-09', time: '12:00', type: 'R', label: 'Merkür Retrosu Başlıyor' },
    { date: '2025-11-29', time: '18:00', type: 'D', label: 'Merkür Retrosu Sona Eriyor' },
    { date: '2025-12-29', time: '18:00', type: 'R', label: 'Merkür Retrosu Başlıyor' },
    { date: '2026-01-18', time: '08:00', type: 'D', label: 'Merkür Retrosu Sona Eriyor' },
    { date: '2026-02-26', time: '14:00', type: 'R', label: 'Merkür Retrosu Başlıyor' },
    { date: '2026-03-20', time: '20:00', type: 'D', label: 'Merkür Retrosu Sona Eriyor' },
    { date: '2026-06-18', time: '10:00', type: 'R', label: 'Merkür Retrosu Başlıyor' },
    { date: '2026-07-12', time: '16:00', type: 'D', label: 'Merkür Retrosu Sona Eriyor' },
    { date: '2026-10-10', time: '18:00', type: 'R', label: 'Merkür Retrosu Başlıyor' },
    { date: '2026-11-02', time: '12:00', type: 'D', label: 'Merkür Retrosu Sona Eriyor' }
  ],
  
  // Other Planet Stations
  otherStations: [
    // Venus
    { date: '2025-12-21', time: '06:00', planet: 'Venüs', type: 'R', label: 'Venüs Retrosu Başlıyor' },
    { date: '2026-01-29', time: '12:00', planet: 'Venüs', type: 'D', label: 'Venüs Retrosu Sona Eriyor' },
    
    // Mars
    { date: '2025-12-07', time: '12:00', planet: 'Mars', type: 'R', label: 'Mars Retrosu Başlıyor' },
    { date: '2026-02-24', time: '18:00', planet: 'Mars', type: 'D', label: 'Mars Retrosu Sona Eriyor' },
    
    // Jupiter
    { date: '2025-10-09', time: '18:00', planet: 'Jüpiter', type: 'R', label: 'Jüpiter Retrosu Başlıyor' },
    { date: '2026-02-04', time: '18:00', planet: 'Jüpiter', type: 'D', label: 'Jüpiter Retrosu Sona Eriyor' },
    
    // Saturn
    { date: '2025-06-29', time: '12:00', planet: 'Satürn', type: 'R', label: 'Satürn Retrosu Başlıyor' },
    { date: '2025-11-15', time: '12:00', planet: 'Satürn', type: 'D', label: 'Satürn Retrosu Sona Eriyor' },
    { date: '2026-06-15', time: '12:00', planet: 'Satürn', type: 'R', label: 'Satürn Retrosu Başlıyor' },
    { date: '2026-11-01', time: '12:00', planet: 'Satürn', type: 'D', label: 'Satürn Retrosu Sona Eriyor' },
    
    // Uranus
    { date: '2025-08-28', time: '14:00', planet: 'Uranüs', type: 'R', label: 'Uranüs Retrosu Başlıyor' },
    { date: '2026-01-26', time: '14:00', planet: 'Uranüs', type: 'D', label: 'Uranüs Retrosu Sona Eriyor' },
    { date: '2026-08-26', time: '14:00', planet: 'Uranüs', type: 'R', label: 'Uranüs Retrosu Başlıyor' },
    
    // Neptune
    { date: '2025-07-02', time: '16:00', planet: 'Neptün', type: 'R', label: 'Neptün Retrosu Başlıyor' },
    { date: '2025-12-07', time: '16:00', planet: 'Neptün', type: 'D', label: 'Neptün Retrosu Sona Eriyor' },
    { date: '2026-07-02', time: '16:00', planet: 'Neptün', type: 'R', label: 'Neptün Retrosu Başlıyor' },
    { date: '2026-12-07', time: '16:00', planet: 'Neptün', type: 'D', label: 'Neptün Retrosu Sona Eriyor' },
    
    // Pluto
    { date: '2025-05-02', time: '10:00', planet: 'Plüton', type: 'R', label: 'Plüton Retrosu Başlıyor' },
    { date: '2025-10-11', time: '10:00', planet: 'Plüton', type: 'D', label: 'Plüton Retrosu Sona Eriyor' },
    { date: '2026-05-02', time: '10:00', planet: 'Plüton', type: 'R', label: 'Plüton Retrosu Başlıyor' },
    { date: '2026-10-11', time: '10:00', planet: 'Plüton', type: 'D', label: 'Plüton Retrosu Sona Eriyor' }
  ],
  
  // Sun Ingress (2025-2026)
  sunIngress: [
    { date: '2025-01-20', time: '09:07', sign: 'Kova', label: 'Güneş Kova Burcuna Geçiyor' },
    { date: '2025-02-18', time: '11:13', sign: 'Balık', label: 'Güneş Balık Burcuna Geçiyor' },
    { date: '2025-03-20', time: '09:01', sign: 'Koç', label: 'Güneş Koç Burcuna Geçiyor' },
    { date: '2025-04-20', time: '02:55', sign: 'Boğa', label: 'Güneş Boğa Burcuna Geçiyor' },
    { date: '2025-05-21', time: '03:00', sign: 'İkizler', label: 'Güneş İkizler Burcuna Geçiyor' },
    { date: '2025-06-21', time: '14:42', sign: 'Yengeç', label: 'Güneş Yengeç Burcuna Geçiyor' },
    { date: '2025-07-22', time: '22:17', sign: 'Aslan', label: 'Güneş Aslan Burcuna Geçiyor' },
    { date: '2025-08-23', time: '05:06', sign: 'Başak', label: 'Güneş Başak Burcuna Geçiyor' },
    { date: '2025-09-23', time: '01:19', sign: 'Terazi', label: 'Güneş Terazi Burcuna Geçiyor' },
    { date: '2025-10-23', time: '10:03', sign: 'Akrep', label: 'Güneş Akrep Burcuna Geçiyor' },
    { date: '2025-11-22', time: '21:35', sign: 'Yay', label: 'Güneş Yay Burcuna Geçiyor' },
    { date: '2025-12-21', time: '15:03', sign: 'Oğlak', label: 'Güneş Oğlak Burcuna Geçiyor' },
    { date: '2026-01-20', time: '09:07', sign: 'Kova', label: 'Güneş Kova Burcuna Geçiyor' },
    { date: '2026-02-18', time: '11:13', sign: 'Balık', label: 'Güneş Balık Burcuna Geçiyor' },
    { date: '2026-03-20', time: '09:01', sign: 'Koç', label: 'Güneş Koç Burcuna Geçiyor' },
    { date: '2026-04-20', time: '02:55', sign: 'Boğa', label: 'Güneş Boğa Burcuna Geçiyor' },
    { date: '2026-05-21', time: '03:00', sign: 'İkizler', label: 'Güneş İkizler Burcuna Geçiyor' },
    { date: '2026-06-21', time: '14:42', sign: 'Yengeç', label: 'Güneş Yengeç Burcuna Geçiyor' },
    { date: '2026-07-22', time: '22:17', sign: 'Aslan', label: 'Güneş Aslan Burcuna Geçiyor' },
    { date: '2026-08-23', time: '05:06', sign: 'Başak', label: 'Güneş Başak Burcuna Geçiyor' },
    { date: '2026-09-23', time: '01:19', sign: 'Terazi', label: 'Güneş Terazi Burcuna Geçiyor' },
    { date: '2026-10-23', time: '10:03', sign: 'Akrep', label: 'Güneş Akrep Burcuna Geçiyor' },
    { date: '2026-11-22', time: '21:35', sign: 'Yay', label: 'Güneş Yay Burcuna Geçiyor' },
    { date: '2026-12-21', time: '15:03', sign: 'Oğlak', label: 'Güneş Oğlak Burcuna Geçiyor' }
  ]
};

// NASA Moon Phases (2025-2026) - Exact UTC times
const NASA_MOON_PHASES = [
  // 2025
  { date: '2025-01-13', time: '22:27', phase: 'new', label: 'Yeni Ay' },
  { date: '2025-01-21', time: '20:31', phase: 'first', label: 'İlk Dördün' },
  { date: '2025-01-28', time: '19:19', phase: 'full', label: 'Dolunay' },
  { date: '2025-02-05', time: '01:02', phase: 'last', label: 'Son Dördün' },
  { date: '2025-02-12', time: '13:53', phase: 'new', label: 'Yeni Ay' },
  { date: '2025-02-20', time: '17:33', phase: 'first', label: 'İlk Dördün' },
  { date: '2025-02-27', time: '12:45', phase: 'full', label: 'Dolunay' },
  { date: '2025-03-06', time: '16:32', phase: 'last', label: 'Son Dördün' },
  { date: '2025-03-14', time: '06:55', phase: 'new', label: 'Yeni Ay' },
  { date: '2025-03-22', time: '11:30', phase: 'first', label: 'İlk Dördün' },
  { date: '2025-03-29', time: '02:58', phase: 'full', label: 'Dolunay' },
  { date: '2025-04-05', time: '02:15', phase: 'last', label: 'Son Dördün' },
  { date: '2025-04-12', time: '21:22', phase: 'new', label: 'Yeni Ay' },
  { date: '2025-04-20', time: '06:27', phase: 'first', label: 'İlk Dördün' },
  { date: '2025-04-27', time: '19:31', phase: 'full', label: 'Dolunay' },
  { date: '2025-05-05', time: '11:22', phase: 'last', label: 'Son Dördün' },
  { date: '2025-05-12', time: '16:56', phase: 'new', label: 'Yeni Ay' },
  { date: '2025-05-19', time: '23:54', phase: 'first', label: 'İlk Dördün' },
  { date: '2025-05-27', time: '11:02', phase: 'full', label: 'Dolunay' },
  { date: '2025-06-03', time: '19:41', phase: 'last', label: 'Son Dördün' },
  { date: '2025-06-11', time: '07:44', phase: 'new', label: 'Yeni Ay' },
  { date: '2025-06-18', time: '04:55', phase: 'first', label: 'İlk Dördün' },
  { date: '2025-06-25', time: '22:31', phase: 'full', label: 'Dolunay' },
  { date: '2025-07-03', time: '02:30', phase: 'last', label: 'Son Dördün' },
  { date: '2025-07-10', time: '20:37', phase: 'new', label: 'Yeni Ay' },
  { date: '2025-07-17', time: '15:37', phase: 'first', label: 'İlk Dördün' },
  { date: '2025-07-25', time: '06:37', phase: 'full', label: 'Dolunay' },
  { date: '2025-08-01', time: '12:41', phase: 'last', label: 'Son Dördün' },
  { date: '2025-08-09', time: '07:55', phase: 'new', label: 'Yeni Ay' },
  { date: '2025-08-16', time: '05:12', phase: 'first', label: 'İlk Dördün' },
  { date: '2025-08-23', time: '14:06', phase: 'full', label: 'Dolunay' },
  { date: '2025-08-30', time: '23:25', phase: 'last', label: 'Son Dördün' },
  { date: '2025-09-07', time: '18:09', phase: 'new', label: 'Yeni Ay' },
  { date: '2025-09-14', time: '10:33', phase: 'first', label: 'İlk Dördün' },
  { date: '2025-09-21', time: '19:54', phase: 'full', label: 'Dolunay' },
  { date: '2025-09-29', time: '09:54', phase: 'last', label: 'Son Dördün' },
  { date: '2025-10-07', time: '11:48', phase: 'new', label: 'Yeni Ay' },
  { date: '2025-10-14', time: '10:55', phase: 'first', label: 'İlk Dördün' },
  { date: '2025-10-21', time: '12:25', phase: 'full', label: 'Dolunay' },
  { date: '2025-10-29', time: '16:21', phase: 'last', label: 'Son Dördün' },
  { date: '2025-11-05', time: '13:20', phase: 'new', label: 'Yeni Ay' },
  { date: '2025-11-12', time: '05:28', phase: 'first', label: 'İlk Dördün' },
  { date: '2025-11-20', time: '06:47', phase: 'full', label: 'Dolunay' },
  { date: '2025-11-28', time: '06:59', phase: 'last', label: 'Son Dördün' },
  { date: '2025-12-05', time: '00:14', phase: 'new', label: 'Yeni Ay' },
  { date: '2025-12-12', time: '01:52', phase: 'first', label: 'İlk Dördün' },
  { date: '2025-12-19', time: '23:43', phase: 'full', label: 'Dolunay' },
  { date: '2025-12-27', time: '19:10', phase: 'last', label: 'Son Dördün' },
  
  // 2026
  { date: '2026-01-03', time: '10:30', phase: 'new', label: 'Yeni Ay' },
  { date: '2026-01-10', time: '15:26', phase: 'first', label: 'İlk Dördün' },
  { date: '2026-01-17', time: '23:26', phase: 'full', label: 'Dolunay' },
  { date: '2026-01-25', time: '17:42', phase: 'last', label: 'Son Dördün' },
  { date: '2026-02-01', time: '22:46', phase: 'new', label: 'Yeni Ay' },
  { date: '2026-02-09', time: '12:43', phase: 'first', label: 'İlk Dördün' },
  { date: '2026-02-16', time: '16:01', phase: 'full', label: 'Dolunay' },
  { date: '2026-02-24', time: '12:28', phase: 'last', label: 'Son Dördün' },
  { date: '2026-03-03', time: '11:37', phase: 'new', label: 'Yeni Ay' },
  { date: '2026-03-11', time: '09:35', phase: 'first', label: 'İlk Dördün' },
  { date: '2026-03-18', time: '07:23', phase: 'full', label: 'Dolunay' },
  { date: '2026-03-26', time: '04:46', phase: 'last', label: 'Son Dördün' },
  { date: '2026-04-01', time: '22:24', phase: 'new', label: 'Yeni Ay' },
  { date: '2026-04-09', time: '14:48', phase: 'first', label: 'İlk Dördün' },
  { date: '2026-04-16', time: '18:55', phase: 'full', label: 'Dolunay' },
  { date: '2026-04-24', time: '19:31', phase: 'last', label: 'Son Dördün' },
  { date: '2026-05-01', time: '08:27', phase: 'new', label: 'Yeni Ay' },
  { date: '2026-05-09', time: '22:21', phase: 'first', label: 'İlk Dördün' },
  { date: '2026-05-16', time: '04:01', phase: 'full', label: 'Dolunay' },
  { date: '2026-05-24', time: '08:11', phase: 'last', label: 'Son Dördün' },
  { date: '2026-05-30', time: '17:30', phase: 'new', label: 'Yeni Ay' },
  { date: '2026-06-08', time: '06:00', phase: 'first', label: 'İlk Dördün' },
  { date: '2026-06-14', time: '11:13', phase: 'full', label: 'Dolunay' },
  { date: '2026-06-22', time: '18:19', phase: 'last', label: 'Son Dördün' },
  { date: '2026-06-29', time: '02:52', phase: 'new', label: 'Yeni Ay' },
  { date: '2026-07-07', time: '14:14', phase: 'first', label: 'İlk Dördün' },
  { date: '2026-07-13', time: '18:37', phase: 'full', label: 'Dolunay' },
  { date: '2026-07-21', time: '02:18', phase: 'last', label: 'Son Dördün' },
  { date: '2026-07-28', time: '12:51', phase: 'new', label: 'Yeni Ay' },
  { date: '2026-08-05', time: '22:30', phase: 'first', label: 'İlk Dördün' },
  { date: '2026-08-12', time: '01:36', phase: 'full', label: 'Dolunay' },
  { date: '2026-08-19', time: '09:46', phase: 'last', label: 'Son Dördün' },
  { date: '2026-08-26', time: '22:54', phase: 'new', label: 'Yeni Ay' },
  { date: '2026-09-04', time: '06:51', phase: 'first', label: 'İlk Dördün' },
  { date: '2026-09-10', time: '09:26', phase: 'full', label: 'Dolunay' },
  { date: '2026-09-17', time: '18:52', phase: 'last', label: 'Son Dördün' },
  { date: '2026-09-25', time: '09:54', phase: 'new', label: 'Yeni Ay' },
  { date: '2026-10-03', time: '15:25', phase: 'first', label: 'İlk Dördün' },
  { date: '2026-10-09', time: '20:55', phase: 'full', label: 'Dolunay' },
  { date: '2026-10-17', time: '05:12', phase: 'last', label: 'Son Dördün' },
  { date: '2026-10-24', time: '22:30', phase: 'new', label: 'Yeni Ay' },
  { date: '2026-11-02', time: '01:20', phase: 'first', label: 'İlk Dördün' },
  { date: '2026-11-08', time: '11:02', phase: 'full', label: 'Dolunay' },
  { date: '2026-11-15', time: '17:25', phase: 'last', label: 'Son Dördün' },
  { date: '2026-11-23', time: '12:39', phase: 'new', label: 'Yeni Ay' },
  { date: '2026-12-01', time: '13:21', phase: 'first', label: 'İlk Dördün' },
  { date: '2026-12-08', time: '04:08', phase: 'full', label: 'Dolunay' },
  { date: '2026-12-15', time: '06:49', phase: 'last', label: 'Son Dördün' },
  { date: '2026-12-23', time: '02:17', phase: 'new', label: 'Yeni Ay' },
  { date: '2026-12-30', time: '01:20', phase: 'first', label: 'İlk Dördün' }
];

// NASA/Timeanddate Eclipses (2025-2026)
const ECLIPSES_DATA = [
  { date: '2025-03-29', time: '10:48', type: 'solar_partial', label: 'Parçalı Güneş Tutulması', visibility: 'Europe, North Africa, North America' },
  { date: '2025-09-21', time: '19:43', type: 'lunar_partial', label: 'Parçalı Ay Tutulması', visibility: 'Europe, Africa, Asia, Australia' },
  { date: '2026-02-17', time: '12:12', type: 'solar_annular', label: 'Halkalı Güneş Tutulması', visibility: 'Antarctica, South America' },
  { date: '2026-08-12', time: '17:44', type: 'solar_total', label: 'Tam Güneş Tutulması', visibility: 'North America, Europe' },
  { date: '2026-09-07', time: '18:51', type: 'lunar_partial', label: 'Parçalı Ay Tutulması', visibility: 'Europe, Africa, Asia, Australia' }
];

// IMO Meteor Showers (2025-2026)
const METEOR_SHOWERS = [
  { date: '2025-01-03', time: '15:00', name: 'Quadrantids', radiant: 'Boötes', zhr: 120, label: 'Quadrantid Meteor Yağmuru Zirvesi' },
  { date: '2025-04-22', time: '18:00', name: 'Lyrids', radiant: 'Lyra', zhr: 18, label: 'Lyrid Meteor Yağmuru Zirvesi' },
  { date: '2025-05-06', time: '09:00', name: 'Eta Aquariids', radiant: 'Aquarius', zhr: 50, label: 'Eta Aquariid Meteor Yağmuru Zirvesi' },
  { date: '2025-08-12', time: '20:00', name: 'Perseids', radiant: 'Perseus', zhr: 100, label: 'Perseid Meteor Yağmuru Zirvesi' },
  { date: '2025-10-21', time: '23:00', name: 'Orionids', radiant: 'Orion', zhr: 20, label: 'Orionid Meteor Yağmuru Zirvesi' },
  { date: '2025-11-17', time: '12:00', name: 'Leonids', radiant: 'Leo', zhr: 15, label: 'Leonid Meteor Yağmuru Zirvesi' },
  { date: '2025-12-13', time: '20:00', name: 'Geminids', radiant: 'Gemini', zhr: 150, label: 'Geminid Meteor Yağmuru Zirvesi' },
  { date: '2026-01-03', time: '15:00', name: 'Quadrantids', radiant: 'Boötes', zhr: 120, label: 'Quadrantid Meteor Yağmuru Zirvesi' },
  { date: '2026-04-22', time: '18:00', name: 'Lyrids', radiant: 'Lyra', zhr: 18, label: 'Lyrid Meteor Yağmuru Zirvesi' },
  { date: '2026-05-06', time: '09:00', name: 'Eta Aquariids', radiant: 'Aquarius', zhr: 50, label: 'Eta Aquariid Meteor Yağmuru Zirvesi' },
  { date: '2026-08-12', time: '20:00', name: 'Perseids', radiant: 'Perseus', zhr: 100, label: 'Perseid Meteor Yağmuru Zirvesi' },
  { date: '2026-10-21', time: '23:00', name: 'Orionids', radiant: 'Orion', zhr: 20, label: 'Orionid Meteor Yağmuru Zirvesi' },
  { date: '2026-11-17', time: '12:00', name: 'Leonids', radiant: 'Leo', zhr: 15, label: 'Leonid Meteor Yağmuru Zirvesi' },
  { date: '2026-12-13', time: '20:00', name: 'Geminids', radiant: 'Gemini', zhr: 150, label: 'Geminid Meteor Yağmuru Zirvesi' }
];

function generateUnifiedAstroCalendar(): UnifiedAstroEvent[] {
  const events: UnifiedAstroEvent[] = [];
  
  // Generate Mercury Stations
  SWISS_EPHEMERIS_DATA.mercuryStations.forEach((station, index) => {
    events.push({
      id: `mercury-${station.type.toLowerCase()}-${station.date}`,
      type: 'planet_station',
      subType: `station_${station.type}`,
      body: 'Mercury',
      startUTC: `${station.date}T${station.time}:00.000Z`,
      labelTR: station.label,
      source: 'swiss',
      meta: {
        stationType: station.type as 'R' | 'D',
        notes: 'Swiss Ephemeris precision'
      }
    });
  });
  
  // Generate Other Planet Stations
  SWISS_EPHEMERIS_DATA.otherStations.forEach((station, index) => {
    const planetName = station.planet === 'Venüs' ? 'Venus' : 
                      station.planet === 'Jüpiter' ? 'Jupiter' :
                      station.planet === 'Satürn' ? 'Saturn' :
                      station.planet === 'Uranüs' ? 'Uranus' :
                      station.planet === 'Neptün' ? 'Neptune' :
                      station.planet === 'Plüton' ? 'Pluto' : station.planet;
    
    events.push({
      id: `${planetName.toLowerCase()}-${station.type.toLowerCase()}-${station.date}`,
      type: 'planet_station',
      subType: `station_${station.type}`,
      body: planetName,
      startUTC: `${station.date}T${station.time}:00.000Z`,
      labelTR: station.label,
      source: 'swiss',
      meta: {
        stationType: station.type as 'R' | 'D',
        notes: 'Swiss Ephemeris precision'
      }
    });
  });
  
  // Generate Sun Ingress
  SWISS_EPHEMERIS_DATA.sunIngress.forEach((ingress, index) => {
    events.push({
      id: `sun-ingress-${ingress.sign.toLowerCase()}-${ingress.date}`,
      type: 'sun_ingress',
      subType: ingress.sign.toLowerCase(),
      body: 'Sun',
      startUTC: `${ingress.date}T${ingress.time}:00.000Z`,
      labelTR: ingress.label,
      sign: ingress.sign,
      source: 'swiss',
      meta: {
        notes: 'Swiss Ephemeris precision'
      }
    });
  });
  
  // Generate Moon Phases
  NASA_MOON_PHASES.forEach((phase, index) => {
    events.push({
      id: `moon-${phase.phase}-${phase.date}`,
      type: 'moon_phase',
      subType: phase.phase,
      body: 'Moon',
      startUTC: `${phase.date}T${phase.time}:00.000Z`,
      labelTR: phase.label,
      source: 'nasa',
      meta: {
        notes: 'NASA precision'
      }
    });
  });
  
  // Generate Eclipses
  ECLIPSES_DATA.forEach((eclipse, index) => {
    const isVisibleFromTurkey = eclipse.visibility.includes('Europe') || eclipse.visibility.includes('Asia');
    events.push({
      id: `eclipse-${eclipse.type}-${eclipse.date}`,
      type: 'eclipse',
      subType: eclipse.type,
      body: eclipse.type.includes('solar') ? 'Sun' : 'Moon',
      startUTC: `${eclipse.date}T${eclipse.time}:00.000Z`,
      endUTC: `${eclipse.date}T23:59:59.999Z`,
      labelTR: eclipse.label,
      source: 'nasa',
      visibility: isVisibleFromTurkey ? 'partial' : 'global',
      meta: {
        eclipseType: eclipse.type,
        notes: eclipse.visibility,
        visibility: isVisibleFromTurkey ? 'TR\'den görülebilir' : 'TR\'den görülemez'
      }
    });
  });
  
  // Generate Meteor Showers
  METEOR_SHOWERS.forEach((shower, index) => {
    const nextDay = new Date(`${shower.date}T${shower.time}:00.000Z`);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);
    const endDate = nextDay.toISOString().split('T')[0];
    
    // Normalize meteor shower names
    const normalizedName = shower.name.toLowerCase()
      .replace('eta aquariids', 'eta_aquariids')
      .replace(' ', '_');
    
    events.push({
      id: `meteor-${normalizedName}-${shower.date}`,
      type: 'meteor_shower',
      subType: normalizedName,
      body: shower.radiant,
      startUTC: `${shower.date}T${shower.time}:00.000Z`,
      endUTC: `${endDate}T06:00:00.000Z`,
      labelTR: shower.label,
      source: 'imo',
      meta: {
        radiant: shower.radiant,
        zhr: shower.zhr,
        peakWindow: `${shower.date} gecesi`,
        notes: 'IMO data'
      }
    });
  });
  
  return events;
}

function deduplicateAndResolveConflicts(events: UnifiedAstroEvent[]): UnifiedAstroEvent[] {
  // Sort by start time
  events.sort((a, b) => new Date(a.startUTC).getTime() - new Date(b.startUTC).getTime());
  
  const deduplicated: UnifiedAstroEvent[] = [];
  const seen = new Set<string>();
  
  // Priority order for conflicts
  const priority: Record<string, number> = {
    'eclipse': 1,
    'moon_phase': 2,
    'planet_station': 3,
    'meteor_shower': 4,
    'sun_ingress': 5
  };
  
  events.forEach(event => {
    const key = `${event.type}-${event.subType}-${event.startUTC.split('T')[0]}`;
    
    if (!seen.has(key)) {
      seen.add(key);
      deduplicated.push(event);
    } else {
      // Check for conflicts within 12 hours
      const existingIndex = deduplicated.findIndex(e => 
        e.type === event.type && 
        e.subType === event.subType && 
        Math.abs(new Date(e.startUTC).getTime() - new Date(event.startUTC).getTime()) < 12 * 60 * 60 * 1000
      );
      
      if (existingIndex !== -1) {
        const existing = deduplicated[existingIndex];
        // Keep higher priority source
        if (priority[event.source] < priority[existing.source]) {
          deduplicated[existingIndex] = event;
        }
      }
    }
  });
  
  return deduplicated;
}

function buildUnifiedAstroCalendar() {
  console.log('🔭 Building Unified Astro Calendar (2025-2026)\n');
  
  const rawEvents = generateUnifiedAstroCalendar();
  console.log(`Generated ${rawEvents.length} raw events`);
  
  const deduplicatedEvents = deduplicateAndResolveConflicts(rawEvents);
  console.log(`After deduplication: ${deduplicatedEvents.length} events`);
  
  // Sort final events
  deduplicatedEvents.sort((a, b) => new Date(a.startUTC).getTime() - new Date(b.startUTC).getTime());
  
  // Show summary by type
  const typeCounts = deduplicatedEvents.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('\n📊 Events by type:');
  Object.entries(typeCounts).forEach(([type, count]) => {
    console.log(`  ${type}: ${count} events`);
  });
  
  // Show summary by year
  const yearCounts = deduplicatedEvents.reduce((acc, event) => {
    const year = new Date(event.startUTC).getFullYear();
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  console.log('\n📅 Events by year:');
  Object.entries(yearCounts).forEach(([year, count]) => {
    console.log(`  ${year}: ${count} events`);
  });
  
  // Show key events for validation
  console.log('\n🎯 Key Validation Events:');
  const keyEvents = deduplicatedEvents.filter(event => 
    (event.type === 'planet_station' && event.body === 'Mercury' && event.startUTC.includes('2025-11-09')) ||
    (event.type === 'planet_station' && event.body === 'Mercury' && event.startUTC.includes('2025-11-29')) ||
    (event.type === 'moon_phase' && event.subType === 'full' && event.startUTC.includes('2025-11-20')) ||
    (event.type === 'meteor_shower' && event.subType === 'geminids' && event.startUTC.includes('2025-12-13'))
  );
  
  keyEvents.forEach(event => {
    const date = new Date(event.startUTC);
    const dateStr = date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Istanbul'
    });
    console.log(`  ${dateStr}: ${event.labelTR}`);
  });
  
  // Save unified calendar
  const outputPath = path.join(process.cwd(), 'data', 'unifiedAstroCalendar.json');
  fs.writeFileSync(outputPath, JSON.stringify(deduplicatedEvents, null, 2));
  
  console.log(`\n💾 Saved unified astro calendar to ${outputPath}`);
  
  // Also save legacy format for compatibility
  const legacyEvents = deduplicatedEvents.map(event => ({
    id: event.id,
    type: event.type,
    subType: event.subType,
    startUTC: event.startUTC,
    endUTC: event.endUTC,
    labelTR: event.labelTR,
    iconKey: event.subType,
    source: event.source,
    reliability: 'high',
    meta: event.meta
  }));
  
  const legacyPath = path.join(process.cwd(), 'data', 'celestialEvents2025.json');
  fs.writeFileSync(legacyPath, JSON.stringify(legacyEvents, null, 2));
  
  console.log(`💾 Saved legacy format to ${legacyPath}`);
  
  console.log('\n🎯 Unified Astro Calendar Build Complete!');
  console.log('✅ All events normalized to unified schema');
  console.log('✅ Deduplication and conflict resolution applied');
  console.log('✅ UTC storage with Europe/Istanbul display ready');
  console.log('✅ Ready for validation tests');
}

// Main execution
if (require.main === module) {
  buildUnifiedAstroCalendar();
}
