export interface Board {
  id: number;
  title: string;
  description: string;
  isSaved: boolean;
  slug: string;
  icon: string;
  // Uncomment and define these fields if needed
  // position: number;
  // isSavedPosition: number;
  // user: User; // You need to define User interface if you use this field
}

export interface Section {
  id: string;
  title: string;
  position: number;
  // Uncomment and define this field if needed
  // board: Board; // Reference to the Board type
  tasks: Task[];
}
export interface Task {
  id: string;
  title: string;
  content: string;
  position: number;
  // Uncomment and define this field if needed
  sectionId: string; // Reference to the sectionId
}
