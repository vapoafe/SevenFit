import React, { useEffect, useRef, useState } from 'react';
import { AnimationType, MuscleGroup } from '../types/workout';
import { Play, Pause, FastForward, RotateCcw } from 'lucide-react';

interface MannequinProps {
  animationType: AnimationType;
  targetMuscles?: MuscleGroup[];
  isRest?: boolean;
  className?: string;
  showControls?: boolean;
  exerciseName?: string;
}

export const MannequinAnimation: React.FC<MannequinProps> = ({
  animationType,
  targetMuscles = [],
  isRest = false,
  className = 'w-full h-64 md:h-72',
  showControls = true,
  exerciseName = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1.0);
  const animFrameId = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (isPlaying) {
        // Increment animation cycle phase (0 to 2*PI)
        phaseRef.current = (phaseRef.current + dt * 2.2 * speed) % (Math.PI * 2);
      }

      const p = phaseRef.current;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2 + 10;

      // Check current theme
      const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light' ||
                            document.documentElement.classList.contains('theme-light') ||
                            document.documentElement.classList.contains('light');

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Floor grid line
      ctx.save();
      ctx.strokeStyle = isLightTheme ? 'rgba(100, 116, 139, 0.35)' : 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(25, cy + 95);
      ctx.lineTo(width - 25, cy + 95);
      ctx.stroke();
      ctx.restore();

      if (isRest) {
        drawRestPose(ctx, cx, cy, p, isLightTheme);
      } else {
        drawExerciseAnimation(ctx, cx, cy, p, animationType, targetMuscles, isLightTheme);
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [animationType, isPlaying, speed, isRest, targetMuscles]);

  // Helper drawing functions
  const drawRestPose = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    p: number,
    isLight: boolean
  ) => {
    // Gentle breathing standing mannequin with hands on hips
    const breath = Math.sin(p * 0.8) * 3;
    const head = { x: cx, y: cy - 75 + breath };
    const chest = { x: cx, y: cy - 40 + breath };
    const hips = { x: cx, y: cy + 10 };
    const lHand = { x: cx - 35, y: cy - 10 };
    const rHand = { x: cx + 35, y: cy - 10 };
    const lFoot = { x: cx - 25, y: cy + 95 };
    const rFoot = { x: cx + 25, y: cy + 95 };

    const limbColor = isLight ? '#475569' : '#94a3b8';
    const legColor = isLight ? '#334155' : '#64748b';
    const headColor = isLight ? '#1e293b' : '#e2e8f0';

    drawLimb(ctx, chest, { x: cx - 28, y: cy - 25 }, lHand, 7, limbColor);
    drawLimb(ctx, chest, { x: cx + 28, y: cy - 25 }, rHand, 7, limbColor);
    drawLimb(ctx, hips, { x: cx - 22, y: cy + 50 }, lFoot, 9, legColor);
    drawLimb(ctx, hips, { x: cx + 22, y: cy + 50 }, rFoot, 9, legColor);
    drawTorso(ctx, chest, hips, 26, '#38bdf8', false);
    drawHead(ctx, head, 14, headColor);

    // Rest text
    ctx.save();
    ctx.font = '700 12px system-ui, sans-serif';
    ctx.fillStyle = isLight ? '#0284c7' : '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('BREATHE & RECOVER', cx, cy + 122);
    ctx.restore();
  };

  const drawExerciseAnimation = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    p: number,
    type: AnimationType,
    muscles: MuscleGroup[],
    isLight: boolean
  ) => {
    const s = Math.sin(p);
    const c = Math.cos(p);
    const absSin = Math.abs(s);

    const hasChest = muscles.includes('chest');
    const hasAbs = muscles.includes('abs') || muscles.includes('obliques');
    const hasQuads = muscles.includes('quads') || muscles.includes('glutes') || muscles.includes('hamstrings');
    const hasArms = muscles.includes('triceps') || muscles.includes('shoulders');
    const hasCalves = muscles.includes('calves');
    const hasBack = muscles.includes('back');

    const primaryGlow = '#f43f5e'; // Rose
    const secondaryGlow = '#38bdf8'; // Sky
    const limbBase = isLight ? '#475569' : '#cbd5e1';
    const headColor = isLight ? '#1e293b' : '#f8fafc';

    switch (type) {
      case 'jumping_jacks': {
        // Jumping jacks: arms arc overhead, legs spread out & in
        const spread = (s + 1) / 2; // 0 to 1
        const jumpY = -absSin * 16;
        const head = { x: cx, y: cy - 70 + jumpY };
        const chest = { x: cx, y: cy - 35 + jumpY };
        const hips = { x: cx, y: cy + 10 + jumpY };

        // Arms: 0 = down by hips, 1 = overhead clapping
        const armAngle = -Math.PI / 2 + spread * (Math.PI * 0.9);
        const lElbow = { x: chest.x - Math.sin(armAngle) * 30, y: chest.y - Math.cos(armAngle) * 30 };
        const lHand = { x: chest.x - Math.sin(armAngle) * 60, y: chest.y - Math.cos(armAngle) * 60 };
        const rElbow = { x: chest.x + Math.sin(armAngle) * 30, y: chest.y - Math.cos(armAngle) * 30 };
        const rHand = { x: chest.x + Math.sin(armAngle) * 60, y: chest.y - Math.cos(armAngle) * 60 };

        // Legs: 0 = narrow, 1 = wide
        const legSpreadX = 14 + spread * 42;
        const lFoot = { x: cx - legSpreadX, y: cy + 95 };
        const rFoot = { x: cx + legSpreadX, y: cy + 95 };
        const lKnee = { x: cx - legSpreadX * 0.6, y: cy + 50 + jumpY * 0.5 };
        const rKnee = { x: cx + legSpreadX * 0.6, y: cy + 50 + jumpY * 0.5 };

        drawLimb(ctx, chest, lElbow, lHand, 7, hasArms ? primaryGlow : limbBase);
        drawLimb(ctx, chest, rElbow, rHand, 7, hasArms ? primaryGlow : limbBase);
        drawLimb(ctx, hips, lKnee, lFoot, 9, hasQuads || hasCalves ? primaryGlow : limbBase);
        drawLimb(ctx, hips, rKnee, rFoot, 9, hasQuads || hasCalves ? primaryGlow : limbBase);
        drawTorso(ctx, chest, hips, 24, hasAbs ? primaryGlow : secondaryGlow, true);
        drawHead(ctx, head, 14, headColor);
        break;
      }

      case 'wall_sit': {
        // Wall Sit: back against wall, 90 deg knees
        const wallX = cx - 40;
        // Draw vertical wall indicator
        ctx.save();
        ctx.strokeStyle = isLight ? '#94a3b8' : '#475569';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(wallX - 8, cy - 80);
        ctx.lineTo(wallX - 8, cy + 95);
        ctx.stroke();

        // Wall bricks texture
        ctx.strokeStyle = isLight ? '#cbd5e1' : '#334155';
        ctx.lineWidth = 1.5;
        for (let y = cy - 70; y < cy + 90; y += 22) {
          ctx.beginPath();
          ctx.moveTo(wallX - 16, y);
          ctx.lineTo(wallX - 8, y);
          ctx.stroke();
        }
        ctx.restore();

        const head = { x: wallX + 8, y: cy - 65 };
        const chest = { x: wallX + 8, y: cy - 30 };
        const hips = { x: wallX + 8, y: cy + 25 };
        const knee = { x: wallX + 60, y: cy + 25 };
        const foot = { x: wallX + 60, y: cy + 95 };

        drawLimb(ctx, chest, { x: wallX + 25, y: cy - 10 }, { x: wallX + 40, y: cy + 10 }, 7, limbBase);
        drawLimb(ctx, hips, knee, foot, 11, primaryGlow);
        drawTorso(ctx, chest, hips, 24, secondaryGlow, true);
        drawHead(ctx, head, 13, headColor);
        break;
      }

      case 'pushups': {
        // Pushups: horizontal prone position lowering chest
        const dip = (s + 1) / 2; // 0 up, 1 chest to floor
        const chestY = cy + 45 + dip * 35;
        const hipsY = cy + 42 + dip * 26;
        const headY = cy + 42 + dip * 36;

        const head = { x: cx - 65, y: headY };
        const chest = { x: cx - 40, y: chestY };
        const hips = { x: cx + 20, y: hipsY };
        const feet = { x: cx + 85, y: cy + 88 };

        // Hands planted firmly on floor
        const hands = { x: cx - 40, y: cy + 92 };
        const elbowX = cx - 55 - dip * 15;
        const elbowY = cy + 55 + dip * 20;

        // Draw body
        drawLimb(ctx, hips, { x: cx + 55, y: (hipsY + 88) / 2 }, feet, 9, limbBase);
        drawLimb(ctx, chest, { x: elbowX, y: elbowY }, hands, 8, hasArms || hasChest ? primaryGlow : limbBase);
        drawTorso(ctx, chest, hips, 24, hasChest ? primaryGlow : secondaryGlow, true);
        drawHead(ctx, head, 13, headColor);
        break;
      }

      case 'crunches': {
        // Lying on floor, curling shoulders up toward bent knees
        const crunch = (s + 1) / 2; // 0 flat, 1 crunched
        const head = { x: cx - 45 + crunch * 18, y: cy + 60 - crunch * 38 };
        const chest = { x: cx - 20 + crunch * 12, y: cy + 68 - crunch * 28 };
        const hips = { x: cx + 20, y: cy + 80 };
        const knees = { x: cx + 55, y: cy + 35 };
        const feet = { x: cx + 75, y: cy + 88 };

        // Hands near ears
        const hands = { x: head.x + 8, y: head.y + 6 };

        drawLimb(ctx, hips, knees, feet, 9, limbBase);
        drawLimb(ctx, chest, { x: head.x - 10, y: head.y + 15 }, hands, 7, limbBase);
        drawTorso(ctx, chest, hips, 24, primaryGlow, true);
        drawHead(ctx, head, 13, headColor);
        break;
      }

      case 'step_ups': {
        // Step-up onto chair / step bench
        const stepProgress = (s + 1) / 2; // 0 on floor, 1 fully stood on step
        const benchX = cx + 25;
        const benchY = cy + 45;
        const benchW = 75;
        const benchH = 50;

        // Draw step bench / box
        ctx.save();
        ctx.fillStyle = isLight ? 'rgba(203, 213, 225, 0.7)' : 'rgba(51, 65, 85, 0.6)';
        ctx.fillRect(benchX, benchY, benchW, benchH);
        ctx.strokeStyle = isLight ? '#94a3b8' : '#64748b';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(benchX, benchY, benchW, benchH);
        ctx.restore();

        const lift = stepProgress * 42; // total body lift height
        const forward = stepProgress * 30; // forward shift onto box

        const head = { x: cx - 25 + forward, y: cy - 65 - lift };
        const chest = { x: cx - 25 + forward, y: cy - 30 - lift };
        const hips = { x: cx - 25 + forward, y: cy + 15 - lift };

        // Lead leg (stepping up onto bench)
        const leadFoot = { x: benchX + 25, y: benchY };
        const leadKnee = {
          x: hips.x + (leadFoot.x - hips.x) * 0.6 + (1 - stepProgress) * 15,
          y: hips.y + (leadFoot.y - hips.y) * 0.5 - (1 - stepProgress) * 10
        };

        // Trailing leg (pushing off floor or joining on bench)
        const trailFoot = {
          x: cx - 35 + forward * 0.8,
          y: cy + 95 - stepProgress * 50
        };
        const trailKnee = {
          x: hips.x - 10 + forward * 0.4,
          y: (hips.y + trailFoot.y) / 2
        };

        // Arms swinging in natural athletic cadence
        const lHand = { x: chest.x - 20 - stepProgress * 10, y: chest.y + 25 };
        const rHand = { x: chest.x + 20 + stepProgress * 15, y: chest.y + 15 };

        drawLimb(ctx, chest, { x: chest.x - 12, y: chest.y + 10 }, lHand, 7, limbBase);
        drawLimb(ctx, chest, { x: chest.x + 12, y: chest.y + 10 }, rHand, 7, limbBase);
        drawLimb(ctx, hips, leadKnee, leadFoot, 10, primaryGlow);
        drawLimb(ctx, hips, trailKnee, trailFoot, 9, hasQuads ? primaryGlow : limbBase);
        drawTorso(ctx, chest, hips, 24, secondaryGlow, true);
        drawHead(ctx, head, 14, headColor);
        break;
      }

      case 'squats': {
        // Squats: hips hinge back, knees bend to 90 degrees
        const depth = (s + 1) / 2; // 0 standing, 1 deep squat
        const squatDrop = depth * 45;
        const hipShift = -depth * 25; // hips back
        const chestLean = depth * 15;

        const head = { x: cx + chestLean, y: cy - 75 + squatDrop };
        const chest = { x: cx + chestLean * 0.8, y: cy - 40 + squatDrop };
        const hips = { x: cx + hipShift, y: cy + 10 + squatDrop };

        // Arms reach forward for balance
        const lHand = { x: cx + 45 + depth * 15, y: cy - 25 + squatDrop };
        const rHand = { x: cx + 45 + depth * 15, y: cy - 25 + squatDrop };

        const feetX = cx + 5;
        const lFoot = { x: feetX, y: cy + 95 };
        const rFoot = { x: feetX + 15, y: cy + 95 };

        // Knee bends forward slightly as hips go back
        const kneeX = cx + 25 + depth * 10;
        const kneeY = cy + 55 + squatDrop * 0.4;

        drawLimb(ctx, chest, { x: cx + 20, y: cy - 30 + squatDrop }, lHand, 7, limbBase);
        drawLimb(ctx, hips, { x: kneeX, y: kneeY }, lFoot, 10, primaryGlow);
        drawLimb(ctx, hips, { x: kneeX + 10, y: kneeY }, rFoot, 10, primaryGlow);
        drawTorso(ctx, chest, hips, 26, hasAbs ? primaryGlow : secondaryGlow, true);
        drawHead(ctx, head, 14, headColor);
        break;
      }

      case 'tricep_dips': {
        // Chair / Bench Triceps dip
        const dip = (s + 1) / 2;
        const chairX = cx - 35;

        // Chair silhouette
        ctx.save();
        ctx.fillStyle = isLight ? 'rgba(203, 213, 225, 0.7)' : 'rgba(51, 65, 85, 0.5)';
        ctx.fillRect(chairX - 35, cy + 15, 35, 80);
        ctx.strokeStyle = isLight ? '#94a3b8' : '#64748b';
        ctx.lineWidth = 2;
        ctx.strokeRect(chairX - 35, cy + 15, 35, 80);
        ctx.restore();

        const drop = dip * 35;
        const head = { x: cx - 10, y: cy - 45 + drop };
        const chest = { x: cx - 10, y: cy - 15 + drop };
        const hips = { x: cx - 10, y: cy + 25 + drop };
        const knees = { x: cx + 30, y: cy + 55 + drop * 0.4 };
        const feet = { x: cx + 45, y: cy + 95 };
        const hands = { x: chairX - 2, y: cy + 15 };
        const elbows = { x: chairX - 18, y: cy - 2 + drop * 0.5 };

        drawLimb(ctx, chest, elbows, hands, 8, primaryGlow);
        drawLimb(ctx, hips, knees, feet, 9, limbBase);
        drawTorso(ctx, chest, hips, 24, secondaryGlow, true);
        drawHead(ctx, head, 13, headColor);
        break;
      }

      case 'plank': {
        // High Plank: rigid horizontal posture with micro breathing pulse
        const breath = Math.sin(p * 2) * 2;
        const head = { x: cx - 65, y: cy + 40 + breath };
        const chest = { x: cx - 40, y: cy + 45 + breath };
        const hips = { x: cx + 20, y: cy + 40 };
        const feet = { x: cx + 85, y: cy + 88 };
        const hands = { x: cx - 40, y: cy + 92 };

        drawLimb(ctx, hips, { x: cx + 55, y: cy + 64 }, feet, 9, limbBase);
        drawLimb(ctx, chest, { x: cx - 40, y: cy + 68 }, hands, 8, hasArms ? primaryGlow : limbBase);
        drawTorso(ctx, chest, hips, 24, primaryGlow, true);
        drawHead(ctx, head, 13, headColor);
        break;
      }

      case 'high_knees': {
        // Rapid alternating high knee sprint
        const legPhase = s; // -1 to 1
        const head = { x: cx, y: cy - 75 };
        const chest = { x: cx, y: cy - 40 };
        const hips = { x: cx, y: cy + 10 };

        // Left knee vs Right knee alternating
        const lKneeY = legPhase > 0 ? cy - 5 : cy + 55;
        const rKneeY = legPhase <= 0 ? cy - 5 : cy + 55;
        const lFootY = legPhase > 0 ? cy + 40 : cy + 95;
        const rFootY = legPhase <= 0 ? cy + 40 : cy + 95;

        // Arms pumping opposing legs
        const lArmY = legPhase > 0 ? cy - 35 : cy - 5;
        const rArmY = legPhase <= 0 ? cy - 35 : cy - 5;

        drawLimb(ctx, chest, { x: cx - 25, y: cy - 25 }, { x: cx - 35, y: lArmY }, 7, limbBase);
        drawLimb(ctx, chest, { x: cx + 25, y: cy - 25 }, { x: cx + 35, y: rArmY }, 7, limbBase);
        drawLimb(ctx, hips, { x: cx - 20, y: lKneeY }, { x: cx - 20, y: lFootY }, 9, primaryGlow);
        drawLimb(ctx, hips, { x: cx + 20, y: rKneeY }, { x: cx + 20, y: rFootY }, 9, primaryGlow);
        drawTorso(ctx, chest, hips, 24, secondaryGlow, true);
        drawHead(ctx, head, 14, headColor);
        break;
      }

      case 'lunges': {
        // Forward lunge
        const step = (s + 1) / 2; // 0 to 1
        const drop = step * 40;
        const head = { x: cx, y: cy - 70 + drop };
        const chest = { x: cx, y: cy - 35 + drop };
        const hips = { x: cx, y: cy + 15 + drop };

        const frontKnee = { x: cx + 45, y: cy + 55 + drop * 0.6 };
        const frontFoot = { x: cx + 45, y: cy + 95 };
        const backKnee = { x: cx - 35, y: cy + 60 + drop * 0.8 };
        const backFoot = { x: cx - 55, y: cy + 95 };

        drawLimb(ctx, chest, { x: cx + 15, y: cy - 10 + drop }, { x: cx + 15, y: cy + 15 + drop }, 7, limbBase);
        drawLimb(ctx, hips, frontKnee, frontFoot, 10, primaryGlow);
        drawLimb(ctx, hips, backKnee, backFoot, 9, primaryGlow);
        drawTorso(ctx, chest, hips, 24, secondaryGlow, true);
        drawHead(ctx, head, 14, headColor);
        break;
      }

      case 'pushup_rotation': {
        // Push-up & Dynamic Torso T-Rotation
        const cycle = (p % (Math.PI * 2)) / (Math.PI * 2); // 0 to 1

        if (cycle < 0.45) {
          // Push-up phase (down and up)
          const dip = Math.sin((cycle / 0.45) * Math.PI);
          const chestY = cy + 45 + dip * 35;
          const hipsY = cy + 42 + dip * 25;
          const headY = cy + 42 + dip * 35;

          const head = { x: cx - 50, y: headY };
          const chest = { x: cx - 30, y: chestY };
          const hips = { x: cx + 25, y: hipsY };
          const feet = { x: cx + 80, y: cy + 88 };
          const hands = { x: cx - 30, y: cy + 92 };

          drawLimb(ctx, hips, { x: cx + 55, y: (hipsY + 88) / 2 }, feet, 9, limbBase);
          drawLimb(ctx, chest, { x: cx - 45 - dip * 15, y: cy + 58 + dip * 18 }, hands, 8, primaryGlow);
          drawTorso(ctx, chest, hips, 24, primaryGlow, true);
          drawHead(ctx, head, 13, headColor);
        } else {
          // Rotation phase: rotating torso into T-stand
          const rotProgress = Math.sin(((cycle - 0.45) / 0.55) * Math.PI); // 0 to 1 to 0
          const armAngle = -Math.PI / 2 - rotProgress * (Math.PI * 0.45);

          const head = { x: cx - 45 + rotProgress * 15, y: cy + 30 - rotProgress * 15 };
          const chest = { x: cx - 25, y: cy + 42 - rotProgress * 10 };
          const hips = { x: cx + 25, y: cy + 42 - rotProgress * 5 };
          const feet = { x: cx + 80, y: cy + 88 };
          const baseHand = { x: cx - 25, y: cy + 92 };

          // Top reaching hand
          const topHand = {
            x: chest.x - Math.cos(armAngle) * 55,
            y: chest.y + Math.sin(armAngle) * 55
          };

          drawLimb(ctx, hips, { x: cx + 55, y: cy + 65 }, feet, 9, limbBase);
          drawLimb(ctx, chest, { x: cx - 25, y: cy + 68 }, baseHand, 8, limbBase);
          drawLimb(ctx, chest, { x: (chest.x + topHand.x) / 2, y: (chest.y + topHand.y) / 2 }, topHand, 8, primaryGlow);
          drawTorso(ctx, chest, hips, 24, primaryGlow, true);
          drawHead(ctx, head, 13, headColor);
        }
        break;
      }

      case 'side_plank': {
        // Lateral plank with top arm extended to sky
        const head = { x: cx - 45, y: cy + 30 };
        const chest = { x: cx - 20, y: cy + 40 };
        const hips = { x: cx + 30, y: cy + 55 };
        const feet = { x: cx + 80, y: cy + 88 };

        const bottomElbow = { x: cx - 20, y: cy + 88 };
        const topHand = { x: cx - 20, y: cy - 40 };

        drawLimb(ctx, chest, { x: cx - 20, y: cy }, topHand, 7, limbBase);
        drawLimb(ctx, chest, bottomElbow, bottomElbow, 8, limbBase);
        drawLimb(ctx, hips, { x: cx + 55, y: cy + 70 }, feet, 9, limbBase);
        drawTorso(ctx, chest, hips, 24, primaryGlow, true);
        drawHead(ctx, head, 13, headColor);
        break;
      }

      case 'burpees': {
        // Multi-phase burpee cycle
        const phase = (p % (Math.PI * 2)) / (Math.PI * 2); // 0 to 1
        if (phase < 0.25) {
          // Standing jump
          const jump = Math.sin((phase / 0.25) * Math.PI) * 45;
          const head = { x: cx, y: cy - 70 - jump };
          const chest = { x: cx, y: cy - 35 - jump };
          const hips = { x: cx, y: cy + 10 - jump };
          const feet = { x: cx, y: cy + 95 - jump };
          drawLimb(ctx, chest, { x: cx - 25, y: cy - 65 - jump }, { x: cx - 20, y: cy - 90 - jump }, 7, primaryGlow);
          drawLimb(ctx, chest, { x: cx + 25, y: cy - 65 - jump }, { x: cx + 20, y: cy - 90 - jump }, 7, primaryGlow);
          drawLimb(ctx, hips, { x: cx, y: cy + 50 - jump }, feet, 9, primaryGlow);
          drawTorso(ctx, chest, hips, 24, primaryGlow, true);
          drawHead(ctx, head, 14, headColor);
        } else if (phase < 0.75) {
          // Prone pushup plank
          const push = Math.sin(((phase - 0.25) / 0.5) * Math.PI) * 20;
          const head = { x: cx - 55, y: cy + 45 + push };
          const chest = { x: cx - 35, y: cy + 50 + push };
          const hips = { x: cx + 20, y: cy + 45 + push * 0.7 };
          const feet = { x: cx + 80, y: cy + 88 };
          const hands = { x: cx - 35, y: cy + 92 };
          drawLimb(ctx, hips, { x: cx + 50, y: cy + 65 }, feet, 9, primaryGlow);
          drawLimb(ctx, chest, { x: cx - 45, y: cy + 65 + push }, hands, 8, primaryGlow);
          drawTorso(ctx, chest, hips, 24, primaryGlow, true);
          drawHead(ctx, head, 13, headColor);
        } else {
          // Squat thrust in/out
          const squatHead = { x: cx - 15, y: cy + 15 };
          const squatChest = { x: cx - 5, y: cy + 35 };
          const squatHips = { x: cx + 15, y: cy + 50 };
          const squatKnees = { x: cx + 5, y: cy + 65 };
          const squatFeet = { x: cx + 15, y: cy + 88 };
          const squatHands = { x: cx - 30, y: cy + 90 };
          drawLimb(ctx, squatChest, { x: cx - 20, y: cy + 60 }, squatHands, 7, primaryGlow);
          drawLimb(ctx, squatHips, squatKnees, squatFeet, 9, primaryGlow);
          drawTorso(ctx, squatChest, squatHips, 24, primaryGlow, true);
          drawHead(ctx, squatHead, 13, headColor);
        }
        break;
      }

      case 'mountain_climbers': {
        // Fast piston knee drives in plank
        const legPiston = s; // -1 to 1
        const head = { x: cx - 55, y: cy + 35 };
        const chest = { x: cx - 35, y: cy + 42 };
        const hips = { x: cx + 20, y: cy + 38 };
        const hands = { x: cx - 35, y: cy + 90 };

        const lKneeX = legPiston > 0 ? cx - 10 : cx + 45;
        const lKneeY = legPiston > 0 ? cy + 55 : cy + 60;
        const lFootX = legPiston > 0 ? cx - 5 : cx + 80;

        const rKneeX = legPiston <= 0 ? cx - 10 : cx + 45;
        const rKneeY = legPiston <= 0 ? cy + 55 : cy + 60;
        const rFootX = legPiston <= 0 ? cx - 5 : cx + 80;

        drawLimb(ctx, hips, { x: lKneeX, y: lKneeY }, { x: lFootX, y: cy + 88 }, 9, primaryGlow);
        drawLimb(ctx, hips, { x: rKneeX, y: rKneeY }, { x: rFootX, y: cy + 88 }, 9, primaryGlow);
        drawLimb(ctx, chest, { x: cx - 35, y: cy + 65 }, hands, 8, limbBase);
        drawTorso(ctx, chest, hips, 24, primaryGlow, true);
        drawHead(ctx, head, 13, headColor);
        break;
      }

      case 'bicycle_crunches': {
        // Rotational bicycle pedaling
        const rotPhase = s; // -1 to 1
        const head = { x: cx - 35, y: cy + 45 };
        const chest = { x: cx - 15, y: cy + 55 };
        const hips = { x: cx + 20, y: cy + 75 };

        const lKnee = { x: rotPhase > 0 ? cx + 5 : cx + 45, y: rotPhase > 0 ? cy + 40 : cy + 65 };
        const rKnee = { x: rotPhase <= 0 ? cx + 5 : cx + 45, y: rotPhase <= 0 ? cy + 40 : cy + 65 };

        drawLimb(ctx, hips, lKnee, { x: rotPhase > 0 ? cx + 25 : cx + 75, y: cy + 55 }, 8, primaryGlow);
        drawLimb(ctx, hips, rKnee, { x: rotPhase <= 0 ? cx + 25 : cx + 75, y: cy + 55 }, 8, primaryGlow);
        drawLimb(ctx, chest, { x: cx - 25, y: cy + 35 }, { x: cx - 10, y: cy + 40 }, 7, primaryGlow);
        drawTorso(ctx, chest, hips, 24, primaryGlow, true);
        drawHead(ctx, head, 13, headColor);
        break;
      }

      case 'glute_bridge': {
        // Supine bridge thrust
        const bridge = (s + 1) / 2; // 0 floor, 1 full bridge
        const hipLift = bridge * 35;
        const head = { x: cx - 55, y: cy + 78 };
        const chest = { x: cx - 30, y: cy + 75 - hipLift * 0.4 };
        const hips = { x: cx + 15, y: cy + 75 - hipLift };
        const knees = { x: cx + 55, y: cy + 35 };
        const feet = { x: cx + 65, y: cy + 88 };

        drawLimb(ctx, hips, knees, feet, 10, primaryGlow);
        drawLimb(ctx, chest, { x: cx - 15, y: cy + 82 }, { x: cx + 5, y: cy + 85 }, 7, limbBase);
        drawTorso(ctx, chest, hips, 24, primaryGlow, true);
        drawHead(ctx, head, 13, headColor);
        break;
      }

      case 'superman': {
        // Prone back extension
        const arch = (s + 1) / 2; // 0 to 1
        const archLift = arch * 20;
        const head = { x: cx - 45, y: cy + 65 - archLift };
        const chest = { x: cx - 20, y: cy + 75 - archLift * 0.6 };
        const hips = { x: cx + 15, y: cy + 80 };
        const hands = { x: cx - 75, y: cy + 55 - archLift * 1.3 };
        const feet = { x: cx + 75, y: cy + 65 - archLift * 1.2 };

        drawLimb(ctx, chest, { x: cx - 50, y: cy + 65 - archLift }, hands, 7, primaryGlow);
        drawLimb(ctx, hips, { x: cx + 45, y: cy + 75 - archLift * 0.7 }, feet, 9, primaryGlow);
        drawTorso(ctx, chest, hips, 24, primaryGlow, true);
        drawHead(ctx, head, 13, headColor);
        break;
      }

      case 'shadow_boxing': {
        // Boxer throwing punches
        const punchPhase = s; // -1 to 1
        const head = { x: cx, y: cy - 70 };
        const chest = { x: cx, y: cy - 35 };
        const hips = { x: cx, y: cy + 15 };

        const lFistX = punchPhase > 0 ? cx + 55 : cx + 15;
        const rFistX = punchPhase <= 0 ? cx + 55 : cx + 15;

        drawLimb(ctx, chest, { x: cx + 15, y: cy - 25 }, { x: lFistX, y: cy - 40 }, 8, primaryGlow);
        drawLimb(ctx, chest, { x: cx + 25, y: cy - 20 }, { x: rFistX, y: cy - 35 }, 8, primaryGlow);
        drawLimb(ctx, hips, { x: cx - 15, y: cy + 55 }, { x: cx - 25, y: cy + 95 }, 9, limbBase);
        drawLimb(ctx, hips, { x: cx + 20, y: cy + 55 }, { x: cx + 30, y: cy + 95 }, 9, limbBase);
        drawTorso(ctx, chest, hips, 24, secondaryGlow, true);
        drawHead(ctx, head, 14, headColor);
        break;
      }

      case 'calf_raises': {
        // Standing calf raises: heels lift high
        const raise = (s + 1) / 2; // 0 floor, 1 top tiptoes
        const lift = raise * 22;

        const head = { x: cx, y: cy - 75 - lift };
        const chest = { x: cx, y: cy - 40 - lift };
        const hips = { x: cx, y: cy + 10 - lift };

        const lHand = { x: cx - 30, y: cy + 10 - lift };
        const rHand = { x: cx + 30, y: cy + 10 - lift };

        const lKnee = { x: cx - 18, y: cy + 50 - lift };
        const rKnee = { x: cx + 18, y: cy + 50 - lift };
        const lFoot = { x: cx - 18, y: cy + 95 - lift * 0.5 };
        const rFoot = { x: cx + 18, y: cy + 95 - lift * 0.5 };

        drawLimb(ctx, chest, { x: cx - 25, y: cy - 15 - lift }, lHand, 7, limbBase);
        drawLimb(ctx, chest, { x: cx + 25, y: cy - 15 - lift }, rHand, 7, limbBase);
        drawLimb(ctx, hips, lKnee, lFoot, 10, primaryGlow);
        drawLimb(ctx, hips, rKnee, rFoot, 10, primaryGlow);
        drawTorso(ctx, chest, hips, 24, secondaryGlow, true);
        drawHead(ctx, head, 14, headColor);
        break;
      }

      case 'cat_cow': {
        // Quadruped Cat-Cow spinal flexion & extension
        const arch = s; // -1 (Cow arch down) to 1 (Cat arch up)
        const spineBend = arch * 20;

        const head = { x: cx - 60, y: cy + 30 - spineBend * 0.6 };
        const chest = { x: cx - 35, y: cy + 45 - spineBend * 0.8 };
        const hips = { x: cx + 30, y: cy + 45 };

        const hands = { x: cx - 35, y: cy + 90 };
        const knees = { x: cx + 30, y: cy + 90 };

        drawLimb(ctx, chest, { x: cx - 35, y: cy + 68 }, hands, 8, limbBase);
        drawLimb(ctx, hips, { x: cx + 30, y: cy + 68 }, knees, 9, limbBase);
        drawTorso(ctx, chest, hips, 24, primaryGlow, true);
        drawHead(ctx, head, 13, headColor);
        break;
      }

      default: {
        drawRestPose(ctx, cx, cy, p, isLight);
        break;
      }
    }
  };

  // Drawing Utilities
  const drawHead = (ctx: CanvasRenderingContext2D, center: { x: number; y: number }, radius: number, color: string) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Visor accent
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(center.x + radius * 0.35, center.y - 1, radius * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const drawTorso = (
    ctx: CanvasRenderingContext2D,
    top: { x: number; y: number },
    bottom: { x: number; y: number },
    width: number,
    color: string,
    glow: boolean
  ) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';

    if (glow) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 14;
    }

    ctx.beginPath();
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(bottom.x, bottom.y);
    ctx.stroke();

    // Center spine highlight
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(bottom.x, bottom.y);
    ctx.stroke();
    ctx.restore();
  };

  const drawLimb = (
    ctx: CanvasRenderingContext2D,
    start: { x: number; y: number },
    joint: { x: number; y: number },
    end: { x: number; y: number },
    width: number,
    color: string
  ) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (color.includes('#f43f5e')) {
      ctx.shadowColor = 'rgba(244, 63, 94, 0.6)';
      ctx.shadowBlur = 10;
    }

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(joint.x, joint.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    // Joint caps
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(joint.x, joint.y, width * 0.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(end.x, end.y, width * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center rounded-2xl app-card border app-border shadow-xl backdrop-blur-md overflow-hidden ${className}`}
    >
      {/* Exercise and Target Muscles Header Badge */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        {exerciseName ? (
          <span className="text-xs font-bold uppercase tracking-wider app-text app-card-subtle px-2.5 py-1 rounded-full border app-border shadow-sm">
            {exerciseName}
          </span>
        ) : <div />}

        {targetMuscles.length > 0 && !isRest && (
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {targetMuscles.slice(0, 3).map((m) => (
              <span
                key={m}
                className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-500 dark:text-rose-300 border border-rose-500/40 shadow-sm animate-pulse"
              >
                {m}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 2D Skeletal Animation Canvas */}
      <canvas
        ref={canvasRef}
        width={340}
        height={260}
        className="w-full max-w-[340px] h-full object-contain mx-auto"
      />

      {/* Play / Speed Controls */}
      {showControls && (
        <div className="absolute bottom-2.5 right-3 flex items-center gap-1.5 app-card border app-border rounded-full px-2 py-1 backdrop-blur-md shadow-lg z-10">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause model animation' : 'Play model animation'}
            className="p-1 rounded-full app-text-sub hover:app-text app-card-hover transition-colors"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <button
            type="button"
            onClick={() => {
              const speeds = [0.5, 1.0, 1.5];
              const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
              setSpeed(speeds[nextIdx]);
            }}
            className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded text-amber-500 dark:text-amber-400 app-card-hover transition-colors"
            title="Change animation speed"
          >
            {speed}x
          </button>

          <button
            type="button"
            onClick={() => {
              phaseRef.current = 0;
            }}
            aria-label="Restart animation cycle"
            className="p-1 rounded-full app-text-muted hover:app-text app-card-hover transition-colors"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      )}
    </div>
  );
};
