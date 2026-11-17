
function init() {
  ['tankGal', 'compressorConfig', 'pressSwitch', 'airLineSize'].forEach(id => {
    document.getElementById(id).addEventListener('change', calc);
  });
  calc();
}

function calc() {
  const gal = parseFloat(document.getElementById('tankGal').value)||5;
  const cfm = parseFloat(document.getElementById('compressorConfig').value)||3.52;
  const pSwitch = document.getElementById('pressSwitch').value;
  const line = document.getElementById('airLineSize').value;

  // Formula: Fill time in minutes = (Tank Gallons * Delta Pressure in Atmospheres) / (7.48 * Average CFM)
  // 1 atm ≈ 14.7 PSI
  const maxPsi = pSwitch === "150" ? 200 : 145;
  const lowPsi = pSwitch === "150" ? 165 : 110;

  // Average CFM drops as pressure rises: approx 0.65 of 0-PSI rating
  const effectiveCfm = cfm * 0.65;

  // 0 to Max PSI
  const emptyDeltaAtm = maxPsi / 14.7;
  const emptyMinutes = (gal * emptyDeltaAtm) / (7.48 * effectiveCfm);

  // Recovery (Low to Max PSI)
  const recDeltaAtm = (maxPsi - lowPsi) / 14.7;
  const recMinutes = (gal * recDeltaAtm) / (7.48 * effectiveCfm);

  const formatMinSec = (m) => {
    const mins = Math.floor(m);
    const secs = Math.round((m - mins) * 60);
    return `${mins} min ${secs} sec`;
  };

  // Lift speed: 1/4" ≈ 5s, 3/8" ≈ 2.5s, 1/2" ≈ 1.2s
  let speedText = "≈ 2.5 Seconds";
  if (line === "0.25") speedText = "≈ 5.0 Seconds (Smooth/Precise)";
  else if (line === "0.50") speedText = "≈ 1.2 Seconds (Fast Pop/Slam)";

  // Electrical amps: each 444C is 23A, 485C is 25A
  const amps = cfm > 3.0 ? "46–50 Amps @ 12V" : "23–25 Amps @ 12V";

  document.getElementById('recoveryTime').textContent = formatMinSec(recMinutes);
  document.getElementById('emptyFillSummary').textContent = `Initial Fill (0 to ${maxPsi} PSI): ${formatMinSec(emptyMinutes)}`;
  document.getElementById('liftSpeed').textContent = speedText;
  document.getElementById('totalAmps').textContent = amps;
}
window.addEventListener('DOMContentLoaded', init);
