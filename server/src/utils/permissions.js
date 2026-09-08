export const ADMIN_PERMISSIONS = [
  'manage_timetable',
  'manage_exams',
  'manage_students',
  'manage_teachers',
  'manage_fees',
  'manage_profiles',
];

export const ROLE_PERMISSIONS = {
  student: ['view_own_dashboard', 'view_own_timetable', 'attempt_knowledge_check'],
  teacher: [
    'view_teacher_dashboard',
    'manage_knowledge_checks',
    'view_class_students',
  ],
  principal: [
    'view_school_dashboard',
    'view_staff',
    'view_students',
    'view_analytics',
  ],
  admin: ADMIN_PERMISSIONS,
};

export const CLASSES = [
  '8A',
  '8B',
  '9A',
  '9B',
  '10A',
  '10B',
  '11A',
  '11B',
  '12A',
  '12B',
];

export const SUBJECTS = [
  'Mathematics',
  'English',
  'Science',
  'History',
  'Geography',
  'Hindi',
  'Computer Science',
  'Physics',
  'Chemistry',
  'Biology',
  'Sports',
];
