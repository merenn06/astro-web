import { getMoonPhases } from "@/lib/moonPhase";
import MoonPhaseClient from "./MoonPhaseClient";

export default async function MoonPhaseServer() {
  const phases = getMoonPhases(new Date(), 30);
  
  return <MoonPhaseClient phases={phases} />;
} 