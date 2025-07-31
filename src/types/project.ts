export interface Project {
  id: number;
  name: string;
  ownerId: number;
  createdAt: string;
  // Optionally include owner and tasks if needed
  // owner?: User;
  // tasks?: Task[];
}
