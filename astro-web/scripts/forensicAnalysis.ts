#!/usr/bin/env npx tsx

/**
 * Forensic Analysis Script for Celestial Calendar
 * 
 * Purpose: Detect and classify anomalies in November 2025 celestial events
 * 
 * Anomaly Rules:
 * R1: Phase Rotation - Are phase names rotated 90° from correct order?
 * R2: Phase Double Day - Same phase appearing >1 time in 24h window?
 * R3: Missing 4 Phases - Less/more than 4 phases in month?
 * R4: UTC→TR Shift - Does UTC time convert to different day in TR?
 * 
 * Root Cause Classification:
 * K1: Phase mapping error (first/last/full/new mapping wrong order)
 * K2: Wrong lunation anchor (phases ~14-15 days shifted)
 * K3: Double timezone conversion (toUTC + timeZone applied twice)
 * K4: "YYYY-MM-DD" parsing (timestampless date creating local/UTC diff)
 * K5: API diff merging (same event from two sources, one wrong derivation)
 */

import fs from 'fs';
import path from 'path';

// Expected November 2025 data (from NASA/Swiss Ephemeris)
const EXPECTED_NOV_2025 = {
  moonPhases: [
    { date: '2025-11-05', phase: 'new', time: '13:20:00Z', name: 'Yeni Ay' },
    { date: '2025-11-12', phase: 'first', time: '05:28:00Z', name: 'İlk Dördün' },
    { date: '2025-11-20', phase: 'full', time: '06:47:00Z', name: 'Dolunay' },
    { date: '2025-11-28', phase: 'last', time: '06:59:00Z', name: 'Son Dördün' }
  ],
  mercuryStations: [
    { date: '2025-11-09', type: 'station_R', time: '12:00:00Z', name: 'Merkür Retrosu Başlıyor' },
    { date: '2025-11-29', type: 'station_D', time: '18:00:00Z', name: 'Merkür Retrosu Sona Eriyor' }
  ],
  sunIngress: [
    { date: '2025-11-22', sign: 'yay', time: '21:35:00Z', name: 'Güneş Yay Burcuna Geçiyor' }
  ]
};

interface CelestialEvent {
  id: string;
  title: string;
  date: string;
  type: string;
  description: string;
  icon: string;
  color: string;
}

interface AnomalyReport {
  rule: string;
  description: string;
  events: CelestialEvent[];
  rootCause: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

class ForensicAnalyzer {
  private anomalies: AnomalyReport[] = [];

  async analyzeNovember2025(): Promise<void> {
    console.log('🔍 Starting Forensic Analysis for November 2025...\n');

    // Load current calendar data
    const currentData = await this.loadCurrentData();
    
    // Run anomaly detection rules
    await this.runAnomalyRules(currentData);
    
    // Generate report
    this.generateReport();
  }

  private async loadCurrentData(): Promise<CelestialEvent[]> {
    try {
      // Try to load from API first
      const response = await fetch('http://localhost:3000/api/astro-events?year=2025&month=11');
      if (response.ok) {
        const data = await response.json();
        return data.events || [];
      }
    } catch (error) {
      console.log('⚠️  API not available, trying local files...');
    }

    // Fallback to local files
    const dataPath = path.join(process.cwd(), 'data', 'unifiedAstroCalendar.json');
    if (fs.existsSync(dataPath)) {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      return data.events || [];
    }

    throw new Error('No data source available');
  }

  private async runAnomalyRules(events: CelestialEvent[]): Promise<void> {
    console.log('📋 Running Anomaly Detection Rules...\n');

    // R1: Phase Rotation Check
    this.checkPhaseRotation(events);
    
    // R2: Phase Double Day Check
    this.checkPhaseDoubleDay(events);
    
    // R3: Missing 4 Phases Check
    this.checkMissingPhases(events);
    
    // R4: UTC→TR Shift Check
    this.checkUTCToTRShift(events);
    
    // Mercury Station Check
    this.checkMercuryStations(events);
    
    // Sun Ingress Check
    this.checkSunIngress(events);
  }

  private checkPhaseRotation(events: CelestialEvent[]): void {
    const moonPhases = events.filter(e => e.type === 'moon_phase');
    
    if (moonPhases.length !== 4) {
      this.anomalies.push({
        rule: 'R1',
        description: `Phase Rotation: Expected 4 phases, found ${moonPhases.length}`,
        events: moonPhases,
        rootCause: 'K1',
        severity: 'HIGH'
      });
      return;
    }

    // Check phase order
    const expectedOrder = ['new', 'first', 'full', 'last'];
    const actualOrder = moonPhases.map(p => {
      if (p.id.includes('new')) return 'new';
      if (p.id.includes('first')) return 'first';
      if (p.id.includes('full')) return 'full';
      if (p.id.includes('last')) return 'last';
      return 'unknown';
    });

    const isCorrectOrder = expectedOrder.every((phase, index) => 
      actualOrder[index] === phase
    );

    if (!isCorrectOrder) {
      this.anomalies.push({
        rule: 'R1',
        description: `Phase Rotation: Expected order ${expectedOrder.join('→')}, got ${actualOrder.join('→')}`,
        events: moonPhases,
        rootCause: 'K1',
        severity: 'HIGH'
      });
    }
  }

