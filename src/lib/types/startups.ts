export interface Startup {
  id: string;
  name: string;
  location: string;
  field: string;
  logo?: string;
  description: string;
  monetization_model: string;
  stage: string;
  phase: "crowdfunding" | "ecosystem";

  completed?: string;
  interested_in?: string;
  goal?: string;
  raised_funds?: string;
}

export interface CreateStartup {
  name: string;
  location: string;
  field: string;
  logo?: string;
  description: string;
  monetization_model: string;
  stage: string;
  phase: "crowdfunding" | "ecosystem";

  completed?: string;
  interested_in?: string;
  goal?: string;
  raised_funds?: string;
}

export interface StartupAnalysis {
  description: string;
  monetization: string;
}
