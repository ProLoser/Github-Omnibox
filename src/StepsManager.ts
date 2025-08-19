import { Step, StepValue } from './Step';

export class StepsManager {
  private static steps: Step[] = [];

  static loadPatterns(patterns: { [key: string]: StepValue }): void {
    for (const [key, value] of Object.entries(patterns)) {
      this.steps.push(new Step(key, value, 0));
    }
  }

  static suggest(text: string): any[] {
    const args = text.split(" ");
    let suggestions: any[] = [];
    this.steps.forEach((aStep) => {
      suggestions = suggestions.concat(aStep.suggest(args, text));
    });
    return suggestions;
  }

  static decide(text: string): any {
    const args = text.split(" ");
    let decision;
    for (let i = 0; i < this.steps.length; i++) {
      decision = this.steps[i].decide(args, text);
      if (decision !== undefined) {
        return decision;
      }
    }
    return null;
  }
}
