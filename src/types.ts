export interface AnalysisResult {
  failingInput: string;
  expectedOutput: string;
  userOutput: string;
  diagnosis: string;
  generatorCode: string;
}

export interface AnalysisInput {
  problemDescription: string;
  correctCode: string;
  incorrectCode: string;
}
