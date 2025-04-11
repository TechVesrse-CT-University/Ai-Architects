// Summarize exam violations for a given student.
'use server';
/**
 * @fileOverview Summarizes exam violations for a student.
 *
 * - summarizeExamViolations - A function that summarizes exam violations.
 * - SummarizeExamViolationsInput - The input type for the summarizeExamViolations function.
 * - SummarizeExamViolationsOutput - The return type for the summarizeExamViolations function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeExamViolationsInputSchema = z.object({
  studentId: z.string().describe('The ID of the student.'),
  examId: z.string().describe('The ID of the exam.'),
  violations: z
    .array(
      z.object({
        timestamp: z.string().describe('The timestamp of the violation.'),
        type: z.string().describe('The type of violation.'),
        details: z.string().describe('The details of the violation.'),
      })
    )
    .describe('The list of violations for the student in the exam.'),
});

export type SummarizeExamViolationsInput = z.infer<typeof SummarizeExamViolationsInputSchema>;

const SummarizeExamViolationsOutputSchema = z.object({
  summary: z.string().describe('A summary of the exam violations.'),
});

export type SummarizeExamViolationsOutput = z.infer<typeof SummarizeExamViolationsOutputSchema>;

export async function summarizeExamViolations(
  input: SummarizeExamViolationsInput
): Promise<SummarizeExamViolationsOutput> {
  return summarizeExamViolationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeExamViolationsPrompt',
  input: {
    schema: z.object({
      studentId: z.string().describe('The ID of the student.'),
      examId: z.string().describe('The ID of the exam.'),
      violations: z
        .array(
          z.object({
            timestamp: z.string().describe('The timestamp of the violation.'),
            type: z.string().describe('The type of violation.'),
            details: z.string().describe('The details of the violation.'),
          })
        )
        .describe('The list of violations for the student in the exam.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A summary of the exam violations.'),
    }),
  },
  prompt: `You are an AI assistant helping teachers summarize exam violations for students.

  Summarize the following exam violations for student {{studentId}} in exam {{examId}}:

  {{#each violations}}
  - Timestamp: {{timestamp}}, Type: {{type}}, Details: {{details}}
  {{/each}}

  Provide a concise summary of the most relevant incidents, highlighting any patterns or repeated violations.
`,
});

const summarizeExamViolationsFlow = ai.defineFlow<
  typeof SummarizeExamViolationsInputSchema,
  typeof SummarizeExamViolationsOutputSchema
>({
  name: 'summarizeExamViolationsFlow',
  inputSchema: SummarizeExamViolationsInputSchema,
  outputSchema: SummarizeExamViolationsOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});