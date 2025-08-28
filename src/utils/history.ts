import { produce } from "immer";
import { HistoryStructureJson, Scene } from "../models";

export function diff(obj1: any, obj2: any) {
  const ops: { [k: string]: { op: 'add' | 'remove' | 'replace'; path: string; value?: any } } = {};
  let idx = 0;

  const isObject = (v: any) => v && typeof v === 'object' && !Array.isArray(v);

  const isEqual = (a: any, b: any): boolean => {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (a == null || b == null) return false;
    if (typeof a !== 'object') return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    if (Array.isArray(a)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) if (!isEqual(a[i], b[i])) return false;
      return true;
    }
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const k of aKeys) {
      if (!isEqual(a[k], b[k])) return false;
    }
    return true;
  };

  const walk = (basePath: string, a: any, b: any) => {
    if (a === b) return;

    const aIsObj = isObject(a) || Array.isArray(a);
    const bIsObj = isObject(b) || Array.isArray(b);

    if (aIsObj && bIsObj) {
      // Keys union
      const aKeys = new Set<string>(Array.isArray(a) ? a.map((_, i) => String(i)) : Object.keys(a));
      const bKeys = new Set<string>(Array.isArray(b) ? b.map((_, i) => String(i)) : Object.keys(b));

      // Removed
      Array.from(aKeys).forEach(k => {
        if (!bKeys.has(k)) {
          ops[idx++] = { op: 'remove', path: `${basePath}/${k}` };
        }
      });
      // Added or changed
      Array.from(bKeys).forEach(k => {
        const subPath = `${basePath}/${k}`;
        if (!aKeys.has(k)) {
          ops[idx++] = { op: 'add', path: subPath, value: b[k] };
        } else {
          const av = a[k];
          const bv = b[k];
          if (av !== bv) { // skip equal
            const bothObj = (isObject(av) || Array.isArray(av)) && (isObject(bv) || Array.isArray(bv));
            if (bothObj && !isEqual(av, bv)) {
              walk(subPath, av, bv);
            } else if (!bothObj && av !== bv) {
              ops[idx++] = { op: 'replace', path: subPath, value: bv };
            } else if (bothObj && !isEqual(av, bv)) {
              walk(subPath, av, bv);
            }
          }
        }
      });
    } else {
      ops[idx++] = { op: (a === undefined ? 'add' : b === undefined ? 'remove' : 'replace'), path: basePath || '/', value: b };
    }
  };

  walk('', obj1, obj2);
  return ops;
};

export function patch(obj: object, diffObj): object {
  if (!diffObj || typeof diffObj !== 'object') return obj;

  // Sort numeric-like keys to preserve original generation order
  const ops = Object.keys(diffObj)
    .sort((a, b) => Number(a) - Number(b))
    .map(k => diffObj[k]);

  let result: any = obj;

  const applyOnDraft = (draft: any, path: string, op: 'add' | 'remove' | 'replace', value: any) => {
    if (!path || path === '/') {
      // Root handled outside produce (we never mutate root inside this helper)
      return;
    }
    const parts = path.split('/').filter(Boolean); // remove empty caused by leading '/'
    if (!parts.length) return;
    const lastKey = parts[parts.length - 1];
    let parent = draft;
    for (let i = 0; i < parts.length - 1; i++) {
      const key = parts[i];
      if (parent == null) return; // path invalid
      parent = parent[key];
    }

    if (parent == null) return; // invalid path, skip

    if (op === 'add' || op === 'replace') {
      if (Array.isArray(parent)) {
        const idx = Number(lastKey);
        if (!Number.isNaN(idx)) {
          parent[idx] = value;
        } else {
          (parent as any)[lastKey] = value;
        }
      } else {
        parent[lastKey] = value;
      }
    } else if (op === 'remove') {
      if (Array.isArray(parent)) {
        const idx = Number(lastKey);
        if (!Number.isNaN(idx)) {
          parent.splice(idx, 1);
        } else {
          delete parent[lastKey];
        }
      } else {
        delete parent[lastKey];
      }
    }
  };

  for (const { op, path, value } of ops) {
    // Handle root-level operations directly (cannot reassign draft root inside produce)
    if (path === '/' || path === '') {
      if (op === 'remove') {
        result = undefined;
      } else if (op === 'add' || op === 'replace') {
        result = value;
      }
      continue;
    }

    result = produce(result, draft => {
      applyOnDraft(draft, path, op, value);
    });
  }

  return result;
};

export function historyPush(historyStructure: HistoryStructureJson, item: Scene) {
  if (historyStructure.last) {
    if (historyStructure.last !== item) {
      const toPush = {
        time: Date.now(),
        diff: diff(historyStructure.last, item)
      };

      historyStructure = produce(historyStructure, draft => {
        draft.last = item;
        draft.list.push(toPush);
      });
    }
  } else {
    historyStructure = produce(historyStructure, draft => {
      draft.last = item;
    });
  }
  return historyStructure;
};

export function historyPop(historyStructure: HistoryStructureJson) {
  if (historyStructure.last) {
    if (historyStructure.list.length) {
      let last = historyStructure.first;
      for (let x = 0; x < historyStructure.list.length - 1; x++) {
        last = patch(last, historyStructure.list[x].diff) as Scene;
      }

      historyStructure = produce(historyStructure, draft => {
        draft.last = last;
        draft.list = draft.list.slice(0, -1);
      });
    }
  }
  return historyStructure;
};