  private checkPhaseDoubleDay(events: CelestialEvent[]): void {
    const moonPhases = events.filter(e => e.type === 'moon_phase');
    const phaseGroups: { [key: string]: CelestialEvent[] } = {};

    moonPhases.forEach(phase => {
      const date = phase.date.split('T')[0];
      if (!phaseGroups[date]) {
        phaseGroups[date] = [];
      }
      phaseGroups[date].push(phase);
    });

    Object.entries(phaseGroups).forEach(([date, phases]) => {
      if (phases.length > 1) {
        this.anomalies.push({
          rule: 'R2',
          description: `Phase Double Day: ${phases.length} phases on ${date}`,
          events: phases,
          rootCause: 'K2',
          severity: 'MEDIUM'
        });
      }
    });
  }

  private checkMissingPhases(events: CelestialEvent[]): void {
    const moonPhases = events.filter(e => e.type === 'moon_phase');
    
    if (moonPhases.length !== 4) {
      this.anomalies.push({
        rule: 'R3',
        description: `Missing 4 Phases: Found ${moonPhases.length} instead of 4`,
        events: moonPhases,
        rootCause: 'K2',
        severity: 'HIGH'
      });
    }
  }

  private checkUTCToTRShift(events: CelestialEvent[]): void {
    const moonPhases = events.filter(e => e.type === 'moon_phase');
    
    moonPhases.forEach(phase => {
      const utcDate = new Date(phase.date);
      const trDate = new Date(utcDate.toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));
      
      const utcDay = utcDate.getUTCDate();
      const trDay = trDate.getDate();
      
      if (utcDay !== trDay) {
        this.anomalies.push({
          rule: 'R4',
          description: `UTC→TR Shift: UTC day ${utcDay} becomes TR day ${trDay} for ${phase.title}`,
          events: [phase],
          rootCause: 'K3',
          severity: 'MEDIUM'
        });
      }
    });
  }

  private checkMercuryStations(events: CelestialEvent[]): void {
    const mercuryEvents = events.filter(e => 
      e.title.includes('Merkür') && e.title.includes('Retrosu')
    );

    const expectedStations = EXPECTED_NOV_2025.mercuryStations;
    
    expectedStations.forEach(expected => {
      const found = mercuryEvents.find(event => {
        const eventDate = event.date.split('T')[0];
        return eventDate === expected.date;
      });

      if (!found) {
        this.anomalies.push({
          rule: 'Mercury Station',
          description: `Missing Mercury Station: ${expected.name} on ${expected.date}`,
          events: [],
          rootCause: 'K5',
          severity: 'HIGH'
        });
      }
    });
  }

  private checkSunIngress(events: CelestialEvent[]): void {
    const sunEvents = events.filter(e => 
      e.title.includes('Güneş') && e.title.includes('Yay')
    );

    const expectedIngress = EXPECTED_NOV_2025.sunIngress[0];
    const found = sunEvents.find(event => {
      const eventDate = event.date.split('T')[0];
      return eventDate === expectedIngress.date;
    });

    if (!found) {
      this.anomalies.push({
        rule: 'Sun Ingress',
        description: `Missing Sun Ingress: ${expectedIngress.name} on ${expectedIngress.date}`,
        events: [],
        rootCause: 'K5',
        severity: 'MEDIUM'
      });
    }
  }

  private generateReport(): void {
    console.log('📊 FORENSIC ANALYSIS REPORT\n');
    console.log('=' .repeat(50));
    
    if (this.anomalies.length === 0) {
      console.log('✅ No anomalies detected! Calendar is accurate.');
      return;
    }

    console.log(`🚨 Found ${this.anomalies.length} anomalies:\n`);

    this.anomalies.forEach((anomaly, index) => {
      console.log(`${index + 1}. ${anomaly.rule}: ${anomaly.description}`);
      console.log(`   Root Cause: ${anomaly.rootCause}`);
      console.log(`   Severity: ${anomaly.severity}`);
      if (anomaly.events.length > 0) {
        console.log(`   Affected Events: ${anomaly.events.length}`);
        anomaly.events.forEach(event => {
          console.log(`     - ${event.title} (${event.date})`);
        });
      }
      console.log('');
    });

    // Summary by root cause
    const rootCauseSummary = this.anomalies.reduce((acc, anomaly) => {
      acc[anomaly.rootCause] = (acc[anomaly.rootCause] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('📈 ROOT CAUSE SUMMARY:');
    Object.entries(rootCauseSummary).forEach(([cause, count]) => {
      console.log(`   ${cause}: ${count} issues`);
    });

    console.log('\n🔧 RECOMMENDED ACTIONS:');
    if (rootCauseSummary.K1) {
      console.log('   - Fix phase mapping order (K1)');
    }
    if (rootCauseSummary.K2) {
      console.log('   - Recalculate lunation anchor (K2)');
    }
    if (rootCauseSummary.K3) {
      console.log('   - Fix timezone conversion (K3)');
    }
    if (rootCauseSummary.K4) {
      console.log('   - Fix date parsing (K4)');
    }
    if (rootCauseSummary.K5) {
      console.log('   - Fix API data merging (K5)');
    }
  }
}

// Run the analysis
async function main() {
  const analyzer = new ForensicAnalyzer();
  await analyzer.analyzeNovember2025();
}

if (require.main === module) {
  main().catch(console.error);
}

export { ForensicAnalyzer };
