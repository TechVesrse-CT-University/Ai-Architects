'use server';

/**
 * @fileOverview Analyzes student behavior during an exam to provide a suspicion level score.
 *
 * - analyzeStudentBehavior - A function that analyzes student behavior and returns a suspicion score.
 * - AnalyzeStudentBehaviorInput - The input type for the analyzeStudentBehavior function.
 * - AnalyzeStudentBehaviorOutput - The return type for the analyzeStudentBehavior function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AnalyzeStudentBehaviorInputSchema = z.object({
  videoUrl: z.string().describe('The URL of the video recording of the student during the exam.'),
  alerts: z.array(z.string()).describe('A list of alerts generated during the exam (e.g., "Face not detected", "Tab switch blocked").'),
});
export type AnalyzeStudentBehaviorInput = z.infer<typeof AnalyzeStudentBehaviorInputSchema>;

const AnalyzeStudentBehaviorOutputSchema = z.object({
  suspicionLevel: z.string().describe('A textual description of the suspicion level (e.g., Low, Medium, High).'),
  suspicionScore: z.number().describe('A numerical score representing the suspicion level (0-100).'),
  justification: z.string().describe('A brief justification for the suspicion level score, based on the alerts.'),
});
export type AnalyzeStudentBehaviorOutput = z.infer<typeof AnalyzeStudentBehaviorOutputSchema>;

export async function analyzeStudentBehavior(
  input: AnalyzeStudentBehaviorInput
): Promise<AnalyzeStudentBehaviorOutput> {
  return analyzeStudentBehaviorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeStudentBehaviorPrompt',
  input: {
    schema: z.object({
      videoUrl: z.string().describe('The URL of the video recording of the student during the exam.'),
      alerts: z.array(z.string()).describe('A list of alerts generated during the exam (e.g., "Face not detected", "Tab switch blocked").'),
    }),
  },
  output: {
    schema: z.object({
      suspicionLevel: z.string().describe('A textual description of the suspicion level (e.g., Low, Medium, High).'),
      suspicionScore: z.number().describe('A numerical score representing the suspicion level (0-100).'),
      justification: z.string().describe('A brief justification for the suspicion level score, based on the alerts.'),
    }),
  },
  prompt: `You are an AI proctor analyzing student behavior during an online exam.

  Based on the provided alerts and the video recording, determine a suspicion level score and provide a justification.

  Alerts:
  {{#each alerts}}
  - {{{this}}}
  {{/each}}

  Video URL: {{videoUrl}}

  Provide a suspicionLevel (Low, Medium, or High), a suspicionScore (0-100), and a justification for the score.
  `,
});

const analyzeStudentBehaviorFlow = ai.defineFlow<
  typeof AnalyzeStudentBehaviorInputSchema,
  typeof AnalyzeStudentBehaviorOutputSchema
>({
  name: 'analyzeStudentBehaviorFlow',
  inputSchema: AnalyzeStudentBehaviorInputSchema,
  outputSchema: AnalyzeStudentBehaviorOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
