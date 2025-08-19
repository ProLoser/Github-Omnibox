type ResolveCallback<T> = (value: T) => T | void;

export class Defer<T> {
  private resolved = false;
  private resolveValue: T = null;
  private cb: ResolveCallback<T>[] = null;

  constructor() {}

  resolve(value: T): this {
    this.resolved = true;
    this.resolveValue = value;
    if (this.cb) {
      this.cb.forEach((cb) => {
        this.resolveValue = cb(this.resolveValue) || this.resolveValue;
      });
    }
    return this;
  }

  done(cb: ResolveCallback<T>): this {
    if (this.resolved) {
      this.resolveValue = cb(this.resolveValue) || this.resolveValue;
    } else {
      if (!this.cb) {
        this.cb = [cb];
      } else {
        this.cb.push(cb);
      }
    }
    return this;
  }

  static allDone(values: any[], eachDone: (values: any[], startingIndex: number) => void): void {
    let startingIndex: number;
    values = values.slice();
    if (Array.isArray(values)) {
      startingIndex = values.length;
      for (let i = values.length - 1; i >= 0; i--) {
        if (values[i] instanceof Defer) {
          if (values[i].resolved) {
            startingIndex = i;
            if (Array.isArray(values[i].resolveValue)) {
              values.splice(i, 1, ...values[i].resolveValue);
            } else {
              values[i] = values[i].resolveValue;
            }
          } else {
            ((i: number) => {
              values.splice(i, 1)[0].done((val: any) => {
                val = Array.isArray(val) ? val : [val];
                eachDone(val, i);
              });
            })(i);
          }
        } else {
          startingIndex = i;
        }
      }
      eachDone(values, startingIndex);
    } else {
      if (values instanceof Defer) {
        (values as Defer<any>).done(eachDone);
      } else {
        eachDone(values, 0);
      }
    }
  }

  static eachDone(value: any, eachDone: (value: any, index: number) => void): void {
    if (Array.isArray(value)) {
      value.forEach((val, index) => {
        if (val instanceof Defer) {
          val.done((result: any) => {
            if (Array.isArray(result)) {
              result.forEach((item, i) => {
                const addedIndex = (i + 1) / (result.length + 2);
                eachDone(item, index + addedIndex);
              });
            } else {
              eachDone(result, index);
            }
          });
        } else {
          eachDone(val, index);
        }
      });
    } else {
      if (value instanceof Defer) {
        (value as Defer<any>).done((result: any) => eachDone(result, 0));
      } else {
        eachDone(value, 0);
      }
    }
  }
}
