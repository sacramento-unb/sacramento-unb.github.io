export type Project = {
  slug: string;
  title: string;
  summary: string;
  domain: "data" | "ai" | "geospatial" | "software";
  technologies: string[];
  repositoryUrl: string;
  verified: true;
  approvedForPublication: true;
};

// Publication boundary: add a project only after technical audit, ownership
// review and explicit approval. The public site never discovers repositories.
export const projects: Project[] = [];
