export interface StepValue {
  pattern?: RegExp | string;
  children?: { [key: string]: StepValue };
  match?: (args: string[], text: string) => boolean;
  startsWith?: (args: string[], text: string) => boolean;
  suggest?: ((args: string[], text: string) => any) | any;
  decide?: ((args: string[], text: string) => any) | any;
}

export class Step {
  label: string;
  value: StepValue;
  level: number;
  parent: Step | null;
  pattern: RegExp | string;
  children: Step[] = [];
  road: string;

  constructor(label: string, value: StepValue, level: number, parent?: Step) {
    this.label = label;
    this.value = value;
    this.level = level;
    this.parent = parent || null;
    this.pattern = value.pattern || label;

    if (value.match) {
      this.match = value.match;
    }
    if (value.startsWith) {
      this.startsWith = value.startsWith;
    }

    if (value.children) {
        for (const [childKey, childVal] of Object.entries(value.children)) {
            this.children.push(new Step(childKey, childVal, this.level + 1, this));
        }
    }
  }

  match(args: string[], text: string): boolean {
    if (this.pattern instanceof RegExp) {
      return this.pattern.test(args[this.level]);
    } else {
      return this.pattern === args[this.level];
    }
  }

  startsWith(args: string[], text: string): boolean {
    if (this.pattern instanceof RegExp) {
      return this.pattern.test(args[this.level]);
    } else {
      return (this.pattern as string).indexOf(args[this.level]) === 0;
    }
  }

  suggest(args: string[], text: string): any[] {
    let suggestions: any[] = [];
    const size0 = args.length - 1;
    if (this.level === size0) {
      if (this.startsWith(args, text) && "suggest" in this.value) {
        suggestions = suggestions.concat(this.getSuggestValue(args, text));
      }
      suggestions = suggestions.concat(this.getChildSuggest(args, text));
    } else if (this.level < size0) {
      if (this.match(args, text)) {
        suggestions = suggestions.concat(this.getChildSuggest(args, text));
        if ("suggest" in this.value) {
          suggestions = suggestions.concat(this.getSuggestValue(args, text));
        }
      }
    }
    return suggestions;
  }

  getChildSuggest(args: string[], text: string): any[] {
    let suggestions: any[] = [];
    this.children.forEach((childStep) => {
      suggestions = suggestions.concat(childStep.suggest(args, text));
    });
    return suggestions;
  }

  decide(args: string[], text: string): any {
    let childDecision;
    const size0 = args.length - 1;
    if (this.match(args, text)) {
      if (this.level === size0) {
        if ("decide" in this.value) {
          return this.getDecideValue(args, text);
        }
      } else if (this.level < size0) {
        for (let i = 0; i < this.children.length; i++) {
          childDecision = this.children[i].decide(args, text);
          if (childDecision !== undefined) {
            return childDecision;
          }
        }
      }
    }
    return undefined;
  }

  getRoad(): string {
    if (this.road) return this.road;

    const steps: string[] = [];
    let aStep: Step = this;
    do {
      steps.unshift(aStep.label);
    } while ((aStep = aStep.parent));

    return (this.road = steps.join(" "));
  }

  getSuggestValue(args: string[], text: string): any {
    if (typeof this.value.suggest === 'function') {
      return this.value.suggest.call(this, args, text);
    } else {
      return this.value.suggest;
    }
  }

  getDecideValue(args: string[], text: string): any {
    if (typeof this.value.decide === 'function') {
      return this.value.decide.call(this, args, text);
    } else {
      return this.value.decide;
    }
  }
}
