import { SelectedBuild, BuildSummary, DroneComponent } from './types';
import { ASSEMBLY_PRICE } from './droneData';

export function calculateBuildSummary(build: SelectedBuild): BuildSummary {
  const components = Object.values(build).filter(Boolean) as DroneComponent[];

  const totalPrice = components.reduce((sum, c) => sum + c.price, 0) + ASSEMBLY_PRICE;
  const totalWeight = components.reduce((sum, c) => sum + c.weight, 0);

  // Estimate flight time based on battery capacity and total weight
  const battery = build.battery;
  let estimatedFlightTime = 0;
  if (battery) {
    const capacityMah = parseInt(battery.specs.capacidade) || 1500;
    // Rough estimate: heavier drone uses more current
    const currentDraw = (totalWeight / 1000) * 15; // amps (rough estimate)
    estimatedFlightTime = Math.round((capacityMah / 1000 / currentDraw) * 60 * 0.8); // 80% usable
    estimatedFlightTime = Math.max(3, Math.min(30, estimatedFlightTime)); // clamp between 3-30 min
  }

  // Determine performance level based on components chosen
  const hasHighEndMotor =
    build.motor?.id.includes('fpv') || build.motor?.id.includes('freestyle');
  const hasHighEndFC =
    build.flightController?.specs.processador === 'H7' ||
    build.flightController?.specs.processador === 'H743';
  const hasCinemaSetup =
    build.camera?.brand === 'GoPro' || build.camera?.brand === 'DJI';
  const hasDigitalFPV = build.camera?.id.includes('digital') || build.vtx?.id.includes('dji');

  let performanceLevel: BuildSummary['performanceLevel'] = 'iniciante';
  const score = [hasHighEndMotor, hasHighEndFC, hasCinemaSetup, hasDigitalFPV].filter(
    Boolean
  ).length;
  if (score >= 3) performanceLevel = 'profissional';
  else if (score >= 2) performanceLevel = 'avançado';
  else if (score >= 1) performanceLevel = 'intermediário';

  const { ok, warnings } = checkCompatibility(build);

  return {
    components: build,
    totalPrice,
    totalWeight,
    estimatedFlightTime,
    performanceLevel,
    compatibilityOk: ok,
    warnings,
    assemblyPrice: ASSEMBLY_PRICE,
  };
}

export function checkCompatibility(build: SelectedBuild): {
  ok: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  // Check frame size vs motor size
  if (build.frame && build.motor) {
    const frameIs5inch =
      build.frame.specs.tamanho === '5"';
    const frameIs7inch =
      build.frame.specs.tamanho === '7"';
    const motorSize = parseInt(build.motor.specs.tamanho) || 0;

    if (frameIs5inch && motorSize >= 2800) {
      warnings.push('Motor muito grande para frame 5". Considere motores 2306–2207.');
    }
    if (frameIs7inch && motorSize < 2300) {
      warnings.push('Motor pode ser pequeno para frame 7". Considere motores 2806+.');
    }
  }

  // Check ESC current vs motor power needs
  if (build.esc && build.motor) {
    const escCurrent = parseInt(build.esc.specs.corrente) || 0;
    const motorKv = parseInt(build.motor.specs.kv) || 0;
    if (motorKv > 2400 && escCurrent < 40) {
      warnings.push('ESC com corrente baixa para motores de alta KV. Considere ESC 40A+.');
    }
  }

  // Check battery voltage vs motor compatibility
  if (build.battery && build.motor) {
    const batteryCells = parseInt(build.battery.specs.células) || 4;
    const motorVoltage = build.motor.specs.tensão || '4S';
    if (batteryCells === 6 && !motorVoltage.includes('6S')) {
      warnings.push('Bateria 6S pode exceder o limite de tensão dos motores selecionados.');
    }
  }

  // Camera and VTX system check
  if (build.camera && build.vtx) {
    const cameraIsDJI = build.camera.id.includes('digital') || build.camera.brand === 'DJI';
    const vtxIsDJI = build.vtx.id.includes('dji');
    if (cameraIsDJI && !vtxIsDJI) {
      warnings.push(
        'Câmera DJI Digital requer o sistema VTX DJI. O VTX analógico não é compatível.'
      );
    }
  }

  // Receiver and radio protocol check
  if (build.receiver && build.radio) {
    const rxIsELRS = build.receiver.specs.protocolo === 'ExpressLRS';
    const radioSupportsELRS =
      build.radio.specs.protocolo?.includes('ELRS') ?? false;
    if (rxIsELRS && !radioSupportsELRS) {
      warnings.push('Receptor ELRS requer um rádio com módulo ELRS. Verifique compatibilidade.');
    }
  }

  return {
    ok: warnings.length === 0,
    warnings,
  };
}

export function getWarningSteps(build: SelectedBuild): Set<string> {
  const steps = new Set<string>();

  if (build.frame && build.motor) {
    const frameIs5inch = build.frame.specs.tamanho === '5"';
    const frameIs7inch = build.frame.specs.tamanho === '7"';
    const motorSize = parseInt(build.motor.specs.tamanho) || 0;
    if ((frameIs5inch && motorSize >= 2800) || (frameIs7inch && motorSize < 2300)) {
      steps.add('frame');
      steps.add('motor');
    }
  }

  if (build.esc && build.motor) {
    const escCurrent = parseInt(build.esc.specs.corrente) || 0;
    const motorKv = parseInt(build.motor.specs.kv) || 0;
    if (motorKv > 2400 && escCurrent < 40) {
      steps.add('esc');
      steps.add('motor');
    }
  }

  if (build.battery && build.motor) {
    const batteryCells = parseInt(build.battery.specs.células) || 4;
    const motorVoltage = build.motor.specs.tensão || '4S';
    if (batteryCells === 6 && !motorVoltage.includes('6S')) {
      steps.add('battery');
      steps.add('motor');
    }
  }

  if (build.camera && build.vtx) {
    const cameraIsDJI = build.camera.id.includes('digital') || build.camera.brand === 'DJI';
    const vtxIsDJI = build.vtx.id.includes('dji');
    if (cameraIsDJI && !vtxIsDJI) {
      steps.add('camera');
      steps.add('vtx');
    }
  }

  if (build.receiver && build.radio) {
    const rxIsELRS = build.receiver.specs.protocolo === 'ExpressLRS';
    const radioSupportsELRS = build.radio.specs.protocolo?.includes('ELRS') ?? false;
    if (rxIsELRS && !radioSupportsELRS) {
      steps.add('receiver');
      steps.add('radio');
    }
  }

  return steps;
}

export function getComponentsForCategory(
  components: DroneComponent[],
  categoryId: string
): DroneComponent[] {
  return components.filter((c) => c.compatibleCategories.includes(categoryId as never));
}
