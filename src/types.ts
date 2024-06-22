export interface User {
  id: string;
  login: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BoardType {
  id: string;
  title: string;
  description: string;
  isSaved: boolean;
  slug: string;
  icon: string;
  userId: string;
  // Uncomment and define these fields if needed
  // user: User; // You need to define User interface if you use this field
}

export interface SectionType {
  id: string;
  title: string;
  position: number;
  // Uncomment and define this field if needed
  // board: Board; // Reference to the Board type
  tasks: TaskType[];
}
export interface TaskType {
  id: string;
  title: string;
  content: string;
  position: number;
  // Uncomment and define this field if needed
  sectionId: string; // Reference to the sectionId
}
