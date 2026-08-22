import { Coach, CoachPersonality } from '../types/workout';

export const COACHES: Record<CoachPersonality, Coach> = {
  drill: {
    id: 'drill',
    name: 'Sergeant Rex',
    title: 'The Hardcore Drill Instructor',
    avatarEmoji: '🪖',
    description: 'No excuses, soldier! High discipline, tough love, and non-stop motivation.',
    speechPitch: 0.75, // deeper voice
    speechRate: 1.15, // fast, punchy
    accentColor: 'from-amber-600 to-red-700',
    welcomeLine: 'Attention! Sergeant Rex reporting for duty. Let’s get to work!',
    phrases: {
      ready: [
        'Get in position, soldier! Three seconds!',
        'Front and center! Move it!',
        'No sleeping on my clock! Prepare!'
      ],
      start: [
        'GO GO GO! Put your back into it!',
        'Drive through the floor! Move!',
        'Pain is weakness leaving the body! Execute!',
        'Work those muscles! Give me maximum effort!'
      ],
      halfway: [
        'HALFWAY! Don’t you dare slow down!',
        'Halfway mark crossed! Push the pace, soldier!',
        'Fifty percent down! Keep that fire burning!'
      ],
      almostDone: [
        'Five seconds left! Sprint to the buzzer!',
        'Final push! Leave everything on the mat!',
        'Three! Two! One! Push!'
      ],
      rest: [
        'Breathe, soldier! Shake it out, 10 seconds of air!',
        'Catch your breath! Next exercise incoming!',
        'Rest up! We are not done yet!'
      ],
      nextExercise: [
        'Next up on the assault:',
        'Prepare for your next drill:',
        'Incoming exercise:'
      ],
      workoutComplete: [
        'OUTSTANDING WORK, SOLDIER! Mission accomplished!',
        'Victory achieved! You earned this sweat!',
        'Discipline equals freedom! Great session!'
      ],
      slackingWarning: [
        'Keep those hips up! No cheating in my squad!'
      ]
    }
  },
  cheerleader: {
    id: 'cheerleader',
    name: 'Sparky Chloe',
    title: 'The Cheerful Cheerleader',
    avatarEmoji: '✨',
    description: 'Bright energy, bubbling optimism, and upbeat praise every single second!',
    speechPitch: 1.25, // higher, upbeat pitch
    speechRate: 1.05,
    accentColor: 'from-pink-500 to-rose-400',
    welcomeLine: 'Yay! Let’s crush this workout together, superstar!',
    phrases: {
      ready: [
        'Get ready to shine, superstar!',
        'Let’s sparkle! Three seconds to launch!',
        'Breathe in that fabulous energy!'
      ],
      start: [
        'Yes! Look at that rhythm! You are amazing!',
        'Keep moving those feet! You’ve totally got this!',
        'Pure joy in motion! Shine bright!',
        'Looking so strong today! Keep going!'
      ],
      halfway: [
        'Woohoo! Halfway there! You are on fire!',
        'Halfway point! You are doing so fantastic!',
        'So proud of you! Keep that gorgeous smile and rhythm!'
      ],
      almostDone: [
        'Final 5 seconds! Shine like a diamond!',
        'Almost there superstar, finish with style!',
        'Count with me: 3, 2, 1, yay!'
      ],
      rest: [
        'Awesome job! Take a nice deep sip of air!',
        'Shake those arms and smile! Rest time!',
        'You earned this rest! Get ready for the next one!'
      ],
      nextExercise: [
        'Next fun move coming up:',
        'Let’s get excited for:',
        'Up next is:'
      ],
      workoutComplete: [
        'YOU DID IT!! You are an absolute superstar!',
        'Incredible workout! High five! You rocked today!',
        'I am so proud of your dedication today!'
      ]
    }
  },
  zen: {
    id: 'zen',
    name: 'Guru Kai',
    title: 'The Mindful Zen Master',
    avatarEmoji: '🧘',
    description: 'Deep breathing, centered focus, fluid biomechanics, and inner harmony.',
    speechPitch: 0.9,
    speechRate: 0.92, // smooth and deliberate
    accentColor: 'from-emerald-600 to-teal-500',
    welcomeLine: 'Peace to you. Center your mind, connect with your breath.',
    phrases: {
      ready: [
        'Center yourself. Inhale deeply.',
        'Find your inner stillness. Three, two, one.',
        'Ground your feet to the earth.'
      ],
      start: [
        'Flow with purpose. Honor your body’s strength.',
        'Move fluidly. Let your breath lead the way.',
        'Feel the energy circulating through your core.',
        'Steady, balanced power in every movement.'
      ],
      halfway: [
        'Halfway through this cycle of focus. Stay centered.',
        'Observe your breath. Halfway there, embrace the sensation.',
        'Maintain harmony in your posture.'
      ],
      almostDone: [
        'Embrace these final five seconds of growth.',
        'Three mindful breaths to the finish.',
        'Grace and power till the last moment.'
      ],
      rest: [
        'Release and exhale fully. Allow your heart to settle.',
        'Gentle breath in, gentle breath out. Ten seconds of calm.',
        'Feel gratitude for what your body just achieved.'
      ],
      nextExercise: [
        'Transition mindfully to:',
        'Our next movement of focus is:',
        'Prepare your posture for:'
      ],
      workoutComplete: [
        'Namaste. A truly harmonious and powerful practice today.',
        'Your body and spirit thank you for this dedication.',
        'Carry this strength and peace into your day.'
      ]
    }
  },
  robot: {
    id: 'robot',
    name: 'Unit 7000',
    title: 'The Cybernetic Biometric Coach',
    avatarEmoji: '🤖',
    description: 'Precision timing, algorithmic motivation, and biomechanical telemetry.',
    speechPitch: 0.6,
    speechRate: 1.1,
    accentColor: 'from-cyan-600 to-blue-600',
    welcomeLine: 'Unit 7000 online. Biometric workout sequence initiated.',
    phrases: {
      ready: [
        'Commencing countdown sequence. 3. 2. 1.',
        'Calibrating target coordinates. Prepare.',
        'Systems armed. Engage posture.'
      ],
      start: [
        'Execution phase active. Calorie burn sequence initiated.',
        'Maintain optimal RPM. Biometric indicators nominal.',
        'Motor units firing at 100 percent capacity.',
        'Kinetic energy generation: Maximum.'
      ],
      halfway: [
        'T-minus 50 percent remaining. Thermal output rising.',
        'Halfway benchmark logged. Efficiency rating: Superior.',
        'Interval midpoint reached. Do not degrade output.'
      ],
      almostDone: [
        'Final cycle: 5. 4. 3. 2. 1.',
        'Terminal interval phase. Discharge remaining stamina.',
        'Peak frequency reached.'
      ],
      rest: [
        'Cooling protocol engaged. Rest interval: 10 seconds.',
        'Recharging energy cells. Stand by.',
        'Thermal dissipation in progress. Prepare next module.'
      ],
      nextExercise: [
        'Loading next sequence:',
        'Target routine buffered:',
        'Next protocol:'
      ],
      workoutComplete: [
        'Session complete. All biometric parameters exceeded expectations.',
        'Protocol finalized. Caloric burn logged to memory bank.',
        'Diagnostic: Superior human performance detected.'
      ]
    }
  },
  minimal: {
    id: 'minimal',
    name: 'Classic Whistle & Bell',
    title: 'Minimalist Gym Bells (No Speech)',
    avatarEmoji: '🔔',
    description: 'Clean gym bells, whistles, and audio countdown beeps without voice chatter.',
    speechPitch: 1.0,
    speechRate: 1.0,
    accentColor: 'from-slate-600 to-slate-700',
    welcomeLine: 'Minimalist audio bells mode active.',
    phrases: {
      ready: ['Ready.'],
      start: ['Start!'],
      halfway: ['Halfway.'],
      almostDone: ['Five seconds.'],
      rest: ['Rest.'],
      nextExercise: ['Next:'],
      workoutComplete: ['Complete.']
    }
  }
};

export const COACH_LIST: Coach[] = Object.values(COACHES);
