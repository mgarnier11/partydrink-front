import { Hook, HookContext } from '@feathersjs/feathers';
import * as Validator from 'validate.js';
import { GameType } from '../classes/gameType.class';

export function afterAllHook(options = {}): Hook {
  return (context: HookContext) => {
    if (Validator.isArray(context.result)) {
      let oldResults = [...context.result];
      context.result = [];

      for (let data of oldResults) {
        context.result.push(convertToClass(data));
      }
    } else {
      context.result = convertToClass(context.result);
    }

    return context;
  };
}

function convertToClass(data: any): GameType {
  if (data instanceof GameType) return data;
  else return GameType.fromBack(data);
}
