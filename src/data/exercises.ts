import { Exercise } from '../types/workout';

export const EXERCISES_DATABASE: Record<string, Exercise> = {
  'jumping_jacks': {
    id: 'jumping_jacks',
    name: 'Jumping Jacks',
    category: 'cardio',
    targetMuscles: ['calves', 'shoulders', 'quads'],
    secondaryMuscles: ['abs', 'glutes'],
    animationType: 'jumping_jacks',
    difficulty: 'beginner',
    isLowImpact: false,
    defaultDurationSec: 30,
    caloriesPerMinute: 10,
    instructions: [
      'Stand upright with feet together and arms resting at your sides.',
      'Jump feet out shoulder-width apart while swinging arms wide overhead until hands nearly touch.',
      'Quickly jump feet back together and bring arms back to your sides.',
      'Maintain a light, rhythmic bounce on the balls of your feet.'
    ],
    formTips: [
      'Land softly on the balls of your feet to protect your knees.',
      'Keep your core engaged and avoid arching your lower back.',
      'Keep your arms straight and fluid.'
    ],
    commonMistakes: [
      'Landing heavily with locked knees.',
      'Incomplete arm sweeps not reaching shoulder height.',
      'Holding your breath.'
    ],
    coachCues: {
      start: 'Fire up that cardiovascular engine! Light on your toes!',
      halfway: 'Great tempo! Keep those arms swinging wide!',
      finalStretch: 'Final 5 seconds! Maximize your speed!'
    }
  },
  'wall_sit': {
    id: 'wall_sit',
    name: 'Wall Sit',
    category: 'lower_body',
    targetMuscles: ['quads', 'glutes', 'calves'],
    secondaryMuscles: ['abs', 'hamstrings'],
    animationType: 'wall_sit',
    difficulty: 'beginner',
    isLowImpact: true,
    defaultDurationSec: 30,
    caloriesPerMinute: 7,
    instructions: [
      'Lean your back flat against a sturdy wall.',
      'Slide down until your thighs are parallel to the floor at a 90-degree angle.',
      'Keep your knees directly over your ankles, not extending past your toes.',
      'Rest your hands on your chest or sides, not on your thighs.'
    ],
    formTips: [
      'Press your entire lower back and shoulder blades flat to the wall.',
      'Breathe steadily through your nose and out through your mouth.',
      'Distribute your weight evenly through your heels.'
    ],
    commonMistakes: [
      'Letting knees cave inward or push past toes.',
      'Resting hands heavily on knees to cheat.',
      'Not sliding down low enough to reach parallel.'
    ],
    coachCues: {
      start: 'Lock in against the wall! 90-degree angle at the knees!',
      halfway: 'Feel the burn in those quads! Don’t you dare stand up!',
      finalStretch: 'Hold strong! Almost through the burn!'
    }
  },
  'pushups': {
    id: 'pushups',
    name: 'Push-ups',
    category: 'upper_body',
    targetMuscles: ['chest', 'triceps', 'shoulders'],
    secondaryMuscles: ['abs', 'back'],
    animationType: 'pushups',
    difficulty: 'intermediate',
    isLowImpact: true,
    defaultDurationSec: 30,
    caloriesPerMinute: 9,
    instructions: [
      'Place hands slightly wider than shoulder-width on the floor.',
      'Extend legs back, forming a straight rigid line from crown of head to heels.',
      'Lower your chest until elbows reach a 90-degree angle or chest hovers above floor.',
      'Push firmly through your palms to return to starting plank.'
    ],
    formTips: [
      'Keep elbows at a 45-degree angle to your torso (arrow shape, not T-shape).',
      'Brace your glutes and core to keep your lower back from sagging.',
      'Look slightly ahead of your hands to keep your neck neutral.'
    ],
    commonMistakes: [
      'Flaring elbows out at 90 degrees, straining the shoulders.',
      'Sagging hips or piking glutes into the air.',
      'Half reps that barely lower the chest.'
    ],
    coachCues: {
      start: 'Solid plank posture! Lower with control and press with power!',
      halfway: 'Quality over speed! Chest all the way down!',
      finalStretch: '3 more strong reps! Push through the floor!'
    }
  },
  'crunches': {
    id: 'crunches',
    name: 'Abdominal Crunches',
    category: 'core',
    targetMuscles: ['abs'],
    secondaryMuscles: ['obliques'],
    animationType: 'crunches',
    difficulty: 'beginner',
    isLowImpact: true,
    defaultDurationSec: 30,
    caloriesPerMinute: 6,
    instructions: [
      'Lie flat on your back with knees bent and feet flat on the floor.',
      'Lightly cup your ears with fingertips or cross arms over chest.',
      'Exhale and contract your abs, peeling your shoulder blades 3-4 inches off the floor.',
      'Inhale as you slowly lower your shoulders back down with control.'
    ],
    formTips: [
      'Do not pull on your neck or chin.',
      'Focus the contraction strictly into your upper abdominal wall.',
      'Keep your lower back pressed gently to the floor throughout.'
    ],
    commonMistakes: [
      'Yanking your head and neck forward with your hands.',
      'Using momentum instead of muscular abdominal tension.',
      'Holding breath on the way up.'
    ],
    coachCues: {
      start: 'Engage that six-pack! Squeeze at the peak of each rep!',
      halfway: 'Controlled tempo! Feel every muscle fiber working!',
      finalStretch: 'Hold the contraction at the top! Finish strong!'
    }
  },
  'step_ups': {
    id: 'step_ups',
    name: 'Step-up onto Chair',
    category: 'lower_body',
    targetMuscles: ['quads', 'glutes', 'hamstrings'],
    secondaryMuscles: ['calves', 'abs'],
    animationType: 'step_ups',
    difficulty: 'beginner',
    isLowImpact: true,
    defaultDurationSec: 30,
    caloriesPerMinute: 8,
    instructions: [
      'Stand facing a stable chair, step, or bench.',
      'Place your entire right foot firmly in the center of the step.',
      'Press through the right heel to lift your entire body up onto the step.',
      'Step down carefully with the left foot, then repeat alternating leading legs.'
    ],
    formTips: [
      'Ensure the entire foot (not just toes) is planted on the chair.',
      'Stand fully upright at the top before stepping back down.',
      'Do not bounce off the trailing foot; let the lead leg do the work.'
    ],
    commonMistakes: [
      'Using a wobbly or unstable chair.',
      'Pushing heavily off the floor foot instead of pulling with the top leg.',
      'Rounding the upper back.'
    ],
    coachCues: {
      start: 'Step up with power! Alternate legs smoothly!',
      halfway: 'Drive through that front heel! Full extension at the top!',
      finalStretch: 'Keep the pace high! Step, up, down, go!'
    }
  },
  'squats': {
    id: 'squats',
    name: 'Bodyweight Squats',
    category: 'lower_body',
    targetMuscles: ['quads', 'glutes', 'hamstrings'],
    secondaryMuscles: ['calves', 'abs'],
    animationType: 'squats',
    difficulty: 'beginner',
    isLowImpact: true,
    defaultDurationSec: 30,
    caloriesPerMinute: 8,
    instructions: [
      'Stand with feet slightly wider than hip-width, toes turned slightly outward.',
      'Hinge back at the hips and bend knees as if sitting back into an imaginary chair.',
      'Lower until your thighs are parallel to the floor, keeping chest proud.',
      'Drive through your heels to return to standing, squeezing glutes at the top.'
    ],
    formTips: [
      'Keep your chest high and eyes looking forward.',
      'Ensure knees track in the same direction as your second toes.',
      'Keep weight balanced between midfoot and heels.'
    ],
    commonMistakes: [
      'Letting knees collapse inward.',
      'Lifting heels off the ground.',
      'Rounding the lower back.'
    ],
    coachCues: {
      start: 'Hips back, chest up! Get deep and explode up!',
      halfway: 'Full range of motion! Beautiful depth!',
      finalStretch: 'Burn those legs out! 5 seconds left!'
    }
  },
  'tricep_dips': {
    id: 'tricep_dips',
    name: 'Triceps Dip on Chair',
    category: 'upper_body',
    targetMuscles: ['triceps', 'shoulders'],
    secondaryMuscles: ['chest', 'abs'],
    animationType: 'tricep_dips',
    difficulty: 'intermediate',
    isLowImpact: true,
    defaultDurationSec: 30,
    caloriesPerMinute: 7,
    instructions: [
      'Sit on the edge of a sturdy chair and grip the edge next to your hips.',
      'Slide your glutes just off the front of the seat with knees bent (or straight for harder).',
      'Bend elbows to lower your body straight down until upper arms are nearly parallel to floor.',
      'Press firmly through your palms to straighten arms back to top.'
    ],
    formTips: [
      'Keep your back close to the chair edge throughout the descent.',
      'Do not dip lower than 90 degrees at the elbow to protect shoulders.',
      'Keep shoulders down away from your ears.'
    ],
    commonMistakes: [
      'Drifting your hips too far forward away from the chair.',
      'Shrugging shoulders into the neck.',
      'Locking elbows violently at the top.'
    ],
    coachCues: {
      start: 'Isolate those triceps! Lower smooth, press strong!',
      halfway: 'Keep your spine close to the chair! Feel the back of the arms burn!',
      finalStretch: 'Lock in! Give me three more solid dips!'
    }
  },
  'plank': {
    id: 'plank',
    name: 'High Plank',
    category: 'core',
    targetMuscles: ['abs', 'shoulders', 'back'],
    secondaryMuscles: ['glutes', 'quads'],
    animationType: 'plank',
    difficulty: 'beginner',
    isLowImpact: true,
    defaultDurationSec: 30,
    caloriesPerMinute: 6,
    instructions: [
      'Start on all fours, then step feet back to assume a push-up position with arms extended.',
      'Position wrists directly under shoulders and fingers spread wide.',
      'Create an unbroken line from crown of head down through heels.',
      'Tuck pelvis slightly, squeeze glutes, and pull belly button toward spine.'
    ],
    formTips: [
      'Imagine pulling your hands toward your feet to activate deep core stabilizers.',
      'Keep neck neutral by gazing at a spot on floor a few inches ahead.',
      'Breathe steadily into your diaphragm; do not hold breath.'
    ],
    commonMistakes: [
      'Sagging hips putting shear strain on the lumbar spine.',
      'Piking butt up into the air.',
      'Dropping the head down toward the floor.'
    ],
    coachCues: {
      start: 'Solid as a steel beam! Lock your core in tight!',
      halfway: 'Don’t drop those hips! Breathe steady and stay resolute!',
      finalStretch: 'Ten seconds of iron focus! Squeeze everything!'
    }
  },
  'high_knees': {
    id: 'high_knees',
    name: 'High Knees Running in Place',
    category: 'cardio',
    targetMuscles: ['quads', 'abs', 'calves'],
    secondaryMuscles: ['glutes', 'hamstrings'],
    animationType: 'high_knees',
    difficulty: 'intermediate',
    isLowImpact: false,
    defaultDurationSec: 30,
    caloriesPerMinute: 11,
    instructions: [
      'Stand tall with feet hip-distance apart.',
      'Drive your right knee up toward chest level while pumping left arm forward.',
      'Quickly switch, driving left knee up and pumping right arm forward.',
      'Continue alternating in a rapid, energetic sprint motion on balls of feet.'
    ],
    formTips: [
      'Aim to bring knees up to hip height (90 degrees).',
      'Stay upright with a slight forward lean from the ankles.',
      'Pump your arms vigorously to keep cadence fast.'
    ],
    commonMistakes: [
      'Leaning backward to compensate for lifting knees.',
      'Barely lifting feet off floor (shuffling).',
      'Slapping heels into floor.'
    ],
    coachCues: {
      start: 'Pick those knees up! Hip height, quick cadence!',
      halfway: 'Fast feet! Pump those arms like a sprinter!',
      finalStretch: 'Sprint to the finish line! Everything you got!'
    }
  },
  'lunges': {
    id: 'lunges',
    name: 'Forward Alternating Lunges',
    category: 'lower_body',
    targetMuscles: ['quads', 'glutes', 'hamstrings'],
    secondaryMuscles: ['calves', 'abs'],
    animationType: 'lunges',
    difficulty: 'beginner',
    isLowImpact: true,
    defaultDurationSec: 30,
    caloriesPerMinute: 8,
    instructions: [
      'Stand upright with hands on hips or together at chest.',
      'Take a generous step forward with your right foot.',
      'Lower hips until both front and back knees form 90-degree angles.',
      'Push off the front heel to step back to start, then alternate to left leg.'
    ],
    formTips: [
      'Keep torso perpendicular to the floor.',
      'Front knee should stay stacked over front ankle, not veering inward.',
      'Back knee should hover 1-2 inches above the ground.'
    ],
    commonMistakes: [
      'Taking too short a step, causing front knee to shear forward.',
      'Leaning the torso forward over the front thigh.',
      'Banging the back knee into the floor.'
    ],
    coachCues: {
      start: 'Step forward and drop deep! Nice upright posture!',
      halfway: 'Drive through that front heel! Great balance and control!',
      finalStretch: 'Alternate smooth and steady! Finish this set!'
    }
  },
  'pushup_rotation': {
    id: 'pushup_rotation',
    name: 'Push-up & Rotation',
    category: 'upper_body',
    targetMuscles: ['chest', 'shoulders', 'obliques'],
    secondaryMuscles: ['triceps', 'abs'],
    animationType: 'pushup_rotation',
    difficulty: 'advanced',
    isLowImpact: true,
    defaultDurationSec: 30,
    caloriesPerMinute: 9,
    instructions: [
      'Start in a standard push-up plank position.',
      'Lower your chest toward floor in a controlled push-up.',
      'As you press back up, rotate your torso and extend your right arm toward ceiling in a T-stand.',
      'Return right hand to floor, perform another push-up, and rotate left.'
    ],
    formTips: [
      'Follow your raised hand with your eyes as you rotate.',
      'Stack your shoulders in a straight vertical line at the top.',
      'Engage obliques to keep your hips from sinking.'
    ],
    commonMistakes: [
      'Rushing the push-up and only doing the rotation.',
      'Letting the bottom hip sag toward floor during side turn.',
      'Over-rotating the shoulder backward.'
    ],
    coachCues: {
      start: 'Push and open wide to the ceiling! Total body control!',
      halfway: 'Rotate with purpose! Strong foundational base!',
      finalStretch: 'One more each side! Max reach at the top!'
    }
  },
  'side_plank': {
    id: 'side_plank',
    name: 'Side Plank (Alternating)',
    category: 'core',
    targetMuscles: ['obliques', 'abs', 'shoulders'],
    secondaryMuscles: ['glutes'],
    animationType: 'side_plank',
    difficulty: 'intermediate',
    isLowImpact: true,
    defaultDurationSec: 30,
    caloriesPerMinute: 6,
    instructions: [
      'Lie on your right side with forearm flat on floor under right shoulder.',
      'Stack your feet, legs, and hips in a straight line.',
      'Lift hips off the floor, raising left arm high or placing left hand on hip.',
      'Hold with rigid core alignment, then transition smoothly to left side at halfway cue.'
    ],
    formTips: [
      'Do not let top hip roll forward or backward.',
      'Press forearm firmly down to keep shoulder packed and stable.',
      'Keep neck aligned with spine.'
    ],
    commonMistakes: [
      'Allowing bottom hip to droop toward the mat.',
      'Placing elbow too far out from under shoulder.',
      'Holding breath during isometric tension.'
    ],
    coachCues: {
      start: 'Hips high! Obliques engaged like a steel cable!',
      halfway: 'Switch sides now! Seamless flip to the other arm!',
      finalStretch: 'Hold the peak height! Five seconds to victory!'
    }
  },
  'burpees': {
    id: 'burpees',
    name: 'Full Body Burpees',
    category: 'full_body',
    targetMuscles: ['chest', 'quads', 'abs', 'calves'],
    secondaryMuscles: ['shoulders', 'glutes', 'triceps'],
    animationType: 'burpees',
    difficulty: 'advanced',
    isLowImpact: false,
    defaultDurationSec: 30,
    caloriesPerMinute: 13,
    instructions: [
      'From standing, drop hands to floor just in front of feet.',
      'Jump feet back into a full plank and lower chest to floor.',
      'Press up quickly, jump feet forward toward hands into a squat.',
      'Explosively jump vertically into air, clapping hands overhead.'
    ],
    formTips: [
      'Maintain rhythm and breathe on every jump.',
      'Step feet back instead of jumping if you need a lower impact modification.'
    ],
    commonMistakes: [
      'Arching lower back on the plank drop.',
      'Landing heavily on stiff knees.'
    ],
    coachCues: {
      start: 'Full intensity mode! Drop, explode, jump high!',
      halfway: 'Unstoppable power! Keep the cadence moving!',
      finalStretch: 'Two more explosive reps! Reach for the sky!'
    }
  },
  'mountain_climbers': {
    id: 'mountain_climbers',
    name: 'Mountain Climbers',
    category: 'cardio',
    targetMuscles: ['abs', 'shoulders', 'quads'],
    secondaryMuscles: ['calves', 'glutes'],
    animationType: 'mountain_climbers',
    difficulty: 'intermediate',
    isLowImpact: false,
    defaultDurationSec: 30,
    caloriesPerMinute: 11,
    instructions: [
      'Start in high plank with hands directly beneath shoulders.',
      'Drive right knee rapidly toward chest without letting hips rise.',
      'Quickly switch, extending right leg back while driving left knee forward.',
      'Run alternating knees back and forth in rapid rhythm.'
    ],
    formTips: [
      'Keep hips level and low in line with shoulders.',
      'Distribute weight firmly into hands and balls of feet.'
    ],
    commonMistakes: [
      'Bouncing hips way up in the air.',
      'Letting shoulders drift backward behind wrists.'
    ],
    coachCues: {
      start: 'Drive those knees! Like you are sprinting up a steep hill!',
      halfway: 'Fast pistons! Core engaged!',
      finalStretch: 'Turbo boost! 5 seconds full sprint!'
    }
  },
  'bicycle_crunches': {
    id: 'bicycle_crunches',
    name: 'Bicycle Crunches',
    category: 'core',
    targetMuscles: ['obliques', 'abs'],
    secondaryMuscles: ['quads'],
    animationType: 'bicycle_crunches',
    difficulty: 'intermediate',
    isLowImpact: true,
    defaultDurationSec: 30,
    caloriesPerMinute: 8,
    instructions: [
      'Lie supine with hands behind head, legs lifted in tabletop position.',
      'Bring right elbow across to touch left knee while fully extending right leg forward.',
      'Switch sides fluidly, rotating torso to bring left elbow to right knee.',
      'Pedal with controlled rotation and continuous tension.'
    ],
    formTips: [
      'Rotate your entire ribcage, not just reaching your elbows.',
      'Keep lower back flush with floor.'
    ],
    commonMistakes: [
      'Yanking neck with hands.',
      'Rushing so fast that rotation is compromised.'
    ],
    coachCues: {
      start: 'Twist and extend! Feel those obliques fire up!',
      halfway: 'Deep rotations! Don’t let feet touch the floor!',
      finalStretch: 'Burn out those side abs! Finish strong!'
    }
  },
  'glute_bridge': {
    id: 'glute_bridge',
    name: 'Glute Bridges',
    category: 'lower_body',
    targetMuscles: ['glutes', 'hamstrings'],
    secondaryMuscles: ['abs', 'calves'],
    animationType: 'glute_bridge',
    difficulty: 'beginner',
    isLowImpact: true,
    defaultDurationSec: 30,
    caloriesPerMinute: 6,
    instructions: [
      'Lie on your back with knees bent and feet flat on the floor, hip-width apart.',
      'Drive through your heels to raise hips toward ceiling.',
      'Squeeze glutes hard at top for a count of one, forming straight line knees to shoulders.',
      'Lower hips slowly back to hovering just above floor and repeat.'
    ],
    formTips: [
      'Do not hyperextend your lower back at the top.',
      'Focus the mind-muscle connection directly into the gluteus maximus.'
    ],
    commonMistakes: [
      'Pushing through toes instead of heels.',
      'Arching lumbar spine instead of hinging from hips.'
    ],
    coachCues: {
      start: 'Drive through heels, bridge up and squeeze at top!',
      halfway: 'Hold at top for a second on every rep! Pure power in glutes!',
      finalStretch: 'Hold the top bridge! Pulse it out!'
    }
  },
  'superman': {
    id: 'superman',
    name: 'Superman Back Extension',
    category: 'flexibility',
    targetMuscles: ['back', 'glutes'],
    secondaryMuscles: ['shoulders', 'hamstrings'],
    animationType: 'superman',
    difficulty: 'beginner',
    isLowImpact: true,
    defaultDurationSec: 30,
    caloriesPerMinute: 5,
    instructions: [
      'Lie face down on floor with arms extended straight overhead and legs straight.',
      'Simultaneously lift arms, chest, and thighs off the floor.',
      'Hold the top position for 2 seconds, squeezing lower back and glutes.',
      'Slowly lower back down to hover above floor.'
    ],
    formTips: [
      'Keep gaze down toward floor to prevent neck strain.',
      'Reach fingers and toes far in opposite directions.'
    ],
    commonMistakes: [
      'Jerking upward violently.',
      'Holding breath during contraction.'
    ],
    coachCues: {
      start: 'Fly high! Strengthen that posterior chain!',
      halfway: 'Lift and extend! Lengthen from fingertips to toes!',
      finalStretch: 'Hold at the apex! Squeeze the whole back!'
    }
  },
  'shadow_boxing': {
    id: 'shadow_boxing',
    name: 'Shadow Boxing Combos',
    category: 'cardio',
    targetMuscles: ['shoulders', 'abs', 'calves'],
    secondaryMuscles: ['triceps', 'chest'],
    animationType: 'shadow_boxing',
    difficulty: 'beginner',
    isLowImpact: true,
    defaultDurationSec: 30,
    caloriesPerMinute: 10,
    instructions: [
      'Adopt an athletic boxing stance with fists guarding chin and knees soft.',
      'Throw rapid 1-2 punch combinations (jab, cross, hooks) with snappy hip rotation.',
      'Stay light on the balls of your feet, bobbing and weaving gently.',
      'Retract fists quickly back to guard position after each punch.'
    ],
    formTips: [
      'Power comes from hip and core rotation, not just arms.',
      'Keep wrists straight and solid on impact.'
    ],
    commonMistakes: [
      'Dropping hands away from face.',
      'Locking out elbows violently on punches.'
    ],
    coachCues: {
      start: 'Hands up! Jab, cross, quick snaps!',
      halfway: 'Rotate hips with every strike! Fast and lethal!',
      finalStretch: 'Rapid fire flurry to the bell! Go, go, go!'
    }
  }
};

export const EXERCISE_LIST: Exercise[] = Object.values(EXERCISES_DATABASE);
